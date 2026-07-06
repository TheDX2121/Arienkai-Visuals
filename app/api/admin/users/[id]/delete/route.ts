import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login?next=/admin/users", request.url), { status: 303 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url), { status: 303 });
  }

  const { id } = await context.params;

  if (id === user.id) {
    return NextResponse.redirect(new URL("/admin/users?error=cannot-delete-yourself", request.url), { status: 303 });
  }

  await prisma.$executeRaw`
    DELETE FROM "PostLike"
    WHERE "userId" = ${id}
    OR "postId" IN (SELECT "id" FROM "Post" WHERE "authorId" = ${id})
  `;

  await prisma.$executeRaw`
    DELETE FROM "PostSave"
    WHERE "userId" = ${id}
    OR "postId" IN (SELECT "id" FROM "Post" WHERE "authorId" = ${id})
  `;

  await prisma.$executeRaw`
    DELETE FROM "PostComment"
    WHERE "userId" = ${id}
    OR "postId" IN (SELECT "id" FROM "Post" WHERE "authorId" = ${id})
  `;

  await prisma.$executeRaw`
    DELETE FROM "Follow"
    WHERE "followerId" = ${id}
    OR "followingId" = ${id}
  `;

  await prisma.$executeRaw`
    DELETE FROM "Post"
    WHERE "authorId" = ${id}
  `;

  await prisma.$executeRaw`
    DELETE FROM "User"
    WHERE "id" = ${id}
  `;

  return NextResponse.redirect(new URL("/admin/users?success=user-deleted", request.url), { status: 303 });
}
