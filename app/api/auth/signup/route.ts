import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, signSession } from "@/lib/auth";

const schema = z.object({
  displayName: z.string().min(2),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_.-]+$/),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return NextResponse.redirect(
      new URL("/signup?error=invalid-fields", request.url),
      { status: 303 }
    );
  }

  const email = parsed.data.email.toLowerCase();
  const username = parsed.data.username.toLowerCase();

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    },
    select: {
      email: true,
      username: true
    }
  });

  if (existingUser) {
    const error =
      existingUser.email === email
        ? "email-already-used"
        : "username-already-used";

    return NextResponse.redirect(
      new URL(`/signup?error=${error}`, request.url),
      { status: 303 }
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  const user = await prisma.user.create({
    data: {
      displayName: parsed.data.displayName,
      username,
      email,
      passwordHash
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true
    }
  });

  await setSessionCookie(signSession(user));

  return NextResponse.redirect(
    new URL(`/profile/${user.username}`, request.url),
    { status: 303 }
  );
}
