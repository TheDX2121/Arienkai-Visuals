import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login?next=/admin/home", request.url), { status: 303 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url), { status: 303 });
  }

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

  if (!title || !description || !href) {
    return NextResponse.redirect(new URL("/admin/home?error=missing-slide-fields", request.url), { status: 303 });
  }

  await prisma.$executeRaw`
    INSERT INTO "HomeSlide" (
      "id", "title", "description", "imageUrl", "href", "buttonLabel",
      "tag", "meta", "type", "sortOrder", "isActive", "createdAt"
    )
    VALUES (
      ${`home_slide_${Date.now()}`},
      ${title},
      ${description},
      ${imageUrl || null},
      ${href},
      ${buttonLabel},
      ${tag},
      ${meta},
      ${type},
      ${Number.isFinite(sortOrder) ? sortOrder : 1},
      ${isActive},
      NOW()
    )
  `;

  return NextResponse.redirect(new URL("/admin/home?success=slide-created", request.url), { status: 303 });
      }
