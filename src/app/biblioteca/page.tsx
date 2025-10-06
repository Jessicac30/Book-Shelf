// src/app/biblioteca/page.tsx
import BibliotecaClient from "./BibliotecaClient";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { BibliotecaSkeleton } from "@/components/skeletons/biblioteca-skeleton";

// Desabilitar static generation para esta página
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BibliotecaPage() {
  const books = await prisma.book.findMany({
    include: { genre: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <Suspense fallback={<BibliotecaSkeleton />}>
      <BibliotecaClient initialBooks={books} />
    </Suspense>
  );
}
