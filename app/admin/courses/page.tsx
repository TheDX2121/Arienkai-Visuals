import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CloudinaryUploadField } from "@/components/cloudinary-upload-field";

type AdminCoursesPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

type DbCourse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  lessons: number;
  duration: string;
  gradient: string;
  thumbnailUrl: string | null;
  isPremium: boolean;
  createdAt: Date;
};

type DbLesson = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string | null;
  duration: string;
  order: number;
  isPreview: boolean;
};

async function getCourses() {
  try {
    return await prisma.$queryRaw<DbCourse[]>`
      SELECT
        "id",
        "title",
        "slug",
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

async function getLessons() {
  try {
    return await prisma.$queryRaw<DbLesson[]>`
      SELECT
        "id",
        "courseId",
        "title",
        "description",
        "videoUrl",
        "duration",
        "order",
        "isPreview"
      FROM "Lesson"
      ORDER BY "order" ASC
    `;
  } catch {
    return [];
  }
}

function lessonsForCourse(lessons: DbLesson[], courseId: string) {
  return lessons.filter((lesson) => lesson.courseId === courseId);
}

export default async function AdminCoursesPage({ searchParams }: AdminCoursesPageProps) {
  const user = await currentUser();
  const params = await searchParams;

  if (!user) {
    redirect("/login?next=/admin/courses");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const courses = await getCourses();
  const lessons = await getLessons();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <details className="glass-panel mb-8 rounded-2xl p-4" open>
        <summary className="cursor-pointer text-lg font-black">
          ☰ Admin Menu
        </summary>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin" className="secondary-button">
            Dashboard
          </Link>

          <Link href="/admin/courses" className="primary-button">
            Courses
          </Link>

          <span className="secondary-button opacity-60">Materials soon</span>
          <span className="secondary-button opacity-60">News soon</span>
          <span className="secondary-button opacity-60">Users soon</span>
        </div>
      </details>

      <div className="mb-8">
        <div className="pill mb-4 w-fit">Course manager</div>

        <h1 className="text-4xl font-black">
          Add, edit, delete courses and lessons
        </h1>

        <p className="mt-3 text-white/55">
          Upload thumbnails and lesson videos directly to Cloudinary, or paste URLs manually.
        </p>
      </div>

      {params.success ? (
        <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-100">
          Action completed successfully.
        </div>
      ) : null}

      {params.error ? (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          Something went wrong. Check required fields.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          action="/api/admin/courses"
          method="post"
          className="glass-panel rounded-[2rem] p-6"
        >
          <h2 className="text-2xl font-black">Add new course</h2>

          <label className="mb-2 mt-5 block text-sm font-bold">
            Course title
          </label>

          <input
            className="input"
            name="title"
            placeholder="Thumbnail Design Mastery"
            required
          />

          <label className="mb-2 mt-5 block text-sm font-bold">
            Description
          </label>

          <textarea
            className="input min-h-28"
            name="description"
            placeholder="Course description..."
            required
          />

          <label className="mb-2 mt-5 block text-sm font-bold">
            Level
          </label>

          <select className="input" name="level" defaultValue="Beginner">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Pro</option>
          </select>

          <label className="mb-2 mt-5 block text-sm font-bold">
            Number of lessons
          </label>

          <input
            className="input"
            name="lessons"
            type="number"
            min="1"
            defaultValue="1"
          />

          <label className="mb-2 mt-5 block text-sm font-bold">
            Duration
          </label>

          <input
            className="input"
            name="duration"
            placeholder="3h 20m"
            defaultValue="1h"
          />

          <CloudinaryUploadField
            name="thumbnailUrl"
            label="Thumbnail image"
            resourceType="image"
            buttonText="Upload image"
            placeholder="Paste thumbnail image URL or upload image"
          />

          <label className="mb-2 mt-5 block text-sm font-bold">
            Card gradient backup
          </label>

          <select
            className="input"
            name="gradient"
            defaultValue="from-red-700 via-black to-purple-900"
          >
            <option value="from-red-700 via-black to-purple-900">
              Red / Black / Purple
            </option>

            <option value="from-blue-700 via-black to-cyan-900">
              Blue / Black / Cyan
            </option>

            <option value="from-yellow-600 via-red-800 to-black">
              Gold / Red / Black
            </option>

            <option value="from-fuchsia-700 via-black to-indigo-900">
              Pink / Black / Indigo
            </option>
          </select>

          <label className="mt-5 flex items-center gap-3 text-sm font-bold">
            <input name="isPremium" type="checkbox" />
            Premium course
          </label>

          <button className="primary-button mt-6 w-full justify-center" type="submit">
            Publish course
          </button>
        </form>

        <div className="grid gap-4">
          {courses.length ? (
            courses.map((course) => {
              const courseLessons = lessonsForCourse(lessons, course.id);

              return (
                <article key={course.id} className="glass-panel rounded-[2rem] p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black">
                        {course.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 text-sm text-white/55">
                        {course.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/45">
                        <span className="pill">{course.level}</span>
                        <span className="pill">{courseLessons.length} lessons added</span>
                        <span className="pill">{course.duration}</span>

                        {course.isPremium ? (
                          <span className="pill bg-gold/20 text-yellow-100">
                            Premium
                          </span>
                        ) : (
                          <span className="pill">Free</span>
                        )}
                      </div>
                    </div>

                    <Link href={`/courses/${course.id}`} className="secondary-button">
                      View
                    </Link>
                  </div>

                  {course.thumbnailUrl ? (
                    <div className="mt-5 overflow-hidden rounded-2xl">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="h-44 w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <details className="mt-5 rounded-2xl bg-white/5 p-4">
                    <summary className="cursor-pointer font-black">
                      Edit course
                    </summary>

                    <form
                      action={`/api/admin/courses/${course.id}/update`}
                      method="post"
                      className="mt-4 grid gap-4"
                    >
                      <input
                        className="input"
                        name="title"
                        defaultValue={course.title}
                        required
                      />

                      <textarea
                        className="input min-h-24"
                        name="description"
                        defaultValue={course.description}
                        required
                      />

                      <input
                        className="input"
                        name="level"
                        defaultValue={course.level}
                        required
                      />

                      <input
                        className="input"
                        name="lessons"
                        type="number"
                        min="1"
                        defaultValue={course.lessons}
                      />

                      <input
                        className="input"
                        name="duration"
                        defaultValue={course.duration}
                      />

                      <CloudinaryUploadField
                        name="thumbnailUrl"
                        label="Thumbnail image"
                        defaultValue={course.thumbnailUrl}
                        resourceType="image"
                        buttonText="Upload image"
                        placeholder="Paste thumbnail image URL or upload image"
                      />

                      <input
                        className="input"
                        name="gradient"
                        defaultValue={course.gradient}
                      />

                      <label className="flex items-center gap-3 text-sm font-bold">
                        <input
                          name="isPremium"
                          type="checkbox"
                          defaultChecked={course.isPremium}
                        />
                        Premium course
                      </label>

                      <button className="primary-button w-fit" type="submit">
                        Save changes
                      </button>
                    </form>
                  </details>

                  <details className="mt-4 rounded-2xl bg-white/5 p-4">
                    <summary className="cursor-pointer font-black">
                      Lessons
                    </summary>

                    <form
                      action={`/api/admin/courses/${course.id}/lessons`}
                      method="post"
                      className="mt-4 grid gap-4"
                    >
                      <input
                        className="input"
                        name="title"
                        placeholder="Lesson title"
                        required
                      />

                      <textarea
                        className="input min-h-20"
                        name="description"
                        placeholder="Lesson notes / description"
                      />

                      <CloudinaryUploadField
                        name="videoUrl"
                        label="Lesson video"
                        resourceType="video"
                        buttonText="Upload video"
                        placeholder="Paste lesson video URL or upload video"
                      />

                      <input
                        className="input"
                        name="duration"
                        placeholder="10 min"
                        defaultValue="10 min"
                      />

                      <input
                        className="input"
                        name="order"
                        type="number"
                        min="1"
                        defaultValue={courseLessons.length + 1}
                      />

                      <label className="flex items-center gap-3 text-sm font-bold">
                        <input
                          name="isPreview"
                          type="checkbox"
                          defaultChecked={courseLessons.length === 0}
                        />
                        Preview lesson
                      </label>

                      <button className="primary-button w-fit" type="submit">
                        Add lesson
                      </button>
                    </form>

                    <div className="mt-5 grid gap-2">
                      {courseLessons.length ? (
                        courseLessons.map((lesson) => (
                          <div key={lesson.id} className="rounded-2xl bg-black/25 p-3">
                            <div className="font-bold">
                              {lesson.order}. {lesson.title}
                            </div>

                            <div className="mt-1 text-xs text-white/45">
                              {lesson.duration} · {lesson.isPreview ? "Preview" : "Locked"}
                            </div>

                            {lesson.videoUrl ? (
                              <div className="mt-1 break-all text-xs text-white/30">
                                Video added
                              </div>
                            ) : (
                              <div className="mt-1 text-xs text-white/30">
                                No video yet
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-white/45">
                          No lessons added yet.
                        </p>
                      )}
                    </div>
                  </details>

                  <form
                    action={`/api/admin/courses/${course.id}/delete`}
                    method="post"
                    className="mt-4"
                  >
                    <button
                      className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100"
                      type="submit"
                    >
                      Delete course
                    </button>
                  </form>
                </article>
              );
            })
          ) : (
            <div className="glass-panel rounded-[2rem] p-6 text-white/55">
              No database courses yet. Add your first course.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
