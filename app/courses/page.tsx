import Link from "next/link";
import { courses as demoCourses } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

type DbCourse = {
  id: string;
  title: string;
  description: string;
  level: string;
  lessons: number;
  duration: string;
  gradient: string;
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
  const databaseCourses = await getDatabaseCourses();

  const courses = [
    ...databaseCourses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      lessons: course.lessons,
      duration: course.duration,
      gradient: course.gradient,
      premium: course.isPremium
    })),
    ...demoCourses.map((course) => ({
      ...course,
      premium: false
    }))
  ];

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="card-hover glass-panel block min-h-[315px] overflow-hidden rounded-[1.75rem]"
          >
            <div className={`h-40 bg-gradient-to-br ${course.gradient} p-4`}>
              <div className="flex gap-2">
                <span className="pill bg-black/30">{course.level}</span>

                {course.premium ? (
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
    </section>
  );
}
