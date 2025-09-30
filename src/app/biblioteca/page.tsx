// src/app/biblioteca/page.tsx
import type { Book } from "@/types/book";
import BibliotecaClient from "./BibliotecaClient";
import { mockBooks } from "@/data/mock-books";
import { Suspense } from "react";

export default async function BibliotecaPage() {
  // Passa os livros mock como fallback inicial
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <BibliotecaClient initialBooks={mockBooks} />
    </Suspense>
  );
}
