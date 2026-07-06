import { prisma } from "@/lib/prisma";
import { CourseBrowser } from "@/components/course-browser";

type DbCourse = {
  id: string;
  title: string;
  description: string;
  level: string;
  lessons: number;
  duration: string;
  gradient: string;
  thumbnailUrl: string | null;
  isPremium: boolean;
  priceInr: number;
  categoryName: string | null;
  categorySlug: string | null;
};

type DbCategory = {
  id: string;
  name: string;
  slug: string;
};

async function getDatabaseCourses() {
  try {
    return await prisma.$queryRaw<DbCourse[]>`
      SELECT
        c."id",
        c."title",
        c."description",
        c."level",
        c."lessons",
        c."duration",
        c."gradient",
        c."thumbnailUrl",
        c."isPremium",
        c."priceInr",
        cat."name" AS "categoryName",
        cat."slug" AS "categorySlug"
      FROM "Course" c
      LEFT JOIN "Category" cat ON cat."id" = c."categoryId"
      ORDER BY c."createdAt" DESC
    `;
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.$queryRaw<DbCategory[]>`
      SELECT
        "id",
        "name",
        "slug"
      FROM "Category"
      ORDER BY "name" ASC
    `;
  } catch {
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getDatabaseCourses();
  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="pill mb-4 w-fit">Courses</div>

        <h1 className="text-4xl font-black">
          Learn editing, artwork, UI/UX, motion graphics, and creator workflows.
        </h1>

        <p className="mt-3 max-w-2xl text-white/55">
          Search courses or filter them by category.
        </p>
      </div>

      <CourseBrowser courses={courses} categories={categories} />
    </section>
  );
}
