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

  await prisma.$executeRaw`
    DELETE FROM "Lesson"
    WHERE "id" = ${lessonId}
      AND "courseId" = ${courseId}
  `;

  await prisma.$executeRaw`
    UPDATE "Course"
    SET "lessons" = (
      SELECT COUNT(*)::INTEGER FROM "Lesson" WHERE "courseId" = ${courseId}
    )
    WHERE "id" = ${courseId}
  `;

  return NextResponse.redirect(
    new URL("/admin/courses?success=lesson-deleted", request.url),
    { status: 303 }
  );
}
