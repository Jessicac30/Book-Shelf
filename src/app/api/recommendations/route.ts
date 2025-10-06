import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

interface RecommendationItem {
  id: string;
  title: string;
  author: string;
  cover?: string;
  synopsis?: string;
  pages?: number;
  publishedYear?: number;
  isbn?: string;
  genre?: string;
  reason: string;
  relevanceScore?: number;
}

export async function GET(req: Request) {
  try {
    // Buscar livros do usuário (ordenados por rating para priorizar os favoritos)
    const userBooks = await prisma.book.findMany({
      include: { genre: true },
    });

    if (userBooks.length === 0) {
      return NextResponse.json({
        recommendations: [],
        message: "Adicione alguns livros à sua biblioteca para receber recomendações personalizadas!",
        analysis: null,
      });
    }

    // Usar Gemini para análise inteligente
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      // Fallback para análise simples sem IA
      return await getFallbackRecommendations(userBooks);
    }

    // Análise com Gemini AI
    const analysis = await analyzeWithGemini(userBooks, geminiApiKey);

    // Buscar livros no Google Books baseado na análise do Gemini
    const recommendations = await fetchBooksFromQueries(
      analysis.searchQueries,
      userBooks
    );

    // Ranquear com Gemini (opcional, se tiver tempo/requisições)
    const rankedRecommendations = await rankRecommendations(
      recommendations,
      analysis.userProfile,
      geminiApiKey
    );

    return NextResponse.json({
      recommendations: rankedRecommendations,
      analysis: {
        totalBooks: userBooks.length,
        profile: analysis.userProfile,
        favoriteGenres: analysis.topGenres,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar recomendações:", error);

    // Fallback em caso de erro
    try {
      const userBooks = await prisma.book.findMany({
        include: { genre: true },
      });
      return await getFallbackRecommendations(userBooks);
    } catch {
      return NextResponse.json(
        { error: "Erro ao buscar recomendações" },
        { status: 500 }
      );
    }
  }
}

async function analyzeWithGemini(books: any[], apiKey: string) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Preparar dados dos livros para o Gemini
    const booksData = books.map((b) => ({
      title: b.title,
      author: b.author,
      genre: b.genre?.name || "Não especificado",
      rating: b.rating || 0,
      status: b.status,
      pages: b.pages,
    }));

    const prompt = `
Você é um especialista em recomendações de livros. Analise a biblioteca abaixo e forneça recomendações personalizadas.

BIBLIOTECA DO USUÁRIO:
${JSON.stringify(booksData, null, 2)}

Por favor, responda APENAS com um JSON válido no seguinte formato:
{
  "userProfile": "Breve descrição do perfil de leitor (1-2 frases)",
  "topGenres": ["gênero1", "gênero2", "gênero3"],
  "searchQueries": [
    "query de busca 1 para Google Books",
    "query de busca 2 para Google Books",
    "query de busca 3 para Google Books",
    "query de busca 4 para Google Books"
  ],
  "reasoning": "Por que essas queries foram escolhidas (1 frase)"
}

IMPORTANTE:
- PRIORIZE livros com rating 5 (são os que o usuário mais gostou)
- Baseie as recomendações principalmente nos livros com maior avaliação
- As searchQueries devem ser em inglês para buscar no Google Books
- Considere gêneros e autores dos livros mais bem avaliados
- Considere a diversidade (não só um gênero)
- Não inclua livros que o usuário já tem
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Extrair JSON da resposta (Gemini às vezes adiciona markdown)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Gemini não retornou JSON válido");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error("Erro ao analisar com Gemini:", error);
    console.error("Status:", error.status, "Message:", error.message);
    throw error; // Re-throw para usar fallback
  }
}

async function fetchBooksFromQueries(
  queries: string[],
  userBooks: any[]
): Promise<RecommendationItem[]> {
  const recommendations: RecommendationItem[] = [];
  const existingTitles = new Set(
    userBooks.map((b) => b.title.toLowerCase())
  );
  const googleBooksKey = process.env.GOOGLE_BOOKS_API_KEY;

  for (const query of queries) {
    try {
      const url = new URL(GOOGLE_BOOKS_API);
      url.searchParams.set("q", query);
      url.searchParams.set("maxResults", "10");
      url.searchParams.set("orderBy", "relevance");
      // Adicionar aleatoriedade para variar recomendações
      const randomStart = Math.floor(Math.random() * 3) * 10;
      if (randomStart > 0) {
        url.searchParams.set("startIndex", randomStart.toString());
      }
      if (googleBooksKey) {
        url.searchParams.set("key", googleBooksKey);
      }

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        const items = data.items || [];

        for (const item of items) {
          const book = mapGoogleBookToRecommendation(item, query);

          if (book && !existingTitles.has(book.title.toLowerCase())) {
            recommendations.push(book);
            existingTitles.add(book.title.toLowerCase());

            // Limitar a 15 recomendações totais
            if (recommendations.length >= 15) break;
          }
        }
      }

      if (recommendations.length >= 15) break;
    } catch (error) {
      console.error(`Erro ao buscar query "${query}":`, error);
    }
  }

  return recommendations;
}

async function rankRecommendations(
  recommendations: RecommendationItem[],
  userProfile: string,
  apiKey: string
): Promise<RecommendationItem[]> {
  // Se tiver muitas recomendações, usar Gemini para ranquear
  if (recommendations.length <= 12) {
    return recommendations.slice(0, 12);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const booksToRank = recommendations.map((r, idx) => ({
      index: idx,
      title: r.title,
      author: r.author,
      genre: r.genre,
    }));

    const prompt = `
Perfil do leitor: ${userProfile}

Livros para ranquear:
${JSON.stringify(booksToRank, null, 2)}

Retorne APENAS um JSON array com os índices dos 12 melhores livros, ordenados por relevância:
[0, 5, 2, 8, 1, 3, 10, 7, 4, 9, 6, 11]
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const indices = JSON.parse(response.match(/\[[\d,\s]+\]/)?.[0] || "[]");

    return indices
      .slice(0, 12)
      .map((idx: number) => recommendations[idx])
      .filter(Boolean);
  } catch (error) {
    console.error("Erro ao ranquear com Gemini:", error);
    // Fallback: retornar primeiros 12
    return recommendations.slice(0, 12);
  }
}

function mapGoogleBookToRecommendation(
  item: any,
  searchQuery: string
): RecommendationItem | null {
  const v = item?.volumeInfo ?? {};
  const title = v.title;
  const author = Array.isArray(v.authors) && v.authors.length ? v.authors[0] : "";

  if (!title || !author) return null;

  const identifiers = Array.isArray(v.industryIdentifiers) ? v.industryIdentifiers : [];
  const isbn13 = identifiers.find((i: any) => i.type === "ISBN_13")?.identifier;
  const isbn10 = identifiers.find((i: any) => i.type === "ISBN_10")?.identifier;

  return {
    id: item.id,
    title,
    author,
    cover: v.imageLinks?.thumbnail ?? v.imageLinks?.smallThumbnail,
    synopsis: v.description,
    pages: v.pageCount,
    publishedYear: v.publishedDate
      ? Number(String(v.publishedDate).slice(0, 4))
      : undefined,
    isbn: isbn13 ?? isbn10,
    genre: Array.isArray(v.categories) && v.categories.length
      ? v.categories[0]
      : undefined,
    reason: searchQuery,
  };
}

// Fallback simples quando Gemini não está disponível
async function getFallbackRecommendations(userBooks: any[]) {
  const recommendations: RecommendationItem[] = [];
  const existingTitles = new Set(userBooks.map((b) => b.title.toLowerCase()));

  // Priorizar livros com maior avaliação (5 estrelas = mais gostou)
  const topRatedBooks = userBooks
    .filter((b) => b.rating && b.rating >= 4)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const booksToAnalyze = topRatedBooks.length > 0 ? topRatedBooks : userBooks;

  // Estratégia 1: Buscar por gêneros dos livros mais bem avaliados
  const genreCount = new Map<string, number>();
  booksToAnalyze.forEach((book) => {
    const genre = book.genre?.name;
    if (genre) {
      const weight = book.rating === 5 ? 3 : book.rating === 4 ? 2 : 1;
      genreCount.set(genre, (genreCount.get(genre) || 0) + weight);
    }
  });

  const topGenres = Array.from(genreCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);

  for (const genre of topGenres) {
    try {
      const url = new URL(GOOGLE_BOOKS_API);
      url.searchParams.set("q", `subject:${genre}`);
      url.searchParams.set("maxResults", "8");
      url.searchParams.set("orderBy", "relevance");
      // Adicionar aleatoriedade
      const randomStart = Math.floor(Math.random() * 3) * 10;
      if (randomStart > 0) {
        url.searchParams.set("startIndex", randomStart.toString());
      }

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        const items = (data.items || []).slice(0, 4);

        for (const item of items) {
          const book = mapGoogleBookToRecommendation(
            item,
            `Gênero: ${genre}`
          );

          if (book && !existingTitles.has(book.title.toLowerCase())) {
            recommendations.push(book);
            existingTitles.add(book.title.toLowerCase());
          }
        }
      }
    } catch (error) {
      console.error(`Erro ao buscar ${genre}:`, error);
    }
  }

  // Estratégia 2: Buscar por autores dos livros mais bem avaliados
  const authorCount = new Map<string, number>();
  booksToAnalyze.forEach((book) => {
    const author = book.author;
    if (author) {
      const weight = book.rating === 5 ? 3 : book.rating === 4 ? 2 : 1;
      authorCount.set(author, (authorCount.get(author) || 0) + weight);
    }
  });

  const topAuthors = Array.from(authorCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([author]) => author);

  for (const author of topAuthors) {
    try {
      const url = new URL(GOOGLE_BOOKS_API);
      url.searchParams.set("q", `inauthor:"${author}"`);
      url.searchParams.set("maxResults", "8");
      // Adicionar aleatoriedade
      const randomStart = Math.floor(Math.random() * 2) * 5;
      if (randomStart > 0) {
        url.searchParams.set("startIndex", randomStart.toString());
      }

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        const items = (data.items || []).slice(0, 3);

        for (const item of items) {
          const book = mapGoogleBookToRecommendation(
            item,
            `Autor: ${author}`
          );

          if (book && !existingTitles.has(book.title.toLowerCase())) {
            recommendations.push(book);
            existingTitles.add(book.title.toLowerCase());
            if (recommendations.length >= 12) break;
          }
        }
      }
    } catch (error) {
      console.error(`Erro ao buscar autor ${author}:`, error);
    }

    if (recommendations.length >= 12) break;
  }

  // Estratégia 3: Livros relacionados aos mais bem avaliados
  if (recommendations.length < 12) {
    // Usar livros já filtrados por rating (topRatedBooks)
    const booksToSearch = topRatedBooks.slice(0, 3);

    for (const book of booksToSearch) {
      try {
        const url = new URL(GOOGLE_BOOKS_API);
        url.searchParams.set("q", `"${book.title}" "${book.author}"`);
        url.searchParams.set("maxResults", "5");

        const res = await fetch(url.toString());
        if (res.ok) {
          const data = await res.json();
          const items = (data.items || []).slice(1, 4); // Pula o primeiro (é o mesmo livro)

          for (const item of items) {
            const newBook = mapGoogleBookToRecommendation(
              item,
              `Similar a: ${book.title}`
            );

            if (newBook && !existingTitles.has(newBook.title.toLowerCase())) {
              recommendations.push(newBook);
              existingTitles.add(newBook.title.toLowerCase());
              if (recommendations.length >= 12) break;
            }
          }
        }
      } catch (error) {
        console.error(`Erro ao buscar relacionados:`, error);
      }

      if (recommendations.length >= 12) break;
    }
  }

  const favoriteBooks = topRatedBooks.slice(0, 2).map(b => b.title);

  return NextResponse.json({
    recommendations: recommendations.slice(0, 12),
    analysis: {
      totalBooks: userBooks.length,
      favoriteGenres: topGenres.length > 0 ? topGenres : ["Baseado nos seus livros favoritos"],
      profile: topRatedBooks.length > 0
        ? `Recomendações baseadas nos seus ${topRatedBooks.length} livros mais bem avaliados${favoriteBooks.length > 0 ? `: ${favoriteBooks.join(", ")}` : ""}`
        : `Você tem ${userBooks.length} livros de ${topAuthors.join(", ")} e outros autores`,
    },
    message: topGenres.length === 0
      ? "💡 Dica: Adicione avaliações aos seus livros para recomendações ainda melhores!"
      : "✨ Recomendações baseadas nos seus livros favoritos!",
  });
}
