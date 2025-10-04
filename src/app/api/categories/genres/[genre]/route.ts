import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: { genre: string } }
) {
  const name = decodeURIComponent(params.genre);
  try {
    const genre = await prisma.genre.findUnique({ where: { name } });
    if (!genre) return NextResponse.json({ removed: 0 });

    await prisma.book.updateMany({ where: { genreId: genre.id }, data: { genreId: null } });
    await prisma.genre.delete({ where: { id: genre.id } });
    return NextResponse.json({ removed: 1 });
  } catch {
    return NextResponse.json({ removed: 0 });
  }
}
