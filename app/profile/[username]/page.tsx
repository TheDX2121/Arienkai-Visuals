import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { NameWithBadge } from "@/components/user-plan-badge";
import { FollowButton } from "@/components/follow-button";

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

type DbProfile = {
  id: string;
  name: string | null;
  username: string;
  subscription: string;
  role: string;
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
};

type CountRow = {
  count: bigint | number;
};

type FlagRow = {
  exists: boolean;
};

async function getProfile(username: string) {
  try {
    const users = await prisma.$queryRaw<DbProfile[]>`
      SELECT
        "id",
        "name",
        "username",
        "subscription",
        "role"
      FROM "User"
      WHERE "username" = ${username}
      LIMIT 1
    `;

    return users[0] || null;
  } catch {
    return null;
  }
}

async function countRows(query: TemplateStringsArray, value: string) {
  try {
    const rows = await prisma.$queryRaw<CountRow[]>(query, value);
    return Number(rows[0]?.count || 0);
  } catch {
    return 0;
  }
}

async function getPosts(userId: string) {
  try {
    return await prisma.$queryRaw<DbPost[]>`
      SELECT
        "id",
        "title",
        "description",
        "tag",
        "hashtag",
        "animeTag",
        "fileUrl",
        "mediaType"
      FROM "Post"
      WHERE "authorId" = ${userId}
      ORDER BY "createdAt" DESC
      LIMIT 60
    `;
  } catch {
    return [];
  }
}

async function isFollowing(currentUserId: string | undefined, profileId: string) {
  if (!currentUserId) return false;

  try {
    const rows = await prisma.$queryRaw<FlagRow[]>`
      SELECT EXISTS(
        SELECT 1 FROM "Follow"
        WHERE "followerId" = ${currentUserId}
        AND "followingId" = ${profileId}
      ) AS "exists"
    `;

    return Boolean(rows[0]?.exists);
  } catch {
    return false;
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const user = await currentUser();
  const profile = await getProfile(username);

  if (!profile) {
    notFound();
  }

  const [posts, postCount, followerCount, followingCount, following] = await Promise.all([
    getPosts(profile.id),
    countRows`SELECT COUNT(*) AS "count" FROM "Post" WHERE "authorId" = ${profile.id}`,
    countRows`SELECT COUNT(*) AS "count" FROM "Follow" WHERE "followingId" = ${profile.id}`,
    countRows`SELECT COUNT(*) AS "count" FROM "Follow" WHERE "followerId" = ${profile.id}`,
    isFollowing(user?.id, profile.id)
  ]);

  const isOwnProfile = user?.id === profile.id;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-[2rem] p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="grid h-20 w-20 place-items-center rounded-full bg-brand text-3xl font-black">
              {profile.username.charAt(0).toUpperCase()}
            </div>

            <h1 className="mt-5 text-4xl font-black">
              <NameWithBadge subscription={profile.subscription}>
                {profile.name || profile.username}
              </NameWithBadge>
            </h1>

            <p className="mt-2 text-white/50">
              @{profile.username}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="pill">{profile.subscription}</span>
              {profile.role === "ADMIN" ? <span className="pill">Admin</span> : null}
            </div>
          </div>

          {!isOwnProfile ? (
            <FollowButton
              username={profile.username}
              isLoggedIn={Boolean(user)}
              isFollowing={following}
            />
          ) : (
            <Link href="/upload" className="primary-button">
              Upload post
            </Link>
          )}
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-4 text-center">
            <div className="text-2xl font-black">{postCount}</div>
            <div className="text-sm text-white/45">Posts</div>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 text-center">
            <div className="text-2xl font-black">{followerCount}</div>
            <div className="text-sm text-white/45">Followers</div>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 text-center">
            <div className="text-2xl font-black">{followingCount}</div>
            <div className="text-sm text-white/45">Following</div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-black">Posts</h2>

        {posts.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="card-hover glass-panel overflow-hidden rounded-[1.75rem]"
              >
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-red-700 via-black to-purple-900">
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
            ))}
          </div>
        ) : (
          <div className="glass-panel mt-5 rounded-[2rem] p-6 text-white/55">
            No posts yet.
          </div>
        )}
      </div>
    </section>
  );
}
