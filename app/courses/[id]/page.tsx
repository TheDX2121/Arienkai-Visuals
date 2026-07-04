import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "@/lib/demo-data";

type CourseDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CourseDetailPage({ params }: CourseDetailProps) {
  const { id } = await params;
  const course = courses.find((item) => item.id === id);

  if (!course) {
    notFound();
  }

  const lessons = Array.from({ length: Math.min(course.lessons, 8) }).map((_, index) => ({
    number: index + 1,
    title: `Lesson ${index + 1}: ${index === 0 ? "Course introduction" : "Editing workflow breakdown"}`,
    duration: `${8 + index * 3} min`
  }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className={`rounded-[2rem] bg-gradient-to-br ${course.gradient} p-8 shadow-card md:p-12`}>
        <span className="pill bg-black/30">{course.level}</span>

        <h1 className="mt-5 max-w-3xl text-5xl font-black tracking-tight">
          {course.title}
        </h1>

        <p className="mt-5 max-w-2xl text-white/70">
          {course.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="pill bg-black/30">{course.lessons} lessons</span>
          <span className="pill bg-black/30">{course.duration}</span>
          <span className="pill bg-black/30">Creator focused</span>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className="primary-button">
            Start course
          </Link>
          <Link href="/premium" className="secondary-button">
            Unlock premium
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-3">
        <h2 className="text-2xl font-black">Course lessons</h2>

        {lessons.map((lesson) => (
          <div key={lesson.number} className="glass-panel flex items-center justify-between rounded-2xl p-4">
            <div>
              <div className="font-bold">{lesson.title}</div>
              <div className="mt-1 text-sm text-white/45">{lesson.duration}</div>
            </div>

            <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white">
              Preview
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
