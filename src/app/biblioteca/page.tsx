import BibliotecaClient from "./BibliotecaClient";
import { listBooks } from "@/data/store"; // <- direto do store

export default async function BibliotecaPage() {
  const books = await listBooks();
  return <BibliotecaClient initialBooks={books} />;
}
