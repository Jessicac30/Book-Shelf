import { NextResponse } from "next/server";
import { db } from "@/data/store";

export async function GET() {
  return NextResponse.json(db.genres); // <<< aqui é genres
}
