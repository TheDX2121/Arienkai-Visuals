import Link from "next/link";
import { notFound } from "next/navigation";
import { courses as demoCourses } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

type CourseDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

type DbCourse = {
  id: string;
  title: string;
  description: string;
  level: string;
  lessons: number;
  duration: string;
  gradient: string;
  isPremium: boolean;
};

type DbLesson = {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  isPreview: boolean;
};

async function getDatabaseCourse(id: string) {
  try {
    const courses = await prisma.$queryRaw<DbCourse[]>`
      SELECT
        "id",
        "title",
        "description",
        "level",
        "lessons",
        "duration",
        "gradient",
        "isPremium"
      FROM "Course"
      WHERE "id" = ${id}
      LIMIT 1
    `;

    return courses[0] || null;
  } catch {
    return null;
  }
}

async function getDatabaseLessons(courseId: string) {
  try {
    return await prisma.$queryRaw<DbLesson[]>`
      SELECT
        "id",
        "title",
        "description",
        "duration",
        "order",
        "isPreview"
      FROM "Lesson"
      WHERE "courseId" = ${courseId}
      ORDER BY "order" ASC
    `;
  } catch {
    return [];
  }
}

export default async function CourseDetailPage({ params }: CourseDetailProps) {
  const { id } = await params;

  const dbCourse = await getDatabaseCourse(id);
  const demoCourse = dbCourse ? null : demoCourses.find((item) => item.id === id);

  if (!dbCourse && !demoCourse) {
    notFound();
  }

  const course = dbCourse
    ? {
        id: dbCourse.id,
        title: dbCourse.title,
        description: dbCourse.description,
        level: dbCourse.level,
        lessons: dbCourse.lessons,
        duration: dbCourse.duration,
        gradient: dbCourse.gradient,
        premium: dbCourse.isPremium,
        source: "database" as const
      }
    : {
        id: demoCourse!.id,
        title: demoCourse!.title,
        description: demoCourse!.description,
        level: demoCourse!.level,
        lessons: demoCourse!.lessons,
        duration: demoCourse!.duration,
        gradient: demoCourse!.gradient,
        premium: false,
        source: "demo" as const
      };

  const dbLessons = dbCourse ? await getDatabaseLessons(course.id) : [];

  const lessons =
    course.source === "database"
      ? dbLessons
      : Array.from({ length: course.lessons }).map((_, index) => ({
          id: `demo_${index + 1}`,
          title:
            index === 0
              ? "Course introduction"
              : index === 1
                ? "Project setup and workflow"
                : index === 2
                  ? "Main editing breakdown"
                  : `Advanced lesson ${index + 1}`,
          description: "Demo lesson preview.",
          duration: `${8 + index * 2} min`,
          order: index + 1,
          isPreview: index === 0
        }));

  const firstLesson = lessons[0];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className={`rounded-[2rem] bg-gradient-to-br ${course.gradient} p-8 shadow-card md:p-12`}>
        <div className="flex flex-wrap gap-2">
          <span className="pill bg-black/30">{course.level}</span>

          {course.premium ? (
            <span className="pill bg-gold/25 text-yellow-100">Premium</span>
          ) : (
            <span className="pill bg-black/30">Free</span>
          )}
        </div>

        <h1 className="mt-5 max-w-3xl text-5xl font-black tracking-tight">
          {course.title}
        </h1>

        <p className="mt-5 max-w-2xl text-white/70">
          {course.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="pill bg-black/30">{lessons.length} lessons</span>
          <span className="pill bg-black/30">{course.duration}</span>
          <span className="pill bg-black/30">Creator focused</span>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {firstLesson ? (
            <Link href={`/courses/${course.id}/lesson/${firstLesson.order}`} className="primary-button">
              Start course
            </Link>
          ) : (
            <span className="secondary-button opacity-60">
              No lessons added yet
            </span>
          )}

          <Link href="/courses" className="secondary-button">
            Back to courses
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-3">
        <h2 className="text-2xl font-black">Course lessons</h2>

        {lessons.length ? (
          lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/courses/${course.id}/lesson/${lesson.order}`}
              className="glass-panel flex items-center justify-between rounded-2xl p-4 transition hover:bg-white/10"
            >
              <div>
                <div className="font-bold">
                  {lesson.order}. {lesson.title}
                </div>

                <div className="mt-1 text-sm text-white/45">
                  {lesson.duration}
                </div>

                {lesson.description ? (
                  <p className="mt-2 line-clamp-2 text-sm text-white/45">
                    {lesson.description}
                  </p>
                ) : null}
              </div>

              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white">
                Preview
              </span>
            </Link>
          ))
        ) : (
          <div className="glass-panel rounded-2xl p-5 text-white/55">
            No lessons have been added to this course yet. Add lessons from the admin panel.
          </div>
        )}
      </div>
    </section>
  );
}
