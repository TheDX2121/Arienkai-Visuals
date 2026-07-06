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

export async function POST(request: NextRequest) {
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

  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();

  if (!name) {
    return NextResponse.redirect(
      new URL("/admin/categories?error=missing-name", request.url),
      { status: 303 }
    );
  }

  const slug = slugify(name);
  const id = `cat_${slug}_${Date.now()}`;

  await prisma.$executeRaw`
    INSERT INTO "Category" (
      "id",
      "name",
      "slug",
      "createdAt"
    )
    VALUES (
      ${id},
      ${name},
      ${slug},
      NOW()
    )
  `;

  return NextResponse.redirect(
    new URL("/admin/categories?success=category-created", request.url),
    { status: 303 }
  );
}
