import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ExistingRow = {
  id: string;
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await context.params;

  const existing = await prisma.$queryRaw<ExistingRow[]>`
    SELECT "id"
    FROM "PostSave"
    WHERE "postId" = ${id}
    AND "userId" = ${user.id}
    LIMIT 1
  `;

  if (existing[0]) {
    await prisma.$executeRaw`
      DELETE FROM "PostSave"
      WHERE "id" = ${existing[0].id}
    `;
  } else {
    await prisma.$executeRaw`
      INSERT INTO "PostSave" ("id", "postId", "userId", "createdAt")
      VALUES (${`save_${id}_${user.id}_${Date.now()}`}, ${id}, ${user.id}, NOW())
    `;
  }

  return NextResponse.json({ ok: true });
}
