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
      new URL("/login?next=/admin/navbar", request.url),
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

  const logoUrl = String(formData.get("logoUrl") || "").trim();
  const links = String(formData.get("links") || "").trim();
  const showUpload = formData.get("showUpload") === "on" ? "true" : "false";
  const showCreateAccount =
    formData.get("showCreateAccount") === "on" ? "true" : "false";

  if (!logoUrl || !links) {
    return NextResponse.redirect(
      new URL("/admin/navbar?error=missing-fields", request.url),
      { status: 303 }
    );
  }

  await upsertSetting("navbar_logo_url", logoUrl);
  await upsertSetting("navbar_links", links);
  await upsertSetting("navbar_show_upload", showUpload);
  await upsertSetting("navbar_show_create_account", showCreateAccount);

  return NextResponse.redirect(
    new URL("/admin/navbar?success=navbar-updated", request.url),
    { status: 303 }
  );
}