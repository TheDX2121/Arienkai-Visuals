import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { createUploadSignature } from "@/lib/cloudinary";

export async function POST() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const signature = createUploadSignature(`arienkai-visuals/${user.username}`);
  return NextResponse.json(signature);
}
