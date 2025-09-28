import { NextResponse } from "next/server";
import { db } from "@/data/store";

export async function GET() {
  return NextResponse.json(db.books);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { title, author, genre, ...rest } = body;
  if (!title || !author || !genre) {
    return NextResponse.json(
      { error: "title, author, genre obrigatórios" },
      { status: 400 }
    );
  }

  const id = (global as any).crypto?.randomUUID?.() ?? String(Date.now());
  const newBook = { id, title, author, genre, ...rest };
  db.books.push(newBook);

  return NextResponse.json(newBook, { status: 201 });
}
