import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NameWithBadge } from "@/components/user-plan-badge";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

type DbUser = {
  id: string;
  name: string | null;
  username: string;
  subscription: string;
};

type DbPost = {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  mediaType: string;
};

async function searchUsers(query: string) {
  if (!query) return [];

  try {
    return await prisma.$queryRaw<DbUser[]>`
      SELECT
        "id",
        "name",
        "username",
        "subscription"
      FROM "User"
      WHERE "username" ILIKE ${`%${query}%`}
      OR "name" ILIKE ${`%${query}%`}
      ORDER BY "username" ASC
      LIMIT 20
    `;
  } catch {
    return [];
  }
}

async function searchPosts(query: string) {
  if (!query) return [];

  try {
    return await prisma.$queryRaw<DbPost[]>`
      SELECT
        "id",
        "title",
        "description",
        "fileUrl",
        "mediaType"
      FROM "Post"
      WHERE "title" ILIKE ${`%${query}%`}
      OR "description" ILIKE ${`%${query}%`}
      OR "tag" ILIKE ${`%${query}%`}
      OR "hashtag" ILIKE ${`%${query}%`}
      ORDER BY "createdAt" DESC
      LIMIT 30
    `;
  } catch {
    return [];
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = String(params.q || "").trim();

  const [users, posts] = await Promise.all([
    searchUsers(query),
    searchPosts(query)
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="pill mb-4 w-fit">Search</div>

        <h1 className="text-4xl font-black">
          Search Arienkai
        </h1>

        <form action="/search" className="mt-5 flex gap-3">
          <input
            className="input"
            name="q"
            defaultValue={query}
            placeholder="Search users, posts, artwork, edits..."
          />

          <button className="primary-button" type="submit">
            Search
          </button>
        </form>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-2xl font-black">Users</h2>

          <div className="mt-5 grid gap-3">
            {users.length ? (
              users.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.username}`}
                  className="glass-panel rounded-2xl p-4 transition hover:bg-white/10"
                >
                  <div className="font-black">
                    <NameWithBadge subscription={user.subscription}>
                      {user.name || user.username}
                    </NameWithBadge>
                  </div>

                  <p className="mt-1 text-sm text-white/45">@{user.username}</p>
                </Link>
              ))
            ) : (
              <p className="text-white/45">No users found.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black">Posts</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {posts.length ? (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="card-hover glass-panel overflow-hidden rounded-[1.75rem]"
                >
                  <div className="h-48 overflow-hidden bg-black">
                    {post.mediaType === "video" ? (
                      <video src={post.fileUrl} className="h-full w-full object-cover" muted playsInline />
                    ) : (
                      <img src={post.fileUrl} alt={post.title} className="h-full w-full object-cover" />
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-black">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-white/55">{post.description}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-white/45">No posts found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
