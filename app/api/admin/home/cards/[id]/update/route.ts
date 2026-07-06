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

  const label = String(formData.get("label") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const href = String(formData.get("href") || "/").trim();
  const sortOrder = Number(formData.get("sortOrder") || 1);
  const isActive = formData.get("isActive") === "on";

  await prisma.$executeRaw`
    UPDATE "HomeCard"
    SET
      "label" = ${label},
      "title" = ${title},
      "description" = ${description},
      "href" = ${href},
      "sortOrder" = ${Number.isFinite(sortOrder) ? sortOrder : 1},
      "isActive" = ${isActive}
    WHERE "id" = ${id}
  `;

  return NextResponse.redirect(new URL("/admin/home?success=card-updated", request.url), { status: 303 });
  }
