import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type DbUser = {
  id: string;
};

type ExistingRow = {
  id: string;
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { username } = await context.params;

  const users = await prisma.$queryRaw<DbUser[]>`
    SELECT "id"
    FROM "User"
    WHERE "username" = ${username}
    LIMIT 1
  `;

  const targetUser = users[0];

  if (!targetUser || targetUser.id === user.id) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const existing = await prisma.$queryRaw<ExistingRow[]>`
    SELECT "id"
    FROM "Follow"
    WHERE "followerId" = ${user.id}
    AND "followingId" = ${targetUser.id}
    LIMIT 1
  `;

  if (existing[0]) {
    await prisma.$executeRaw`
      DELETE FROM "Follow"
      WHERE "id" = ${existing[0].id}
    `;
  } else {
    await prisma.$executeRaw`
      INSERT INTO "Follow" ("id", "followerId", "followingId", "createdAt")
      VALUES (${`follow_${user.id}_${targetUser.id}_${Date.now()}`}, ${user.id}, ${targetUser.id}, NOW())
    `;
  }

  return NextResponse.json({ ok: true });
}
