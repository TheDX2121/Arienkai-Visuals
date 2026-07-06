import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Category = {
  id: string;
  name: string;
  slug: string;
  courseCount: bigint | number;
};

async function getCategories() {
  try {
    return await prisma.$queryRaw<Category[]>`
      SELECT
        cat."id",
        cat."name",
        cat."slug",
        COUNT(c."id") AS "courseCount"
      FROM "Category" cat
      LEFT JOIN "Course" c ON c."categoryId" = cat."id"
      GROUP BY cat."id", cat."name", cat."slug"
      ORDER BY cat."name" ASC
    `;
  } catch {
    return [];
  }
}

export default async function AdminCategoriesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login?next=/admin/categories");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <details className="glass-panel mb-8 rounded-2xl p-4">
        <summary className="cursor-pointer text-lg font-black">
          ☰ Admin Menu
        </summary>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin" className="secondary-button">Dashboard</Link>
          <Link href="/admin/courses" className="secondary-button">Courses</Link>
          <Link href="/admin/categories" className="primary-button">Categories</Link>
        </div>
      </details>

      <div className="mb-8">
        <div className="pill mb-4 w-fit">Category manager</div>

        <h1 className="text-4xl font-black">
          Course categories
        </h1>

        <p className="mt-3 text-white/55">
          Add, edit, or delete course categories.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <form
          action="/api/admin/categories"
          method="post"
          className="glass-panel h-fit rounded-[2rem] p-6"
        >
          <h2 className="text-2xl font-black">Add category</h2>

          <label className="mb-2 mt-5 block text-sm font-bold">
            Category name
          </label>

          <input
            className="input"
            name="name"
            placeholder="3D Design"
            required
          />

          <button className="primary-button mt-6 w-full justify-center" type="submit">
            Add category
          </button>
        </form>

        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black">All categories</h2>

          <div className="mt-5 grid gap-3">
            {categories.length ? (
              categories.map((category) => (
                <details key={category.id} className="rounded-2xl bg-white/5 p-4">
                  <summary className="cursor-pointer font-black">
                    {category.name} · {String(category.courseCount)} courses
                  </summary>

                  <form
                    action={`/api/admin/categories/${category.id}/update`}
                    method="post"
                    className="mt-4 grid gap-3"
                  >
                    <input
                      className="input"
                      name="name"
                      defaultValue={category.name}
                      required
                    />

                    <button className="primary-button w-fit" type="submit">
                      Save category
                    </button>
                  </form>

                  <form
                    action={`/api/admin/categories/${category.id}/delete`}
                    method="post"
                    className="mt-3"
                  >
                    <button
                      className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100"
                      type="submit"
                    >
                      Delete category
                    </button>
                  </form>
                </details>
              ))
            ) : (
              <p className="text-sm text-white/50">
                No categories yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
