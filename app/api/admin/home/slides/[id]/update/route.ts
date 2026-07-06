import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login?next=/admin/home", request.url), { status: 303 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url), { status: 303 });
  }

  const { id } = await context.params;
  const formData = await request.formData();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const href = String(formData.get("href") || "/").trim();
  const buttonLabel = String(formData.get("buttonLabel") || "Open").trim();
  const tag = String(formData.get("tag") || "Featured").trim();
  const meta = String(formData.get("meta") || "").trim();
  const type = String(formData.get("type") || "offer").trim();
  const sortOrder = Number(formData.get("sortOrder") || 1);
  const isActive = formData.get("isActive") === "on";

  await prisma.$executeRaw`
    UPDATE "HomeSlide"
    SET
      "title" = ${title},
      "description" = ${description},
      "imageUrl" = ${imageUrl || null},
      "href" = ${href},
      "buttonLabel" = ${buttonLabel},
      "tag" = ${tag},
      "meta" = ${meta},
      "type" = ${type},
      "sortOrder" = ${Number.isFinite(sortOrder) ? sortOrder : 1},
      "isActive" = ${isActive}
    WHERE "id" = ${id}
  `;

  return NextResponse.redirect(new URL("/admin/home?success=slide-updated", request.url), { status: 303 });
}
