"use client";

import { useRouter } from "next/navigation";
import { BookForm } from "@/components/book-form";
import { useNotification } from "@/components/notification";
import { createBookFromClient } from "../biblioteca/actions";
import type { BookFormData } from "@/lib/validations/book";

export default function AdicionarPage() {
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (data: BookFormData) => {
    try {
      await createBookFromClient(data as any);
      showNotification("success", `Livro "${data.title}" adicionado com sucesso!`);
      router.push("/biblioteca");
    } catch (e: any) {
      showNotification("error", e?.message ?? "Erro ao adicionar livro. Tente novamente.");
    }
  };

  const handleCancel = () => router.push("/biblioteca");

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BookForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
