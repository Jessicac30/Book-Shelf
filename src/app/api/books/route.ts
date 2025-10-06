import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function mapPrismaBookToDto(book: any) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    year: book.year ?? undefined,
    pages: book.pages ?? undefined,
    currentPage: book.currentPage ?? undefined,
    status: book.status ?? undefined,
    isbn: book.isbn ?? undefined,
    cover: book.cover ?? undefined,
    rating: book.rating ?? undefined,
    synopsis: book.synopsis ?? undefined,
    notes: book.notes ?? undefined,
    genre: book.genre?.name ?? undefined,
  };
}

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: { genre: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(books.map(mapPrismaBookToDto));
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body)
      return NextResponse.json({ error: "invalid body" }, { status: 400 });

    const { title, author, genre, ...rest } = body as {
      title?: string;
      author?: string;
      genre?: string;
      [k: string]: any;
    };
    if (!title || !author) {
      return NextResponse.json(
        { error: "title e author são obrigatórios" },
        { status: 400 }
      );
    }

    // Garantir gênero (find-or-create)
    const genreRecord = genre
      ? await prisma.genre.upsert({ where: { name: genre }, create: { name: genre }, update: {} })
      : null;

    // Derivar status se não enviado
    let derivedStatus = rest.status;
    if (!derivedStatus) {
      const current = rest.currentPage ?? 0;
      const total = rest.pages ?? 0;
      if (total > 0 && current >= total) derivedStatus = 'LIDO';
      else if (current > 0) derivedStatus = 'LENDO';
      else derivedStatus = 'QUERO_LER';
    }

    const created = await prisma.book.create({
      data: {
        title,
        author,
        genreId: genreRecord?.id ?? null,
        year: rest.year ?? null,
        pages: rest.pages ?? null,
        currentPage: rest.currentPage ?? 0,
        status: derivedStatus,
        isbn: rest.isbn ?? null,
        cover: rest.cover ?? null,
        rating: rest.rating ?? 0,
        synopsis: rest.synopsis ?? null,
        notes: rest.notes ?? null,
      },
      include: { genre: true },
    });

    return NextResponse.json(mapPrismaBookToDto(created), { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Failed to create book', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
