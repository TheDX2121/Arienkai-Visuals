import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "@/lib/demo-data";

type LessonPageProps = {
  params: Promise<{
    id: string;
    lesson: string;
  }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { id, lesson } = await params;

  const course = courses.find((item) => item.id === id);
  const lessonNumber = Number(lesson);

  if (!course || !Number.isInteger(lessonNumber)) {
    notFound();
  }

  if (lessonNumber < 1 || lessonNumber > course.lessons) {
    notFound();
  }

  const nextLesson =
    lessonNumber < course.lessons
      ? `/courses/${course.id}/lesson/${lessonNumber + 1}`
      : null;

  const previousLesson =
    lessonNumber > 1
      ? `/courses/${course.id}/lesson/${lessonNumber - 1}`
      : null;

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
            Lesson {lessonNumber} of {course.lessons}
          </p>
        </div>

        <span className="pill">{course.level}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_.65fr]">
        <div className="glass-panel overflow-hidden rounded-[2rem]">
          <div className={`grid min-h-[460px] place-items-center bg-gradient-to-br ${course.gradient} p-8 text-center`}>
            <div>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/15 text-3xl">
                ▶
              </div>

              <h2 className="mt-6 text-3xl font-black">
                Lesson {lessonNumber}: Preview Player
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-white/65">
                This is the lesson player page. Later you can connect real video lessons from Cloudinary, YouTube unlisted, Vimeo, or your own storage.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-3 p-5">
            {previousLesson ? (
              <Link href={previousLesson} className="secondary-button">
                Previous lesson
              </Link>
            ) : (
              <span />
            )}

            {nextLesson ? (
              <Link href={nextLesson} className="primary-button">
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
          <h2 className="text-2xl font-black">Lesson notes</h2>

          <p className="mt-4 leading-7 text-white/60">
            Add lesson notes, downloadable files, project files, shortcuts, and resources here.
          </p>

          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl bg-white/5 p-4">
              <div className="font-bold">What you learn</div>
              <p className="mt-2 text-sm text-white/50">
                Editing workflow, composition, pacing, color, thumbnails, and creator polish.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4">
              <div className="font-bold">Resources</div>
              <p className="mt-2 text-sm text-white/50">
                Resource downloads will be connected later.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
