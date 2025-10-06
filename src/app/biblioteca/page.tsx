// src/app/biblioteca/page.tsx
import BibliotecaClient from "./BibliotecaClient";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { BibliotecaSkeleton } from "@/components/skeletons/biblioteca-skeleton";
import { headers } from 'next/headers';

// Desabilitar static generation para esta página
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export default async function BibliotecaPage() {
  // Forçar runtime ao ler headers
  await headers();

  console.log('📚 Carregando livros da biblioteca...');

  const books = await prisma.book.findMany({
    include: { genre: true },
    orderBy: { createdAt: "desc" }
  });

  console.log(`✅ ${books.length} livros carregados`);

  return (
    <Suspense fallback={<BibliotecaSkeleton />}>
      <BibliotecaClient initialBooks={books} />
    </Suspense>
  );
}
