// src/app/api/books/route.ts

import { NextResponse } from "next/server";
// Importando as FUNÇÕES do seu store
import { listBooks, createBook } from "@/data/store";

export async function GET() {
  try {
    const books = await listBooks();
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro interno do servidor ao listar livros." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // A validação de campos obrigatórios pode ficar aqui ou dentro da função createBook
    const { title, author, genre } = body;
    if (!title || !author || !genre) {
      return NextResponse.json(
        { message: "Título, autor e gênero são obrigatórios." },
        { status: 400 }
      );
    }

    const newBook = await createBook(body);
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro interno do servidor ao criar livro." },
      { status: 500 }
    );
  }
}
