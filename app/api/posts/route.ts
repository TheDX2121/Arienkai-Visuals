import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

const createPostSchema = z.object({
  title: z.string().min(3),
  caption: z.string().min(3),
  mediaUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  hashtags: z.string().optional(),
  animeTags: z.string().optional(),
  isPremium: z.coerce.boolean().optional()
});

function splitTags(value?: string) {
  return value?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [];
}

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { username: true, displayName: true, avatarUrl: true } },
      _count: { select: { likes: true, comments: true, saves: true } }
    },
    take: 40
  });
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const parsed = createPostSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const post = await prisma.post.create({
    data: {
      authorId: user.id,
      title: parsed.data.title,
      caption: parsed.data.caption,
      mediaUrl: parsed.data.mediaUrl ?? "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      thumbnailUrl: parsed.data.thumbnailUrl,
      hashtags: splitTags(parsed.data.hashtags),
      animeTags: splitTags(parsed.data.animeTags),
      isPremium: parsed.data.isPremium ?? false
    }
  });

  return NextResponse.redirect(new URL(`/post/${post.id}`, request.url), { status: 303 });
}
