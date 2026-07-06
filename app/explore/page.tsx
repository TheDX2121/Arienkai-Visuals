import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
};

async function getPosts() {
  try {
    return await prisma.$queryRaw<DbPost[]>`
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
        u."username"
      FROM "Post" p
      LEFT JOIN "User" u ON u."id" = p."authorId"
      ORDER BY p."createdAt" DESC
      LIMIT 60
    `;
  } catch {
    return [];
  }
}

export default async function ExplorePage() {
  const posts = await getPosts();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="pill mb-4 w-fit">Explore</div>

          <h1 className="text-4xl font-black">
            Explore creator posts.
          </h1>

          <p className="mt-3 max-w-2xl text-white/55">
            Artwork, thumbnails, GFX, UI/UX, motion graphics, and video edits from Arienkai creators.
          </p>
        </div>

        <Link href="/upload" className="primary-button">
          Upload post
        </Link>
      </div>

      {posts.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="card-hover glass-panel overflow-hidden rounded-[1.75rem]"
            >
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-red-700 via-black to-purple-900">
                {post.mediaType === "video" ? (
                  <video
                    src={post.fileUrl}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={post.fileUrl}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-black/25" />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="pill bg-black/35">{post.tag}</span>
                  <span className="pill bg-black/35">#{post.hashtag}</span>
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-black">
                  {post.title}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/58">
                  {post.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/45">
                  {post.animeTag ? (
                    <span className="pill">{post.animeTag}</span>
                  ) : null}

                  <span className="pill">
                    @{post.username || "creator"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-[2rem] p-8 text-white/55">
          No posts yet. Upload the first Explore post.
        </div>
      )}
    </section>
  );
}
