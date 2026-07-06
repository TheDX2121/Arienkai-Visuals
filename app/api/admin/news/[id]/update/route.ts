import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login?next=/admin/news", request.url), { status: 303 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url), { status: 303 });
  }

  const { id } = await context.params;
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

  await prisma.$executeRaw`
    UPDATE "News"
    SET
      "title" = ${title},
      "tag" = ${tag || "News"},
      "summary" = ${summary},
      "content" = ${content},
      "imageUrl" = ${imageUrl || null},
      "sourceUrl" = ${sourceUrl || null},
      "isFeatured" = ${isFeatured}
    WHERE "id" = ${id}
  `;

  return NextResponse.redirect(new URL("/admin/news?success=news-updated", request.url), { status: 303 });
}
