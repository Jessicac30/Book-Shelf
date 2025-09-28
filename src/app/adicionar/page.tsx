"use client";

import { useRouter } from "next/navigation";
import { BookForm } from "@/components/book-form";
import { useNotification } from "@/components/notification";
import type { Book } from "@/types/book";
import { bookService } from "@/lib/book-service";

export default function AdicionarPage() {
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = (data: Omit<Book, "id">) => {
    if (!data.title || !data.author || !data.genre) {
      showNotification(
        "error",
        "Preencha Título, Autor e selecione um Gênero."
      );
      return;
    }
    try {
      const newBook = bookService.addBook(data);
      showNotification("success", `Livro "${data.title}" adicionado!`);
      router.push("/biblioteca");
    } catch (e: any) {
      showNotification("error", e?.message ?? "Erro ao adicionar.");
    }
  };

  const handleCancel = () => router.push("/biblioteca");

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BookForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
