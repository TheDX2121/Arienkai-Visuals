import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
  createdAt: Date;
};

async function getDatabaseCourses() {
  try {
    return await prisma.$queryRaw<DbCourse[]>`
      SELECT
        "id",
        "title",
        "description",
        "level",
        "lessons",
        "duration",
        "gradient",
        "thumbnailUrl",
        "isPremium",
        "createdAt"
      FROM "Course"
      ORDER BY "createdAt" DESC
    `;
  } catch {
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getDatabaseCourses();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="pill mb-4 w-fit">Courses</div>

        <h1 className="text-4xl font-black">
          Learn editing, GFX, thumbnails, and creator workflows.
        </h1>

        <p className="mt-3 max-w-2xl text-white/55">
          Explore free and premium courses for editors, designers, and anime creators.
        </p>
      </div>

      {courses.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="card-hover glass-panel block min-h-[315px] overflow-hidden rounded-[1.75rem]"
            >
              <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${course.gradient} p-4`}>
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}

                <div className="absolute inset-0 bg-black/25" />

                <div className="relative z-10 flex gap-2">
                  <span className="pill bg-black/30">{course.level}</span>

                  {course.isPremium ? (
                    <span className="pill bg-gold/25 text-yellow-100">
                      Premium
                    </span>
                  ) : (
                    <span className="pill bg-black/30">
                      Free
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="text-lg font-black">
                  {course.title}
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/58">
                  {course.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                  <span>{course.lessons} lessons</span>
                  <span>{course.duration}</span>
                </div>

                <div className="mt-5 rounded-full bg-white px-4 py-2 text-center text-xs font-black text-black">
                  Open course
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-[2rem] p-8 text-white/55">
          No courses have been added yet. Add courses from the admin panel.
        </div>
      )}
    </section>
  );
}
