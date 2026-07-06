import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await context.params;
  const formData = await request.formData();
  const body = String(formData.get("body") || "").trim();

  if (!body) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await prisma.$executeRaw`
    INSERT INTO "PostComment" ("id", "postId", "userId", "body", "createdAt")
    VALUES (${`comment_${id}_${user.id}_${Date.now()}`}, ${id}, ${user.id}, ${body}, NOW())
  `;

  return NextResponse.json({ ok: true });
}
