import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

type RouteContext = { params: Promise<{ username: string }> };

export async function POST(_request: NextRequest, { params }: RouteContext) {
  const { username } = await params;
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const target = await prisma.user.findUnique({ where: { username }, select: { id: true } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (target.id === user.id) return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });

  const existing = await prisma.follow.findUnique({ where: { followerId_followingId: { followerId: user.id, followingId: target.id } } });
  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return NextResponse.json({ following: false });
  }

  await prisma.follow.create({ data: { followerId: user.id, followingId: target.id } });
  await prisma.notification.create({
    data: {
      recipientId: target.id,
      actorId: user.id,
      type: "FOLLOW",
      body: `${user.username} followed you`,
      link: `/profile/${user.username}`
    }
  });
  return NextResponse.json({ following: true });
}
