import type { Book } from "@/types/book";
import { mockBooks } from "@/data/mock-books";

type DB = { books: Book[]; genres: string[] };

const g = globalThis as any;

if (!g.__BOOKS_DB__) {
  const genres = Array.from(
    new Set(mockBooks.map((b) => b.genreId).filter(Boolean))
  ) as string[];

  g.__BOOKS_DB__ = { books: [...mockBooks], genres } as DB;
}

export const db: DB = g.__BOOKS_DB__;
