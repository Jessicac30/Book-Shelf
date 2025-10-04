// src/app/biblioteca/page.tsx
import BibliotecaClient from "./BibliotecaClient";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { BibliotecaSkeleton } from "@/components/skeletons/biblioteca-skeleton";

function mapToClient(b: any) {
  return {
    id: b.id,
    title: b.title,
    author: b.author,
    year: b.year ?? undefined,
    pages: b.pages ?? undefined,
    currentPage: b.currentPage ?? undefined,
    status: b.status ?? undefined,
    isbn: b.isbn ?? undefined,
    cover: b.cover ?? undefined,
    rating: b.rating ?? undefined,
    synopsis: b.synopsis ?? undefined,
    notes: b.notes ?? undefined,
    genre: b.genre?.name ?? undefined,
  };
}

export default async function BibliotecaPage() {
  const books = await prisma.book.findMany({ include: { genre: true }, orderBy: { createdAt: "desc" } });
  return (
    <Suspense fallback={<BibliotecaSkeleton />}>
      <BibliotecaClient initialBooks={books.map(mapToClient)} />
    </Suspense>
  );
}
