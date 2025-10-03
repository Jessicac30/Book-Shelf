// src/app/api/books/[id]/route.ts

import { NextResponse } from "next/server";
// Importando as FUNÇÕES do seu store
import { updateBook, deleteBook, getBook } from "@/data/store";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patchData = await req.json();
    const updatedBook = await updateBook(params.id, patchData);
    return NextResponse.json(updatedBook);
  } catch (error: any) {
    // A função updateBook lança um erro se não encontra, então capturamos ele aqui
    if (error.message === "not found") {
      return NextResponse.json(
        { message: "Livro não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Erro interno do servidor ao atualizar livro." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificamos se o livro existe antes de deletar para dar um retorno 404 correto
    const bookExists = await getBook(params.id);
    if (!bookExists) {
      return NextResponse.json(
        { message: "Livro não encontrado" },
        { status: 404 }
      );
    }

    await deleteBook(params.id);
    // Retorna uma resposta vazia com status 204 (No Content), que é o padrão para DELETE bem-sucedido
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro interno do servidor ao deletar livro." },
      { status: 500 }
    );
  }
}
