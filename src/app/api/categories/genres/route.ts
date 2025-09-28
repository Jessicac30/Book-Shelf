import { NextResponse } from "next/server";
import { db } from "@/data/store";

export async function POST(req: Request) {
  const { genre } = await req.json();
  if (!genre) {
    return NextResponse.json({ error: "genre é obrigatório" }, { status: 400 });
  }
  if (db.genres.includes(genre)) {
    return NextResponse.json({ error: "já existe" }, { status: 409 });
  }
  db.genres.push(genre); // <<< genres
  return NextResponse.json({ ok: true, genre }, { status: 201 });
}
