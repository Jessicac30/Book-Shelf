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

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const book = await prisma.book.findUnique({
    where: { id: params.id },
    include: { genre: true },
  });
  if (!book) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(mapPrismaBookToDto(book));
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const patch = await req.json();
  // Se vier "genre" como string, resolver/validar e mapear para genreId
  let genreId: string | undefined;
  if (typeof patch.genre === "string" && patch.genre.trim()) {
    const genre = await prisma.genre.upsert({
      where: { name: patch.genre },
      create: { name: patch.genre },
      update: {},
    });
    genreId = genre.id;
  }

  // Derivar status se não enviado
  let statusToSet = patch.status;
  if (statusToSet === undefined) {
    const existing = await prisma.book.findUnique({ where: { id: params.id } });
    const total = patch.pages ?? existing?.pages ?? 0;
    const current = patch.currentPage ?? existing?.currentPage ?? 0;
    if (total > 0 && current >= total) statusToSet = 'LIDO';
    else if (current > 0) statusToSet = 'LENDO';
    else statusToSet = 'QUERO_LER';
  }

  const updated = await prisma.book.update({
    where: { id: params.id },
    data: {
      title: patch.title,
      author: patch.author,
      year: patch.year ?? null,
      pages: patch.pages ?? null,
      currentPage: patch.currentPage ?? null,
      status: statusToSet,
      isbn: patch.isbn ?? null,
      cover: patch.cover ?? null,
      rating: patch.rating ?? null,
      synopsis: patch.synopsis ?? null,
      notes: patch.notes ?? null,
      ...(genreId ? { genreId } : {}),
    },
    include: { genre: true },
  });
  return NextResponse.json(mapPrismaBookToDto(updated));
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.book.delete({ where: { id: params.id } });
  return NextResponse.json({ removed: 1 });
}
