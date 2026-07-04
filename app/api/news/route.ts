import { NextResponse } from "next/server";
import { fetchAnimeNews } from "@/lib/news";

export const revalidate = 900;

export async function GET() {
  const items = await fetchAnimeNews();
  return NextResponse.json({ items }, { headers: { "Cache-Control": "s-maxage=900, stale-while-revalidate=3600" } });
}
