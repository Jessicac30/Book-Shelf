import { getBook } from "@/data/store";

export default async function BookDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const book = await getBook(params.id);
  if (!book) return <div className="p-6">Livro não encontrado.</div>;

  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-bold">{book.title}</h1>
      <p>Autor: {book.author}</p>
      {book.genre && <p>Gênero: {book.genre}</p>}
      {book.year && <p>Ano: {book.year}</p>}
      {/* coloque aqui o que quiser mostrar */}
    </div>
  );
}
