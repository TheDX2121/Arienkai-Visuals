import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { AdvancedVideoPlayer } from "@/components/advanced-video-player";

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
  priceInr: number;
  purchaseUrl: string | null;
};

type DbLesson = {
  id: string;
  title: string;
  description: string;
  videoUrl: string | null;
  captionsUrl: string | null;
  duration: string;
  order: number;
  isPreview: boolean;
};

type DbUserAccess = {
  role: string;
  subscription: string;
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
        "isPremium",
        "priceInr",
        "purchaseUrl"
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
        "captionsUrl",
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

async function getUserAccess(userId?: string) {
  if (!userId) return null;

  try {
    const users = await prisma.$queryRaw<DbUserAccess[]>`
      SELECT
        "role",
        "subscription"
      FROM "User"
      WHERE "id" = ${userId}
      LIMIT 1
    `;

    return users[0] || null;
  } catch {
    return null;
  }
}

function LinkifiedText({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("http://") || part.startsWith("https://")) {
          return (
            <a
              key={`${part}-${index}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all font-bold text-red-200 underline underline-offset-4 hover:text-white"
            >
              {part}
            </a>
          );
        }

        return <span key={`${part}-${index}`}>{part}</span>;
      })}
    </>
  );
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id, lesson } = await params;
  const lessonNumber = Number(lesson);
  const user = await currentUser();

  if (!Number.isInteger(lessonNumber)) {
    notFound();
  }

  const course = await getDatabaseCourse(id);

  if (!course) {
    notFound();
  }

  const lessons = await getDatabaseLessons(course.id);
  const currentLesson = lessons.find((item) => item.order === lessonNumber);

  if (!currentLesson) {
    notFound();
  }

  const access = await getUserAccess(user?.id);

  const canWatchPremium =
    !course.isPremium ||
    currentLesson.isPreview ||
    access?.role === "ADMIN" ||
    access?.subscription === "CREATOR" ||
    access?.subscription === "STUDIO";

  const previousLesson =
    lessonNumber > 1
      ? lessons.find((item) => item.order === lessonNumber - 1)
      : null;

  const nextLesson =
    lessons.find((item) => item.order === lessonNumber + 1) || null;

  const watermarkText = user
    ? `@${user.username}`
    : "Guest";

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

        <div className="flex flex-wrap gap-2">
          <span className="pill">{course.level}</span>

          {course.isPremium ? (
            <span className="pill bg-gold/20 text-yellow-100">
              Premium
            </span>
          ) : (
            <span className="pill">
              Free
            </span>
          )}
        </div>
      </div>

      {!canWatchPremium ? (
        <div className="glass-panel rounded-[2rem] p-8 text-center">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-gold/15 text-3xl">
            🔒
          </div>

          <h2 className="text-3xl font-black">
            This is a premium lesson
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-white/55">
            Purchase this course or upgrade your account to watch premium lessons.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {course.purchaseUrl ? (
              <a href={course.purchaseUrl} className="primary-button">
                Buy course {course.priceInr ? `₹${course.priceInr}` : ""}
              </a>
            ) : (
              <Link href="/premium" className="primary-button">
                View premium plans
              </Link>
            )}

            {!user ? (
              <Link href={`/login?next=/courses/${course.id}/lesson/${lessonNumber}`} className="secondary-button">
                Sign in
              </Link>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.35fr_.65fr]">
          <div>
            {currentLesson.videoUrl ? (
              <AdvancedVideoPlayer
                src={currentLesson.videoUrl}
                poster={course.thumbnailUrl}
                title={currentLesson.title}
                watermarkText={watermarkText}
                captionsUrl={currentLesson.captionsUrl}
              />
            ) : (
              <div className={`grid min-h-[460px] place-items-center rounded-[2rem] bg-gradient-to-br ${course.gradient} p-8 text-center`}>
                <div>
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/15 text-3xl">
                    ▶
                  </div>

                  <h2 className="mt-6 text-3xl font-black">
                    {currentLesson.title}
                  </h2>

                  <p className="mx-auto mt-3 max-w-xl text-white/65">
                    No video has been added to this lesson yet.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap justify-between gap-3">
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
            <h2 className="text-2xl font-black">
              {currentLesson.title}
            </h2>

            <p className="mt-4 whitespace-pre-line leading-7 text-white/60">
              <LinkifiedText text={currentLesson.description || "No lesson notes added yet."} />
            </p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="font-bold">Duration</div>
                <p className="mt-2 text-sm text-white/50">
                  {currentLesson.duration}
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <div className="font-bold">Captions</div>
                <p className="mt-2 text-sm text-white/50">
                  {currentLesson.captionsUrl ? "Captions available" : "No captions file yet"}
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <div className="font-bold">Video protection</div>
                <p className="mt-2 text-sm text-white/50">
                  Right-click and native download controls are hidden. Watermark is visible on the player.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
