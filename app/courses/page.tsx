import { CourseCard } from "@/components/course-card";
import { courses } from "@/lib/demo-data";

export default function CoursesPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="pill mb-4 w-fit">Learning paths</div>
        <h1 className="text-4xl font-black">Courses for editors and GFX designers</h1>
        <p className="mt-3 max-w-2xl text-white/55">Organized, affordable training from beginner basics to professional creator workflows.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {courses.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>
    </section>
  );
}
