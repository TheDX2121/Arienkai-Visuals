import Link from "next/link";
import { prisma } from "@/lib/prisma";

type DbNews = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string | null;
  tag: string;
  isFeatured: boolean;
  createdAt: Date;
};

async function getNews() {
  try {
    return await prisma.$queryRaw<DbNews[]>`
      SELECT
        "id",
        "title",
        "slug",
        "summary",
        "imageUrl",
        "tag",
        "isFeatured",
        "createdAt"
      FROM "News"
      ORDER BY "isFeatured" DESC, "createdAt" DESC
      LIMIT 60
    `;
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const news = await getNews();

  const featured = news.find((item) => item.isFeatured) || news[0] || null;
  const rest = featured ? news.filter((item) => item.id !== featured.id) : news;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="pill mb-4 w-fit">News</div>

        <h1 className="text-4xl font-black">
          Anime, editing, creator, and platform news.
        </h1>

        <p className="mt-3 max-w-2xl text-white/55">
          Stay updated with the latest posts selected by Arienkai admins.
        </p>
      </div>

      {featured ? (
        <Link
          href={`/news/${featured.id}`}
          className="card-hover glass-panel mb-8 grid overflow-hidden rounded-[2rem] lg:grid-cols-[1.15fr_.85fr]"
        >
          <div className="relative min-h-[340px] bg-gradient-to-br from-red-700 via-black to-purple-900">
            {featured.imageUrl ? (
              <img
                src={featured.imageUrl}
                alt={featured.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}

            <div className="absolute inset-0 bg-black/35" />

            <div className="absolute left-5 top-5 flex gap-2">
              <span className="pill bg-black/40">Featured</span>
              <span className="pill bg-black/40">{featured.tag}</span>
            </div>
          </div>

          <div className="flex flex-col justify-center p-6">
            <h2 className="text-4xl font-black">
              {featured.title}
            </h2>

            <p className="mt-4 leading-7 text-white/60">
              {featured.summary}
            </p>

            <div className="mt-6 w-fit rounded-full bg-white px-5 py-2 text-sm font-black text-black">
              Read news
            </div>
          </div>
        </Link>
      ) : null}

      {rest.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="card-hover glass-panel overflow-hidden rounded-[1.75rem]"
            >
              <div className="relative h-44 bg-gradient-to-br from-red-700 via-black to-purple-900">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}

                <div className="absolute inset-0 bg-black/35" />
                <span className="pill absolute left-4 top-4 bg-black/40">
                  {item.tag}
                </span>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-black">
                  {item.title}
                </h2>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/58">
                  {item.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : !featured ? (
        <div className="glass-panel rounded-[2rem] p-8 text-white/55">
          No news yet.
        </div>
      ) : null}
    </section>
  );
}
