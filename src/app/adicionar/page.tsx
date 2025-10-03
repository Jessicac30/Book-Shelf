import { redirect } from "next/navigation";
import { createBook } from "../biblioteca/actions";
import { BookForm } from "@/components/book-form";

export default function AdicionarPage() {
  async function action(formData: FormData) {
    "use server";
    await createBook({
      title: String(formData.get("title") || ""),
      author: String(formData.get("author") || ""),
      genre: (formData.get("genre") as any) || undefined,
      year: formData.get("year") ? Number(formData.get("year")) : undefined,
      pages: formData.get("pages") ? Number(formData.get("pages")) : undefined,
      currentPage: formData.get("currentPage")
        ? Number(formData.get("currentPage"))
        : 0,
      status: (formData.get("status") as any) || "QUERO_LER",
      isbn: formData.get("isbn")?.toString() || "",
      cover: formData.get("cover")?.toString() || "",
      rating: formData.get("rating") ? Number(formData.get("rating")) : 0,
      synopsis: formData.get("synopsis")?.toString() || "",
      notes: formData.get("notes")?.toString() || "",
    });
    redirect("/biblioteca");
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BookForm onSubmitAction={action} cancelHref="/biblioteca" />
    </div>
  );
}
