// src/app/biblioteca/page.tsx
import type { Book } from "@/types/book";
import BibliotecaClient from "./BibliotecaClient";
import { db } from "@/data/store";

export default async function BibliotecaPage() {
  // Usar diretamente o store em vez de fetch interno
  const books: Book[] = db.books;
  return <BibliotecaClient initialBooks={books} />;
}
