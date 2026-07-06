import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CloudinaryUploadField } from "@/components/cloudinary-upload-field";

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

async function getNews() {
  try {
    return await prisma.$queryRaw<DbNews[]>`
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
      ORDER BY "createdAt" DESC
    `;
  } catch {
    return [];
  }
}

export default async function AdminNewsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login?next=/admin/news");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const news = await getNews();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <details className="glass-panel mb-8 rounded-2xl p-4">
        <summary className="cursor-pointer text-lg font-black">
          ☰ Admin Menu
        </summary>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin" className="secondary-button">Dashboard</Link>
          <Link href="/admin/courses" className="secondary-button">Courses</Link>
          <Link href="/admin/materials" className="secondary-button">Materials</Link>
          <Link href="/admin/news" className="primary-button">News</Link>
          <Link href="/admin/users" className="secondary-button">Users</Link>
          <Link href="/admin/footer" className="secondary-button">Footer</Link>
        </div>
      </details>

      <div className="mb-8">
        <div className="pill mb-4 w-fit">News manager</div>

        <h1 className="text-4xl font-black">
          Add, edit, delete news
        </h1>

        <p className="mt-3 text-white/55">
          Create anime, editing, creator, and platform news posts.
        </p>
      </div>

      <details className="glass-panel mb-6 rounded-[2rem] p-6">
        <summary className="cursor-pointer text-2xl font-black">
          + Add news
        </summary>

        <form action="/api/admin/news" method="post" className="mt-5 grid gap-4">
          <input className="input" name="title" placeholder="News title" required />

          <input className="input" name="tag" placeholder="Anime, Editing, Creator, Platform..." defaultValue="News" />

          <textarea
            className="input min-h-24"
            name="summary"
            placeholder="Short summary..."
            required
          />

          <textarea
            className="input min-h-52"
            name="content"
            placeholder="Full news content..."
            required
          />

          <CloudinaryUploadField
            name="imageUrl"
            label="News image"
            resourceType="image"
            buttonText="Upload image"
            placeholder="Paste image URL or upload image"
          />

          <input className="input" name="sourceUrl" placeholder="Source URL optional" />

          <label className="flex items-center gap-3 text-sm font-bold">
            <input name="isFeatured" type="checkbox" />
            Featured news
          </label>

          <button className="primary-button w-fit" type="submit">
            Publish news
          </button>
        </form>
      </details>

      <div className="grid gap-4">
        {news.length ? (
          news.map((item) => (
            <details key={item.id} className="glass-panel rounded-[2rem] p-5">
              <summary className="cursor-pointer">
                <div className="inline-flex flex-wrap items-center gap-3">
                  <span className="text-xl font-black">{item.title}</span>
                  <span className="pill">{item.tag}</span>
                  {item.isFeatured ? <span className="pill bg-gold/20 text-yellow-100">Featured</span> : null}
                </div>
              </summary>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/news/${item.slug}`} className="secondary-button">
                  View news
                </Link>
              </div>

              <details className="mt-5 rounded-2xl bg-white/5 p-4">
                <summary className="cursor-pointer font-black">Edit news</summary>

                <form
                  action={`/api/admin/news/${item.id}/update`}
                  method="post"
                  className="mt-4 grid gap-4"
                >
                  <input className="input" name="title" defaultValue={item.title} required />
                  <input className="input" name="tag" defaultValue={item.tag} />

                  <textarea
                    className="input min-h-24"
                    name="summary"
                    defaultValue={item.summary}
                    required
                  />

                  <textarea
                    className="input min-h-52"
                    name="content"
                    defaultValue={item.content}
                    required
                  />

                  <CloudinaryUploadField
                    name="imageUrl"
                    label="News image"
                    defaultValue={item.imageUrl}
                    resourceType="image"
                    buttonText="Upload image"
                    placeholder="Paste image URL or upload image"
                  />

                  <input className="input" name="sourceUrl" defaultValue={item.sourceUrl || ""} />

                  <label className="flex items-center gap-3 text-sm font-bold">
                    <input name="isFeatured" type="checkbox" defaultChecked={item.isFeatured} />
                    Featured news
                  </label>

                  <button className="primary-button w-fit" type="submit">
                    Save news
                  </button>
                </form>
              </details>

              <form
                action={`/api/admin/news/${item.id}/delete`}
                method="post"
                className="mt-4"
              >
                <button
                  className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100"
                  type="submit"
                >
                  Delete news
                </button>
              </form>
            </details>
          ))
        ) : (
          <div className="glass-panel rounded-[2rem] p-6 text-white/55">
            No news yet. Add your first news post.
          </div>
        )}
      </div>
    </section>
  );
}
