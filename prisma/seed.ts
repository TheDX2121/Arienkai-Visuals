import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("arienkai123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@arienkai.visuals" },
    update: {},
    create: {
      email: "admin@arienkai.visuals",
      username: "admin",
      displayName: "Arienkai Admin",
      role: "ADMIN",
      subscription: "STUDIO",
      passwordHash,
      bio: "Platform curator and moderation lead."
    }
  });

  const rin = await prisma.user.upsert({
    where: { email: "rin@arienkai.visuals" },
    update: {},
    create: {
      email: "rin@arienkai.visuals",
      username: "rinfx",
      displayName: "Rin FX",
      role: "CREATOR",
      subscription: "CREATOR",
      passwordHash,
      bio: "Anime glow edits, impact frames, and cinematic thumbnail systems."
    }
  });

  await prisma.post.upsert({
    where: { id: "seed-akuma-city" },
    update: {},
    create: {
      id: "seed-akuma-city",
      authorId: rin.id,
      title: "Akuma City Color Grade",
      caption: "A night-city anime grade using split toning, grain, glow control, and red-blue contrast.",
      mediaUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      thumbnailUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      mediaType: "IMAGE",
      hashtags: ["aftereffects", "colorgrade", "animeedit"],
      animeTags: ["Jujutsu Kaisen"],
      isPremium: false
    }
  });

  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: admin.id, followingId: rin.id } },
    update: {},
    create: { followerId: admin.id, followingId: rin.id }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
