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
      new URL("/login?next=/admin/materials", request.url),
      { status: 303 }
    );
  }

  if (user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url), { status: 303 });
  }

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

  const slug = `${slugify(title)}-${Date.now()}`;
  const id = `material_${slug}`;

  await prisma.$executeRaw`
    INSERT INTO "Material" (
      "id",
      "title",
      "slug",
      "description",
      "categoryId",
      "thumbnailUrl",
      "fileUrl",
      "previewUrl",
      "fileType",
      "isPremium",
      "priceInr",
      "purchaseUrl",
      "createdAt"
    )
    VALUES (
      ${id},
      ${title},
      ${slug},
      ${description},
      ${categoryId || null},
      ${thumbnailUrl || null},
      ${fileUrl || null},
      ${previewUrl || null},
      ${fileType},
      ${isPremium},
      ${Number.isFinite(priceInr) ? priceInr : 0},
      ${purchaseUrl || null},
      NOW()
    )
  `;

  return NextResponse.redirect(
    new URL("/admin/materials?success=material-created", request.url),
    { status: 303 }
  );
}
