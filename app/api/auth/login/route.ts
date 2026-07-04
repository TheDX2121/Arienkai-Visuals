import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, signSession } from "@/lib/auth";

const schema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return NextResponse.json({ error: "Invalid login details" }, { status: 400 });

  const identifier = parsed.data.identifier.toLowerCase();
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { username: identifier }] },
    select: { id: true, email: true, username: true, role: true, passwordHash: true }
  });

  if (!user?.passwordHash) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  await setSessionCookie(signSession({ id: user.id, email: user.email, username: user.username, role: user.role }));
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
