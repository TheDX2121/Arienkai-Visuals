import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NameWithBadge } from "@/components/user-plan-badge";

type PostProps = {
  params: Promise<{
    id: string;
  }>;
};

type DbPost = {
  id: string;
  title: string;
  description: string;
  tag: string;
  hashtag: string;
  animeTag: string | null;
  fileUrl: string;
  mediaType: string;
  createdAt: Date;
  username: string | null;
  subscription: string | null;
};

async function getPost(id: string) {
  try {
    const posts = await prisma.$queryRaw<DbPost[]>`
      SELECT
        p."id",
        p."title",
        p."description",
        p."tag",
        p."hashtag",
        p."animeTag",
        p."fileUrl",
        p."mediaType",
        p."createdAt",
        u."username",
        u."subscription"
      FROM "Post" p
      LEFT JOIN "User" u ON u."id" = p."authorId"
      WHERE p."id" = ${id}
      LIMIT 1
    `;

    return posts[0] || null;
  } catch {
    return null;
  }
}

export default async function PostDetailPage({ params }: PostProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_.8fr] lg:px-8">
      <div className="glass-panel overflow-hidden rounded-[2rem]">
        {post.mediaType === "video" ? (
          <video
            src={post.fileUrl}
            controls
            controlsList="nodownload"
            className="max-h-[720px] w-full bg-black object-contain"
          />
        ) : (
          <img
            src={post.fileUrl}
            alt={post.title}
            className="max-h-[720px] w-full object-contain"
          />
        )}
      </div>

      <aside className="glass-panel h-fit rounded-[2rem] p-6">
        <div className="flex flex-wrap gap-2">
          <span className="pill">{post.tag}</span>
          <span className="pill">#{post.hashtag}</span>

          {post.animeTag ? (
            <span className="pill bg-brand/10 text-red-100">
              {post.animeTag}
            </span>
          ) : null}
        </div>

        <h1 className="mt-5 text-4xl font-black">
          {post.title}
        </h1>

        <Link
          href={post.username ? `/profile/${post.username}` : "/explore"}
          className="mt-3 inline-flex text-white/55 hover:text-white"
        >
          <NameWithBadge subscription={post.subscription}>
            by @{post.username || "creator"}
          </NameWithBadge>
        </Link>

        <p className="mt-5 whitespace-pre-line leading-7 text-white/65">
          {post.description}
        </p>

        <div className="mt-7 grid grid-cols-3 gap-3 text-center text-sm">
          <button className="rounded-2xl bg-white/8 p-4 transition hover:bg-white/12">
            ♥
            <br />
            0
          </button>

          <button className="rounded-2xl bg-white/8 p-4 transition hover:bg-white/12">
            💬
            <br />
            0
          </button>

          <button className="rounded-2xl bg-white/8 p-4 transition hover:bg-white/12">
            🔖
            <br />
            0
          </button>
        </div>

        <Link href="/explore" className="secondary-button mt-7">
          Back to Explore
        </Link>
      </aside>
    </section>
  );
}
