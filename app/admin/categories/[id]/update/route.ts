import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/login?next=/admin/categories", request.url),
      { status: 303 }
    );
  }

  if (user.role !== "ADMIN") {
    return NextResponse.redirect(
      new URL("/", request.url),
      { status: 303 }
    );
  }

  const { id } = await context.params;
  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();

  if (!name) {
    return NextResponse.redirect(
      new URL("/admin/categories?error=missing-name", request.url),
      { status: 303 }
    );
  }

  const slug = slugify(name);

  await prisma.$executeRaw`
    UPDATE "Category"
    SET
      "name" = ${name},
      "slug" = ${slug}
    WHERE "id" = ${id}
  `;

  return NextResponse.redirect(
    new URL("/admin/categories?success=category-updated", request.url),
    { status: 303 }
  );
}
