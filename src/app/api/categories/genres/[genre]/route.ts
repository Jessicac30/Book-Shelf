import { NextResponse } from "next/server";
import { db } from "@/data/store";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ genre: string }> }
) {
  const { genre } = await params;
  const name = decodeURIComponent(genre);
  const before = db.genres.length;
  db.genres = db.genres.filter((g) => g !== name); // <<< genres
  return NextResponse.json({ removed: before - db.genres.length });
}
