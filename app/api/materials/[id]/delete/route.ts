import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/login?next=/admin/materials", request.url),
      { status: 303 }
    );
  }

  if (user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url), { status: 303 });
  }

  const { id } = await context.params;

  await prisma.$executeRaw`
    DELETE FROM "Material"
    WHERE "id" = ${id}
  `;

  return NextResponse.redirect(
    new URL("/admin/materials?success=material-deleted", request.url),
    { status: 303 }
  );
}
