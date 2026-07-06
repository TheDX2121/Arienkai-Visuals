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
      new URL("/login?next=/admin/courses", request.url),
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

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const level = String(formData.get("level") || "Beginner").trim();
  const lessons = Number(formData.get("lessons") || 1);
  const duration = String(formData.get("duration") || "1h").trim();
  const thumbnailUrl = String(formData.get("thumbnailUrl") || "").trim();
  const gradient = String(formData.get("gradient") || "from-red-700 via-black to-purple-900").trim();
  const isPremium = formData.get("isPremium") === "on";

  if (!title || !description) {
    return NextResponse.redirect(
      new URL("/admin/courses?error=missing-fields", request.url),
      { status: 303 }
    );
  }

  await prisma.$executeRaw`
    UPDATE "Course"
    SET
      "title" = ${title},
      "description" = ${description},
      "level" = ${level},
      "lessons" = ${Number.isFinite(lessons) ? lessons : 1},
      "duration" = ${duration},
      "gradient" = ${gradient},
      "thumbnailUrl" = ${thumbnailUrl || null},
      "isPremium" = ${isPremium}
    WHERE "id" = ${id}
  `;

  return NextResponse.redirect(
    new URL("/admin/courses?success=course-updated", request.url),
    { status: 303 }
  );
}
