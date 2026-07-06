import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type AdminPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

type DbCourse = {
  id: string;
  title: string;
  description: string;
  level: string;
  lessons: number;
  duration: string;
  isPremium: boolean;
  createdAt: Date;
};

async function getCourses() {
  try {
    return await prisma.$queryRaw<DbCourse[]>`
      SELECT
        "id",
        "title",
        "description",
        "level",
        "lessons",
        "duration",
        "isPremium",
        "createdAt"
      FROM "Course"
      ORDER BY "createdAt" DESC
      LIMIT 20
    `;
  } catch {
    return [];
  }
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const user = await currentUser();
  const params = await searchParams;

  if (!user) {
    redirect("/login?next=/admin");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const courses = await getCourses();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="pill mb-4 w-fit">Admin dashboard</div>

        <h1 className="text-4xl font-black">
          Arienkai Admin Panel
        </h1>

        <p className="mt-3 text-white/55">
          Add courses, manage platform content, and control premium learning assets.
        </p>

        <p className="mt-3 text-sm text-white/40">
          Logged in as @{user.username}
        </p>
      </div>

      {params.success === "course-created" ? (
        <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-100">
          Course created successfully.
        </div>
      ) : null}

      {params.error === "missing-course-fields" ? (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          Course title and description are required.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          action="/api/admin/courses"
          method="post"
          className="glass-panel rounded-[2rem] p-6"
        >
          <h2 className="text-2xl font-black">
            Add new course
          </h2>

          <label className="mb-2 mt-5 block text-sm font-bold">
            Course title
          </label>
          <input
            className="input"
            name="title"
            placeholder="Thumbnail Design Mastery"
            required
          />

          <label className="mb-2 mt-5 block text-sm font-bold">
            Description
          </label>
          <textarea
            className="input min-h-28"
            name="description"
            placeholder="Learn anime thumbnail design, GFX composition, color, and click appeal."
            required
          />

          <label className="mb-2 mt-5 block text-sm font-bold">
            Level
          </label>
          <select className="input" name="level" defaultValue="Beginner">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Pro</option>
          </select>

          <label className="mb-2 mt-5 block text-sm font-bold">
            Number of lessons
          </label>
          <input
            className="input"
            name="lessons"
            type="number"
            min="1"
            defaultValue="5"
          />

          <label className="mb-2 mt-5 block text-sm font-bold">
            Duration
          </label>
          <input
            className="input"
            name="duration"
            placeholder="3h 20m"
            defaultValue="1h"
          />

          <label className="mb-2 mt-5 block text-sm font-bold">
            Card gradient
          </label>
          <select
            className="input"
            name="gradient"
            defaultValue="from-red-700 via-black to-purple-900"
          >
            <option value="from-red-700 via-black to-purple-900">
              Red / Black / Purple
            </option>
            <option value="from-blue-700 via-black to-cyan-900">
              Blue / Black / Cyan
            </option>
            <option value="from-yellow-600 via-red-800 to-black">
              Gold / Red / Black
            </option>
            <option value="from-fuchsia-700 via-black to-indigo-900">
              Pink / Black / Indigo
            </option>
          </select>

          <label className="mt-5 flex items-center gap-3 text-sm font-bold">
            <input name="isPremium" type="checkbox" />
            Premium course
          </label>

          <button className="primary-button mt-6 w-full justify-center" type="submit">
            Publish course
          </button>
        </form>

        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black">
            Latest database courses
          </h2>

          <div className="mt-5 grid gap-3">
            {courses.length ? (
              courses.map((course) => (
                <div key={course.id} className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-black">{course.title}</h3>

                      <p className="mt-2 line-clamp-2 text-sm text-white/50">
                        {course.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/45">
                        <span className="pill">{course.level}</span>
                        <span className="pill">{course.lessons} lessons</span>
                        <span className="pill">{course.duration}</span>
                        {course.isPremium ? (
                          <span className="pill bg-gold/20 text-yellow-100">
                            Premium
                          </span>
                        ) : (
                          <span className="pill">Free</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/50">
                No database courses yet. Add your first course using the form.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
