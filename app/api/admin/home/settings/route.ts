import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function upsertSetting(key: string, value: string) {
  await prisma.$executeRaw`
    INSERT INTO "SiteSetting" ("key", "value", "updatedAt")
    VALUES (${key}, ${value}, NOW())
    ON CONFLICT ("key") DO UPDATE SET
      "value" = EXCLUDED."value",
      "updatedAt" = NOW()
  `;
}

export async function POST(request: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login?next=/admin/home", request.url), { status: 303 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url), { status: 303 });
  }

  const formData = await request.formData();

  await upsertSetting("home_trending_title", String(formData.get("trendingTitle") || "Trending Now").trim());
  await upsertSetting("home_courses_title", String(formData.get("coursesTitle") || "Courses for you").trim());
  await upsertSetting("home_materials_title", String(formData.get("materialsTitle") || "Creator materials").trim());
  await upsertSetting("home_cards_title", String(formData.get("cardsTitle") || "Start creating with Arienkai").trim());

  return NextResponse.redirect(new URL("/admin/home?success=settings-updated", request.url), { status: 303 });
        }
