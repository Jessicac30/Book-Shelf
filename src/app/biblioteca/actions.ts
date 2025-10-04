"use server";

import { revalidatePath } from "next/cache";
import type { Book } from "@/types/book";
import { prisma } from "@/lib/prisma";

export async function createBookFromClient(data: Omit<Book, "id">) {
  // Resolver/garantir gênero
  let genreId: string | undefined;
  if (data.genre) {
    const g = await prisma.genre.upsert({
      where: { name: data.genre },
      create: { name: data.genre },
      update: {},
    });
    genreId = g.id;
  }

  // status derivado se não informado
  let derivedStatus = data.status;
  if (!derivedStatus) {
    const current = data.currentPage ?? 0;
    const total = data.pages ?? 0;
    if (total > 0 && current >= total) derivedStatus = 'LIDO';
    else if (current > 0) derivedStatus = 'LENDO';
    else derivedStatus = 'QUERO_LER';
  }

  const created = await prisma.book.create({
    data: {
      title: data.title,
      author: data.author,
      year: data.year ?? null,
      pages: data.pages ?? null,
      currentPage: data.currentPage ?? 0,
      status: derivedStatus,
      isbn: data.isbn ?? null,
      cover: data.cover ?? null,
      rating: data.rating ?? 0,
      synopsis: data.synopsis ?? null,
      notes: data.notes ?? null,
      genreId,
    },
    include: { genre: true },
  });

  revalidatePath("/biblioteca");
  return created;
}

export async function updateBookFromClient(id: string, patch: Partial<Book>) {
  let genreId: string | undefined;
  if (typeof patch.genre === "string" && patch.genre.trim()) {
    const g = await prisma.genre.upsert({
      where: { name: patch.genre },
      create: { name: patch.genre },
      update: {},
    });
    genreId = g.id;
  }

  // Buscar livro existente para comparar valores
  const existing = await prisma.book.findUnique({ where: { id } });

  // Determinar valores atualizados
  const total = patch.pages ?? existing?.pages ?? 0;
  const current = patch.currentPage ?? existing?.currentPage ?? 0;

  // Derivar status baseado nas páginas, EXCETO se o usuário mudou o status manualmente
  let statusToSet = patch.status;

  // Se o status no patch é o mesmo que o status existente, considerar derivação automática
  // Isso permite que mudanças nas páginas atualizem o status automaticamente
  if (statusToSet === existing?.status || statusToSet === undefined) {
    if (total > 0 && current >= total) statusToSet = 'LIDO';
    else if (current > 0) statusToSet = 'LENDO';
    else statusToSet = 'QUERO_LER';
  }
  // Se o status foi explicitamente mudado pelo usuário (diferente do existente), respeitar a escolha

  const updated = await prisma.book.update({
    where: { id },
    data: {
      title: patch.title,
      author: patch.author,
      year: patch.year ?? null,
      pages: patch.pages ?? null,
      currentPage: patch.currentPage ?? null,
      status: statusToSet,
      isbn: patch.isbn ?? null,
      cover: patch.cover ?? null,
      rating: patch.rating ?? null,
      synopsis: patch.synopsis ?? null,
      notes: patch.notes ?? null,
      ...(genreId ? { genreId } : {}),
    },
  });

  revalidatePath("/biblioteca");
  return updated;
}

export async function deleteBookFromClient(id: string) {
  await prisma.book.delete({ where: { id } });
  revalidatePath("/biblioteca");
}
