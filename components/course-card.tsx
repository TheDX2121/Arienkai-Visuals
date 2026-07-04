import Link from "next/link";
import type { Course } from "@/lib/types";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`} className="card-hover glass-panel block min-h-[315px] overflow-hidden rounded-[1.75rem]">
      <div className={`h-40 bg-gradient-to-br ${course.gradient} p-4`}>
        <span className="pill bg-black/30">{course.level}</span>
      </div>

      <div className="p-4">
        <div className="text-lg font-black">{course.title}</div>
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
  );
}
