import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function upsertSetting(key: string, value: string) {
  await prisma.$executeRaw`
    INSERT INTO "SiteSetting" (
      "key",
      "value",
      "updatedAt"
    )
    VALUES (
      ${key},
      ${value},
      NOW()
    )
    ON CONFLICT ("key") DO UPDATE SET
      "value" = EXCLUDED."value",
      "updatedAt" = NOW()
  `;
}

export async function POST(request: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/login?next=/admin/footer", request.url),
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

  const brand = String(formData.get("brand") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const createLinks = String(formData.get("createLinks") || "").trim();
  const platformLinks = String(formData.get("platformLinks") || "").trim();

  if (!brand || !description || !createLinks || !platformLinks) {
    return NextResponse.redirect(
      new URL("/admin/footer?error=missing-fields", request.url),
      { status: 303 }
    );
  }

  await upsertSetting("footer_brand", brand);
  await upsertSetting("footer_description", description);
  await upsertSetting("footer_create_links", createLinks);
  await upsertSetting("footer_platform_links", platformLinks);

  return NextResponse.redirect(
    new URL("/admin/footer?success=footer-updated", request.url),
    { status: 303 }
  );
}
