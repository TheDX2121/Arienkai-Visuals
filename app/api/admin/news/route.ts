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
    return NextResponse.redirect(new URL("/login?next=/admin/news", request.url), { status: 303 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url), { status: 303 });
  }

  const formData = await request.formData();

  const title = String(formData.get("title") || "").trim();
  const tag = String(formData.get("tag") || "News").trim();
  const summary = String(formData.get("summary") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const sourceUrl = String(formData.get("sourceUrl") || "").trim();
  const isFeatured = formData.get("isFeatured") === "on";

  if (!title || !summary || !content) {
    return NextResponse.redirect(new URL("/admin/news?error=missing-fields", request.url), { status: 303 });
  }

  const slug = `${slugify(title)}-${Date.now()}`;
  const id = `news_${slug}`;

  await prisma.$executeRaw`
    INSERT INTO "News" (
      "id",
      "title",
      "slug",
      "summary",
      "content",
      "imageUrl",
      "tag",
      "sourceUrl",
      "isFeatured",
      "createdAt"
    )
    VALUES (
      ${id},
      ${title},
      ${slug},
      ${summary},
      ${content},
      ${imageUrl || null},
      ${tag || "News"},
      ${sourceUrl || null},
      ${isFeatured},
      NOW()
    )
  `;

  return NextResponse.redirect(new URL("/admin/news?success=news-created", request.url), { status: 303 });
}
