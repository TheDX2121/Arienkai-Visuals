import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function hidePassword(url?: string) {
  if (!url) return "DATABASE_URL is missing";

  return url.replace(/:([^:@/]+)@/, ":****@");
}

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    const userCount = await prisma.user.count();

    return NextResponse.json({
      ok: true,
      message: "Database connected successfully",
      databaseUrl: hidePassword(databaseUrl),
      userCount
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Database connection failed",
        databaseUrl: hidePassword(process.env.DATABASE_URL),
        errorName: error instanceof Error ? error.name : "Unknown error",
        errorMessage: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
