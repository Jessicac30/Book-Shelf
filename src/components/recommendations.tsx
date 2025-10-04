"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Plus, BookOpen, TrendingUp } from "lucide-react";
import { DefaultBookCover } from "./default-book-cover";
import { useRouter } from "next/navigation";
import { useNotification } from "./notification";
import { createBookFromClient } from "@/app/biblioteca/actions";

interface Recommendation {
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
}

interface Analysis {
  totalBooks: number;
  profile?: string;
  favoriteGenres?: string[];
}

export function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingBook, setAddingBook] = useState<string | null>(null);

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommendations");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao buscar recomendações");
      }

      setRecommendations(data.recommendations || []);
      setAnalysis(data.analysis || null);
    } catch (err: any) {
      setError(err.message);
      showNotification("error", "Erro ao buscar recomendações");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (book: Recommendation) => {
    setAddingBook(book.id);
    try {
      await createBookFromClient({
        title: book.title,
        author: book.author,
        genre: book.genre,
        pages: book.pages,
        year: book.publishedYear,
        isbn: book.isbn,
        cover: book.cover,
        synopsis: book.synopsis,
        status: "QUERO_LER",
        currentPage: 0,
        rating: 0,
        notes: `Recomendado: ${book.reason}`,
      } as any);

      showNotification("success", `"${book.title}" adicionado à sua biblioteca!`);

      // Remover da lista de recomendações
      setRecommendations((prev) => prev.filter((r) => r.id !== book.id));
    } catch (error) {
      showNotification("error", "Erro ao adicionar livro");
    } finally {
      setAddingBook(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
        </Card>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-3">
                  <Skeleton className="w-20 h-28 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="p-8 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={fetchRecommendations} variant="outline">
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="border-blue-200 dark:border-blue-800">
        <CardContent className="p-8 text-center">
          <Sparkles className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Sem novas recomendações no momento
          </h3>
          <p className="text-muted-foreground">
            Adicione mais livros e avaliações à sua biblioteca para receber novas sugestões personalizadas!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com análise */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-purple-600" size={24} />
            Recomendações Personalizadas
          </CardTitle>
          <CardDescription className="text-gray-700 dark:text-gray-300">
            {analysis?.profile || "Baseado nos seus livros favoritos"}
          </CardDescription>
        </CardHeader>

        {analysis && (
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-purple-600" />
                <span className="text-sm font-medium">
                  {analysis.totalBooks} livros analisados
                </span>
              </div>

              {analysis.favoriteGenres && analysis.favoriteGenres.length > 0 && (
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-600" />
                  <span className="text-sm">
                    Gêneros favoritos: {analysis.favoriteGenres.join(", ")}
                  </span>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={fetchRecommendations}
                className="ml-auto"
              >
                <Sparkles size={14} className="mr-1" />
                Atualizar
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Grid de recomendações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((book) => (
          <Card
            key={book.id}
            className="hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex gap-3 mb-3">
                {/* Capa */}
                <div className="w-20 h-28 flex-shrink-0 rounded overflow-hidden shadow-md">
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div className={book.cover ? "hidden" : ""}>
                    <DefaultBookCover
                      title={book.title}
                      author={book.author}
                      genre={book.genre}
                      className="w-full h-full text-xs"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-1">
                    {book.author}
                  </p>
                  {book.genre && (
                    <p className="text-xs text-muted-foreground">{book.genre}</p>
                  )}
                  {book.pages && (
                    <p className="text-xs text-muted-foreground">
                      {book.pages} páginas
                    </p>
                  )}
                </div>
              </div>

              {/* Motivo */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-md p-2 mb-3 flex-1">
                <p className="text-xs text-purple-700 dark:text-purple-300 line-clamp-3">
                  💡 {book.reason}
                </p>
              </div>

              {/* Sinopse */}
              {book.synopsis && (
                <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                  {book.synopsis}
                </p>
              )}

              {/* Botão */}
              <Button
                onClick={() => handleAddBook(book)}
                disabled={addingBook === book.id}
                size="sm"
                className="w-full mt-auto"
              >
                {addingBook === book.id ? (
                  "Adicionando..."
                ) : (
                  <>
                    <Plus size={14} className="mr-1" />
                    Adicionar à Biblioteca
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {recommendations.length >= 12 && (
        <div className="text-center">
          <Button variant="outline" onClick={fetchRecommendations}>
            <Sparkles size={16} className="mr-2" />
            Gerar Novas Recomendações
          </Button>
        </div>
      )}
    </div>
  );
}
