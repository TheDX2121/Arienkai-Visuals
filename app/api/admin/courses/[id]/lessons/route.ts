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

  const { id: courseId } = await context.params;
  const formData = await request.formData();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const videoUrlRaw = String(formData.get("videoUrl") || "").trim();
  const videoUrl = videoUrlRaw || null;
  const duration = String(formData.get("duration") || "10 min").trim();
  const order = Number(formData.get("order") || 1);
  const isPreview = formData.get("isPreview") === "on";

  if (!title) {
    return NextResponse.redirect(
      new URL("/admin/courses?error=missing-lesson-title", request.url),
      { status: 303 }
    );
  }

  const lessonId = `lesson_${courseId}_${Date.now()}`;

  await prisma.$executeRaw`
    INSERT INTO "Lesson" (
      "id",
      "courseId",
      "title",
      "description",
      "videoUrl",
      "duration",
      "order",
      "isPreview",
      "createdAt"
    )
    VALUES (
      ${lessonId},
      ${courseId},
      ${title},
      ${description},
      ${videoUrl},
      ${duration},
      ${Number.isFinite(order) ? order : 1},
      ${isPreview},
      NOW()
    )
  `;

  await prisma.$executeRaw`
    UPDATE "Course"
    SET "lessons" = (
      SELECT COUNT(*)::INTEGER FROM "Lesson" WHERE "courseId" = ${courseId}
    )
    WHERE "id" = ${courseId}
  `;

  return NextResponse.redirect(
    new URL("/admin/courses?success=lesson-created", request.url),
    { status: 303 }
  );
}
