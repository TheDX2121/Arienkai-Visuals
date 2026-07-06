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
  const formData = await request.formData();

  const role = String(formData.get("role") || "USER").trim();
  const subscription = String(formData.get("subscription") || "FREE").trim();

  await prisma.$executeRaw`
    UPDATE "User"
    SET
      "role" = ${role},
      "subscription" = ${subscription}
    WHERE "id" = ${id}
  `;

  return NextResponse.redirect(new URL("/admin/users?success=user-updated", request.url), { status: 303 });
}
