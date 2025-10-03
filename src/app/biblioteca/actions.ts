"use server";

import { revalidatePath } from "next/cache";
import type { Book } from "@/types/book";
import {
  createBook as create,
  updateBook as update,
  deleteBook as remove,
} from "@/data/store";

export async function createBook(data: Omit<Book, "id">) {
  const b = await create({
    status: data.status ?? "QUERO_LER",
    currentPage: data.currentPage ?? 0,
    ...data,
  });
  revalidatePath("/biblioteca");
  return b;
}

export async function updateBook(id: string, patch: Partial<Book>) {
  const b = await update(id, patch);
  revalidatePath("/biblioteca");
  return b;
}

export async function deleteBook(id: string) {
  await remove(id);
  revalidatePath("/biblioteca");
}
