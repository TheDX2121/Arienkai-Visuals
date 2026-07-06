import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string; lessonId: string }> }
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

  const { id: courseId, lessonId } = await context.params;
  const formData = await request.formData();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const videoUrlRaw = String(formData.get("videoUrl") || "").trim();
  const videoUrl = videoUrlRaw || null;
  const captionsUrlRaw = String(formData.get("captionsUrl") || "").trim();
  const captionsUrl = captionsUrlRaw || null;
  const duration = String(formData.get("duration") || "10 min").trim();
  const order = Number(formData.get("order") || 1);
  const isPreview = formData.get("isPreview") === "on";

  if (!title) {
    return NextResponse.redirect(
      new URL("/admin/courses?error=missing-lesson-title", request.url),
      { status: 303 }
    );
  }

  await prisma.$executeRaw`
    UPDATE "Lesson"
    SET
      "title" = ${title},
      "description" = ${description},
      "videoUrl" = ${videoUrl},
      "captionsUrl" = ${captionsUrl},
      "duration" = ${duration},
      "order" = ${Number.isFinite(order) ? order : 1},
      "isPreview" = ${isPreview}
    WHERE "id" = ${lessonId}
      AND "courseId" = ${courseId}
  `;

  return NextResponse.redirect(
    new URL("/admin/courses?success=lesson-updated", request.url),
    { status: 303 }
  );
}
