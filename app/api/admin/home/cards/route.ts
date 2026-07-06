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

  const label = String(formData.get("label") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const href = String(formData.get("href") || "/").trim();
  const sortOrder = Number(formData.get("sortOrder") || 1);
  const isActive = formData.get("isActive") === "on";

  await prisma.$executeRaw`
    INSERT INTO "HomeCard" (
      "id", "title", "description", "href", "label", "sortOrder", "isActive", "createdAt"
    )
    VALUES (
      ${`home_card_${Date.now()}`},
      ${title},
      ${description},
      ${href},
      ${label},
      ${Number.isFinite(sortOrder) ? sortOrder : 1},
      ${isActive},
      NOW()
    )
  `;

  return NextResponse.redirect(new URL("/admin/home?success=card-created", request.url), { status: 303 });
        }
