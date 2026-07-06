import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, signSession } from "@/lib/auth";

const schema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(1)
});

function safeRedirectPath(path: string | null) {
  if (!path) return null;
  if (!path.startsWith("/")) return null;
  if (path.startsWith("//")) return null;
  return path;
}

export async function POST(request: NextRequest) {
  const nextPath = safeRedirectPath(request.nextUrl.searchParams.get("next"));

  const formData = await request.formData();
  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "invalid-fields");
    if (nextPath) url.searchParams.set("next", nextPath);

    return NextResponse.redirect(url, { status: 303 });
  }

  const identifier = parsed.data.identifier.toLowerCase().trim();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier }
      ]
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      passwordHash: true
    }
  });

  if (!user?.passwordHash) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "invalid-credentials");
    if (nextPath) url.searchParams.set("next", nextPath);

    return NextResponse.redirect(url, { status: 303 });
  }

  const passwordIsCorrect = await bcrypt.compare(
    parsed.data.password,
    user.passwordHash
  );

  if (!passwordIsCorrect) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "invalid-credentials");
    if (nextPath) url.searchParams.set("next", nextPath);

    return NextResponse.redirect(url, { status: 303 });
  }

  await setSessionCookie(
    signSession({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    })
  );

  return NextResponse.redirect(
    new URL(nextPath || `/profile/${user.username}`, request.url),
    { status: 303 }
  );
}
