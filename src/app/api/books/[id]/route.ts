import { NextResponse } from "next/server";
import { db } from "@/data/store";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patch = await req.json();
  const i = db.books.findIndex((b) => b.id === id);
  if (i === -1)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  db.books[i] = { ...db.books[i], ...patch };
  return NextResponse.json(db.books[i]);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const before = db.books.length;
  db.books = db.books.filter((b) => b.id !== id);
  return NextResponse.json({ removed: before - db.books.length });
}
