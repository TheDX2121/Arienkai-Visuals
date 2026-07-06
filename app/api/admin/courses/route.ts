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

  const formData = await request.formData();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const level = String(formData.get("level") || "Beginner").trim();
  const lessons = Number(formData.get("lessons") || 1);
  const duration = String(formData.get("duration") || "1h").trim();
  const gradient = String(
    formData.get("gradient") || "from-red-700 via-black to-purple-900"
  ).trim();
  const isPremium = formData.get("isPremium") === "on";

  if (!title || !description) {
    return NextResponse.redirect(
      new URL("/admin/courses?error=missing-course-fields", request.url),
      { status: 303 }
    );
  }

  const slug = `${slugify(title)}-${Date.now()}`;
  const id = `course_${slug}`;

  await prisma.$executeRaw`
    INSERT INTO "Course" (
      "id",
      "title",
      "slug",
      "description",
      "level",
      "lessons",
      "duration",
      "gradient",
      "isPremium",
      "createdAt"
    )
    VALUES (
      ${id},
      ${title},
      ${slug},
      ${description},
      ${level},
      ${Number.isFinite(lessons) ? lessons : 1},
      ${duration},
      ${gradient},
      ${isPremium},
      NOW()
    )
  `;

  return NextResponse.redirect(
    new URL("/admin/courses?success=course-created", request.url),
    { status: 303 }
  );
}
