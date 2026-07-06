import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type NewsDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type DbNews = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  tag: string;
  sourceUrl: string | null;
  isFeatured: boolean;
  createdAt: Date;
};

async function getNews(slug: string) {
  try {
    const rows = await prisma.$queryRaw<DbNews[]>`
      SELECT
        "id",
        "title",
        "slug",
        "summary",
        "content",
        "imageUrl",
        "tag",
        "sourceUrl",
        "isFeatured",
        "createdAt"
      FROM "News"
      WHERE "slug" = ${slug}
      OR "id" = ${slug}
      LIMIT 1
    `;

    return rows[0] || null;
  } catch {
    return null;
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/news" className="text-sm text-white/50 hover:text-white">
        ← Back to news
      </Link>

      <div className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
        <div className="relative min-h-[360px] bg-gradient-to-br from-red-700 via-black to-purple-900">
          {news.imageUrl ? (
            <img
              src={news.imageUrl}
              alt={news.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}

          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute bottom-6 left-6 right-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="pill bg-black/40">{news.tag}</span>
              {news.isFeatured ? (
                <span className="pill bg-black/40">Featured</span>
              ) : null}
            </div>

            <h1 className="max-w-3xl text-4xl font-black sm:text-5xl">
              {news.title}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-xl leading-8 text-white/70">
            {news.summary}
          </p>

          <div className="mt-8 whitespace-pre-line leading-8 text-white/65">
            {news.content}
          </div>

          {news.sourceUrl ? (
            <a
              href={news.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-button mt-8"
            >
              Open source
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
