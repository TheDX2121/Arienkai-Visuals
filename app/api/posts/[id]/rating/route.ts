import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

const schema = z.object({
  composition: z.coerce.number().int().min(1).max(10),
  color: z.coerce.number().int().min(1).max(10),
  readability: z.coerce.number().int().min(1).max(10),
  motion: z.coerce.number().int().min(1).max(10),
  clickAppeal: z.coerce.number().int().min(1).max(10),
  feedback: z.string().optional()
});

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const rating = await prisma.previewRating.upsert({
    where: { userId_postId: { userId: user.id, postId: id } },
    update: parsed.data,
    create: { ...parsed.data, userId: user.id, postId: id }
  });

  return NextResponse.json({ rating });
}
