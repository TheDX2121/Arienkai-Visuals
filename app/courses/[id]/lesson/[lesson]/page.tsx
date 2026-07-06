import Link from "next/link";
import { notFound } from "next/navigation";
import { courses as demoCourses } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

type LessonPageProps = {
  params: Promise<{
    id: string;
    lesson: string;
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
  thumbnailUrl: string | null;
  isPremium: boolean;
};

type DbLesson = {
  id: string;
  title: string;
  description: string;
  videoUrl: string | null;
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
        "thumbnailUrl",
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
        "videoUrl",
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

export default async function LessonPage({ params }: LessonPageProps) {
  const { id, lesson } = await params;
  const lessonNumber = Number(lesson);

  if (!Number.isInteger(lessonNumber)) {
    notFound();
  }

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
        thumbnailUrl: dbCourse.thumbnailUrl,
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
        thumbnailUrl: null,
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
          videoUrl: null,
          duration: `${8 + index * 2} min`,
          order: index + 1,
          isPreview: index === 0
        }));

  const currentLesson = lessons.find((item) => item.order === lessonNumber);

  if (!currentLesson) {
    notFound();
  }

  const previousLesson =
    lessonNumber > 1
      ? lessons.find((item) => item.order === lessonNumber - 1)
      : null;

  const nextLesson =
    lessons.find((item) => item.order === lessonNumber + 1) || null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={`/courses/${course.id}`} className="text-sm text-white/50 hover:text-white">
            ← Back to course
          </Link>

          <h1 className="mt-3 text-4xl font-black">
            {course.title}
          </h1>

          <p className="mt-2 text-white/50">
            Lesson {lessonNumber} of {lessons.length}
          </p>
        </div>

        <span className="pill">{course.level}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_.65fr]">
        <div className="glass-panel overflow-hidden rounded-[2rem]">
          <div className={`grid min-h-[460px] place-items-center bg-gradient-to-br ${course.gradient} p-8 text-center`}>
            {currentLesson.videoUrl ? (
              <video
                src={currentLesson.videoUrl}
                controls
                className="max-h-[460px] w-full rounded-2xl"
              />
            ) : course.thumbnailUrl ? (
              <div className="relative grid min-h-[460px] w-full place-items-center overflow-hidden rounded-2xl">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 text-center">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/15 text-3xl">
                    ▶
                  </div>

                  <h2 className="mt-6 text-3xl font-black">
                    {currentLesson.title}
                  </h2>

                  <p className="mx-auto mt-3 max-w-xl text-white/65">
                    No video URL added yet. Add a Cloudinary, YouTube, Vimeo, or direct video URL from the admin panel.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/15 text-3xl">
                  ▶
                </div>

                <h2 className="mt-6 text-3xl font-black">
                  {currentLesson.title}
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-white/65">
                  No video URL added yet. Add a Cloudinary, YouTube, Vimeo, or direct video URL from the admin panel.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-between gap-3 p-5">
            {previousLesson ? (
              <Link href={`/courses/${course.id}/lesson/${previousLesson.order}`} className="secondary-button">
                Previous lesson
              </Link>
            ) : (
              <span />
            )}

            {nextLesson ? (
              <Link href={`/courses/${course.id}/lesson/${nextLesson.order}`} className="primary-button">
                Next lesson
              </Link>
            ) : (
              <Link href="/courses" className="primary-button">
                Finish course
              </Link>
            )}
          </div>
        </div>

        <aside className="glass-panel h-fit rounded-[2rem] p-6">
          <h2 className="text-2xl font-black">{currentLesson.title}</h2>

          <p className="mt-4 leading-7 text-white/60">
            {currentLesson.description || "No lesson notes added yet."}
          </p>

          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl bg-white/5 p-4">
              <div className="font-bold">Duration</div>
              <p className="mt-2 text-sm text-white/50">{currentLesson.duration}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4">
              <div className="font-bold">Preview lesson</div>
              <p className="mt-2 text-sm text-white/50">
                {currentLesson.isPreview ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
