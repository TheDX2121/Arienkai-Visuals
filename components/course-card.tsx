import type { Course } from "@/lib/types";

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="card-hover glass-panel min-h-[315px] overflow-hidden rounded-[1.75rem]">
      <div className={`h-40 bg-gradient-to-br ${course.gradient} p-4`}>
        <span className="pill bg-black/30">{course.level}</span>
      </div>
      <div className="p-4">
        <div className="text-lg font-black">{course.title}</div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/58">{course.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-white/50">
          <span>{course.lessons} lessons</span>
          <span>{course.duration}</span>
        </div>
      </div>
    </article>
  );
}
