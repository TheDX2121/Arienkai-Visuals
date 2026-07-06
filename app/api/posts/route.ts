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

function getMediaType(fileUrl: string) {
  const url = fileUrl.toLowerCase();

  if (url.includes(".mp4") || url.includes(".mov") || url.includes(".webm") || url.includes("/video/upload/")) {
    return "video";
  }

  return "image";
}

export async function POST(request: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/login?next=/upload", request.url),
      { status: 303 }
    );
  }

  const formData = await request.formData();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const tag = String(formData.get("tag") || "").trim();
  const hashtag = String(formData.get("hashtag") || "").trim().replace(/^#/, "");
  const animeTag = String(formData.get("animeTag") || "").trim();
  const fileUrl = String(formData.get("fileUrl") || "").trim();

  if (!title || !description || !tag || !hashtag || !fileUrl) {
    return NextResponse.redirect(
      new URL("/upload?error=missing-fields", request.url),
      { status: 303 }
    );
  }

  const id = `post_${slugify(title)}_${Date.now()}`;
  const mediaType = getMediaType(fileUrl);

  await prisma.$executeRaw`
    INSERT INTO "Post" (
      "id",
      "authorId",
      "title",
      "description",
      "tag",
      "hashtag",
      "animeTag",
      "fileUrl",
      "mediaType",
      "createdAt"
    )
    VALUES (
      ${id},
      ${user.id},
      ${title},
      ${description},
      ${tag},
      ${hashtag},
      ${animeTag || null},
      ${fileUrl},
      ${mediaType},
      NOW()
    )
  `;

  return NextResponse.redirect(
    new URL(`/post/${id}`, request.url),
    { status: 303 }
  );
}
