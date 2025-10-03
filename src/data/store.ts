import type { Book } from "@/types/book";
import { mockBooks } from "@/data/mock-books";

type DB = { books: Book[]; genres: string[] };

const g = globalThis as any;

if (!g.__BOOKS_DB__) {
  const genres = Array.from(
    new Set(mockBooks.map((b) => b.genre).filter(Boolean))
  ) as string[];

  g.__BOOKS_DB__ = { books: [...mockBooks], genres } as DB;
}

export const db: DB = g.__BOOKS_DB__;

// CRUD central da aplicação
export async function listBooks(): Promise<Book[]> {
  return db.books;
}

export async function getBook(id: string): Promise<Book | null> {
  return db.books.find((b) => b.id === id) ?? null;
}

export async function createBook(data: Omit<Book, "id">): Promise<Book> {
  const id = (global as any).crypto?.randomUUID?.() ?? String(Date.now());
  const book: Book = { id, ...data };
  db.books.push(book);
  return book;
}

export async function updateBook(
  id: string,
  patch: Partial<Omit<Book, "id">>
): Promise<Book> {
  const i = db.books.findIndex((b) => b.id === id);
  if (i === -1) throw new Error("not found");
  db.books[i] = { ...db.books[i], ...patch, id };
  return db.books[i];
}

export async function deleteBook(id: string): Promise<void> {
  db.books = db.books.filter((b) => b.id !== id);
}
