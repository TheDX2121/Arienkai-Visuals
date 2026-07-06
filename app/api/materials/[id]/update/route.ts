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
  const formData = await request.formData();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const thumbnailUrl = String(formData.get("thumbnailUrl") || "").trim();
  const fileUrl = String(formData.get("fileUrl") || "").trim();
  const previewUrl = String(formData.get("previewUrl") || "").trim();
  const fileType = String(formData.get("fileType") || "Digital file").trim();
  const isPremium = formData.get("isPremium") === "on";
  const priceInr = Number(formData.get("priceInr") || 0);
  const purchaseUrl = String(formData.get("purchaseUrl") || "").trim();

  if (!title || !description) {
    return NextResponse.redirect(
      new URL("/admin/materials?error=missing-fields", request.url),
      { status: 303 }
    );
  }

  await prisma.$executeRaw`
    UPDATE "Material"
    SET
      "title" = ${title},
      "description" = ${description},
      "categoryId" = ${categoryId || null},
      "thumbnailUrl" = ${thumbnailUrl || null},
      "fileUrl" = ${fileUrl || null},
      "previewUrl" = ${previewUrl || null},
      "fileType" = ${fileType},
      "isPremium" = ${isPremium},
      "priceInr" = ${Number.isFinite(priceInr) ? priceInr : 0},
      "purchaseUrl" = ${purchaseUrl || null}
    WHERE "id" = ${id}
  `;

  return NextResponse.redirect(
    new URL("/admin/materials?success=material-updated", request.url),
    { status: 303 }
  );
}
