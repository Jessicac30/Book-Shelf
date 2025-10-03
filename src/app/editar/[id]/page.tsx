import { redirect } from "next/navigation";
import { getBook } from "@/data/store";
import { updateBook } from "../../biblioteca/actions"; // <- actions dentro de /biblioteca
import { BookForm } from "@/components/book-form";

export default async function EditBookPage({
  params,
}: {
  params: { id: string };
}) {
  const book = await getBook(params.id);
  if (!book) return <div className="p-6">Livro não encontrado.</div>;

  async function action(formData: FormData) {
    "use server";
    await updateBook(params.id, {
      title: formData.get("title")?.toString() || undefined,
      author: formData.get("author")?.toString() || undefined,
      genre: (formData.get("genre") as any) || undefined,
      year: formData.get("year") ? Number(formData.get("year")) : undefined,
      pages: formData.get("pages") ? Number(formData.get("pages")) : undefined,
      currentPage: formData.get("currentPage")
        ? Number(formData.get("currentPage"))
        : undefined,
      status: (formData.get("status") as any) || undefined,
      isbn: formData.get("isbn")?.toString() || undefined,
      cover: formData.get("cover")?.toString() || undefined,
      rating: formData.get("rating")
        ? Number(formData.get("rating"))
        : undefined,
      synopsis: formData.get("synopsis")?.toString() || undefined,
      notes: formData.get("notes")?.toString() || undefined,
    });

    redirect("/biblioteca"); // volta após salvar
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BookForm
        book={book}
        onSubmitAction={action}
        cancelHref="/biblioteca"
        isEditing
      />
    </div>
  );
}
