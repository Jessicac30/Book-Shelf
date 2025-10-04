import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { genre } = await req.json();
  if (!genre || !String(genre).trim()) {
    return NextResponse.json({ error: "genre é obrigatório" }, { status: 400 });
  }
  try {
    const created = await prisma.genre.create({ data: { name: String(genre).trim() } });
    return NextResponse.json({ ok: true, genre: created.name }, { status: 201 });
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: "já existe" }, { status: 409 });
    }
    return NextResponse.json({ error: "erro ao criar" }, { status: 500 });
  }
}
