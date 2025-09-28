// src/app/biblioteca/page.tsx
import type { Book } from "@/types/book";
import BibliotecaClient from "./BibliotecaClient";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001";

export default async function BibliotecaPage() {
  const res = await fetch(`${BASE}/api/books`, { cache: "no-store" });
  const books: Book[] = res.ok ? await res.json() : [];
  return <BibliotecaClient initialBooks={books} />;
}
