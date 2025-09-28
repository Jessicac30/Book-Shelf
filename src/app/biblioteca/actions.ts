"use server";

import { revalidatePath } from "next/cache";
import type { Book } from "@/types/book";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3007";

export async function createBookFromClient(data: Omit<Book, "id">) {
  const res = await fetch(`${BASE}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`POST /api/books -> ${res.status} ${msg}`);
  }
  // atualizar a lista da página
  revalidatePath("/biblioteca");
  // **sem redirect aqui**
  return await res.json(); // opcional: devolve o livro criado
}

export async function updateBookFromClient(id: string, patch: Partial<Book>) {
  const res = await fetch(`${BASE}/api/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`PUT /api/books/${id} -> ${res.status} ${msg}`);
  }
  revalidatePath("/biblioteca");
  return await res.json();
}

export async function deleteBookFromClient(id: string) {
  const res = await fetch(`${BASE}/api/books/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`DELETE /api/books/${id} -> ${res.status} ${msg}`);
  }
  revalidatePath("/biblioteca");
}
