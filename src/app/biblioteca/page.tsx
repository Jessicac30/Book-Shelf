// src/app/biblioteca/page.tsx
import type { Book } from "@/types/book";
import BibliotecaClient from "./BibliotecaClient";
import { mockBooks } from "@/data/mock-books";

export default async function BibliotecaPage() {
  // Passa os livros mock como fallback inicial
  return <BibliotecaClient initialBooks={mockBooks} />;
}
