import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { NameWithBadge } from "@/components/user-plan-badge";
import { PostActions } from "@/components/post-actions";

type PostProps = {
  params: Promise<{
    id: string;
  }>;
};

type DbPost = {
  id: string;
  authorId: string | null;
  title: string;
  description: string;
  tag: string;
  hashtag: string;
  animeTag: string | null;
  fileUrl: string;
  mediaType: string;
  username: string | null;
  name: string | null;
  subscription: string | null;
};

type DbComment = {
  id: string;
  body: string;
  createdAt: Date;
  username: string | null;
  name: string | null;
  subscription: string | null;
};

type CountRow = {
  count: bigint | number;
};

type FlagRow = {
  exists: boolean;
};

async function getPost(id: string) {
  try {
    const posts = await prisma.$queryRaw<DbPost[]>`
      SELECT
        p."id",
        p."authorId",
        p."title",
        p."description",
        p."tag",
        p."hashtag",
        p."animeTag",
        p."fileUrl",
        p."mediaType",
        u."username",
        u."name",
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

async function getCount(tableName: "PostLike" | "PostSave" | "PostComment", postId: string) {
  try {
    const rows = await prisma.$queryRawUnsafe<CountRow[]>(
      `SELECT COUNT(*) AS "count" FROM "${tableName}" WHERE "postId" = $1`,
      postId
    );

    return Number(rows[0]?.count || 0);
  } catch {
    return 0;
  }
}

async function getUserFlag(tableName: "PostLike" | "PostSave", postId: string, userId?: string) {
  if (!userId) return false;

  try {
    const rows = await prisma.$queryRawUnsafe<FlagRow[]>(
      `SELECT EXISTS(SELECT 1 FROM "${tableName}" WHERE "postId" = $1 AND "userId" = $2) AS "exists"`,
      postId,
      userId
    );

    return Boolean(rows[0]?.exists);
  } catch {
    return false;
  }
}

async function getComments(postId: string) {
  try {
    return await prisma.$queryRaw<DbComment[]>`
      SELECT
        c."id",
        c."body",
        c."createdAt",
        u."username",
        u."name",
        u."subscription"
      FROM "PostComment" c
      LEFT JOIN "User" u ON u."id" = c."userId"
      WHERE c."postId" = ${postId}
      ORDER BY c."createdAt" DESC
      LIMIT 40
    `;
  } catch {
    return [];
  }
}

export default async function PostDetailPage({ params }: PostProps) {
  const { id } = await params;
  const user = await currentUser();
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  const [likeCount, saveCount, commentCount, liked, saved, comments] = await Promise.all([
    getCount("PostLike", post.id),
    getCount("PostSave", post.id),
    getCount("PostComment", post.id),
    getUserFlag("PostLike", post.id, user?.id),
    getUserFlag("PostSave", post.id, user?.id),
    getComments(post.id)
  ]);

  const displayName = post.name || post.username || "creator";

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
            by {displayName}
          </NameWithBadge>
        </Link>

        <p className="mt-5 whitespace-pre-line leading-7 text-white/65">
          {post.description}
        </p>

        <PostActions
          postId={post.id}
          isLoggedIn={Boolean(user)}
          liked={liked}
          saved={saved}
          likeCount={likeCount}
          saveCount={saveCount}
          commentCount={commentCount}
        />

        <div className="mt-7">
          <h2 className="text-xl font-black">Comments</h2>

          <div className="mt-4 grid gap-3">
            {comments.length ? (
              comments.map((comment) => (
                <div key={comment.id} className="rounded-2xl bg-white/5 p-4">
                  <div className="text-sm font-bold text-white">
                    <NameWithBadge subscription={comment.subscription}>
                      {comment.name || `@${comment.username}` || "creator"}
                    </NameWithBadge>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {comment.body}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/45">
                No comments yet.
              </p>
            )}
          </div>
        </div>

        <Link href="/explore" className="secondary-button mt-7">
          Back to Explore
        </Link>
      </aside>
    </section>
  );
}
