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

type DbCategory = {
  id: string;
  name: string;
  slug: string;
};

type DbCourse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string | null;
  categoryName: string | null;
  level: string;
  lessons: number;
  duration: string;
  gradient: string;
  thumbnailUrl: string | null;
  isPremium: boolean;
  priceInr: number;
  purchaseUrl: string | null;
  createdAt: Date;
};

type DbLesson = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string | null;
  captionsUrl: string | null;
  duration: string;
  order: number;
  isPreview: boolean;
};

async function getCategories() {
  try {
    return await prisma.$queryRaw<DbCategory[]>`
      SELECT
        "id",
        "name",
        "slug"
      FROM "Category"
      ORDER BY "name" ASC
    `;
  } catch {
    return [];
  }
}

async function getCourses() {
  try {
    return await prisma.$queryRaw<DbCourse[]>`
      SELECT
        c."id",
        c."title",
        c."slug",
        c."description",
        c."categoryId",
        cat."name" AS "categoryName",
        c."level",
        c."lessons",
        c."duration",
        c."gradient",
        c."thumbnailUrl",
        c."isPremium",
        c."priceInr",
        c."purchaseUrl",
        c."createdAt"
      FROM "Course" c
      LEFT JOIN "Category" cat ON cat."id" = c."categoryId"
      ORDER BY c."createdAt" DESC
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
        "captionsUrl",
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

  const categories = await getCategories();
  const courses = await getCourses();
  const lessons = await getLessons();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <details className="glass-panel mb-8 rounded-2xl p-4">
        <summary className="cursor-pointer text-lg font-black">
          ☰ Admin Menu
        </summary>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin" className="secondary-button">Dashboard</Link>
          <Link href="/admin/courses" className="primary-button">Courses</Link>
          <Link href="/admin/categories" className="secondary-button">Categories</Link>
        </div>
      </details>

      <div className="mb-8">
        <div className="pill mb-4 w-fit">Course manager</div>

        <h1 className="text-4xl font-black">
          Add, edit, delete courses and lessons
        </h1>

        <p className="mt-3 text-white/55">
          Courses stay compact. Open each course only when you need to edit it.
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

      <details className="glass-panel mb-6 rounded-[2rem] p-6">
        <summary className="cursor-pointer text-2xl font-black">
          + Add new course
        </summary>

        <form
          action="/api/admin/courses"
          method="post"
          className="mt-5 grid gap-4"
        >
          <input className="input" name="title" placeholder="Course title" required />

          <textarea
            className="input min-h-28"
            name="description"
            placeholder="Course description..."
            required
          />

          <select className="input" name="categoryId" defaultValue="">
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select className="input" name="level" defaultValue="Beginner">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Pro</option>
          </select>

          <input className="input" name="lessons" type="number" min="1" defaultValue="1" />
          <input className="input" name="duration" placeholder="3h 20m" defaultValue="1h" />

          <CloudinaryUploadField
            name="thumbnailUrl"
            label="Thumbnail image"
            resourceType="image"
            buttonText="Upload image"
            placeholder="Paste thumbnail image URL or upload image"
          />

          <select className="input" name="gradient" defaultValue="from-red-700 via-black to-purple-900">
            <option value="from-red-700 via-black to-purple-900">Red / Black / Purple</option>
            <option value="from-blue-700 via-black to-cyan-900">Blue / Black / Cyan</option>
            <option value="from-yellow-600 via-red-800 to-black">Gold / Red / Black</option>
            <option value="from-fuchsia-700 via-black to-indigo-900">Pink / Black / Indigo</option>
          </select>

          <label className="flex items-center gap-3 text-sm font-bold">
            <input name="isPremium" type="checkbox" />
            Premium / purchasable course
          </label>

          <input className="input" name="priceInr" type="number" min="0" defaultValue="0" />
          <input className="input" name="purchaseUrl" placeholder="Purchase link" />

          <button className="primary-button w-fit" type="submit">
            Publish course
          </button>
        </form>
      </details>

      <div className="grid gap-4">
        {courses.length ? (
          courses.map((course) => {
            const courseLessons = lessonsForCourse(lessons, course.id);

            return (
              <details key={course.id} className="glass-panel rounded-[2rem] p-5">
                <summary className="cursor-pointer">
                  <div className="inline-flex flex-wrap items-center gap-3">
                    <span className="text-xl font-black">{course.title}</span>
                    {course.categoryName ? <span className="pill">{course.categoryName}</span> : null}
                    <span className="pill">{courseLessons.length} lessons</span>
                    {course.isPremium ? (
                      <span className="pill bg-gold/20 text-yellow-100">
                        Premium {course.priceInr ? `₹${course.priceInr}` : ""}
                      </span>
                    ) : (
                      <span className="pill">Free</span>
                    )}
                  </div>
                </summary>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/courses/${course.id}`} className="secondary-button">
                    View course
                  </Link>
                </div>

                <details className="mt-5 rounded-2xl bg-white/5 p-4">
                  <summary className="cursor-pointer font-black">Edit course</summary>

                  <form
                    action={`/api/admin/courses/${course.id}/update`}
                    method="post"
                    className="mt-4 grid gap-4"
                  >
                    <input className="input" name="title" defaultValue={course.title} required />

                    <textarea
                      className="input min-h-24"
                      name="description"
                      defaultValue={course.description}
                      required
                    />

                    <select className="input" name="categoryId" defaultValue={course.categoryId || ""}>
                      <option value="">No category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>

                    <input className="input" name="level" defaultValue={course.level} required />
                    <input className="input" name="lessons" type="number" min="1" defaultValue={course.lessons} />
                    <input className="input" name="duration" defaultValue={course.duration} />

                    <CloudinaryUploadField
                      name="thumbnailUrl"
                      label="Thumbnail image"
                      defaultValue={course.thumbnailUrl}
                      resourceType="image"
                      buttonText="Upload image"
                      placeholder="Paste thumbnail image URL or upload image"
                    />

                    <input className="input" name="gradient" defaultValue={course.gradient} />

                    <label className="flex items-center gap-3 text-sm font-bold">
                      <input name="isPremium" type="checkbox" defaultChecked={course.isPremium} />
                      Premium / purchasable course
                    </label>

                    <input className="input" name="priceInr" type="number" min="0" defaultValue={course.priceInr} />
                    <input className="input" name="purchaseUrl" defaultValue={course.purchaseUrl || ""} />

                    <button className="primary-button w-fit" type="submit">
                      Save course
                    </button>
                  </form>
                </details>

                <details className="mt-4 rounded-2xl bg-white/5 p-4">
                  <summary className="cursor-pointer font-black">Manage lessons</summary>

                  <form
                    action={`/api/admin/courses/${course.id}/lessons`}
                    method="post"
                    className="mt-4 grid gap-4"
                  >
                    <input className="input" name="title" placeholder="Lesson title" required />

                    <textarea
                      className="input min-h-20"
                      name="description"
                      placeholder="Lesson description. Links will be clickable."
                    />

                    <CloudinaryUploadField
                      name="videoUrl"
                      label="Lesson video"
                      resourceType="video"
                      buttonText="Upload video"
                      placeholder="Paste lesson video URL or upload video"
                    />

                    <CloudinaryUploadField
                      name="captionsUrl"
                      label="Captions file"
                      resourceType="raw"
                      buttonText="Upload captions"
                      placeholder="Paste .vtt captions URL or upload .vtt file"
                    />

                    <input className="input" name="duration" defaultValue="10 min" />
                    <input className="input" name="order" type="number" min="1" defaultValue={courseLessons.length + 1} />

                    <label className="flex items-center gap-3 text-sm font-bold">
                      <input name="isPreview" type="checkbox" defaultChecked={courseLessons.length === 0} />
                      Preview lesson
                    </label>

                    <button className="primary-button w-fit" type="submit">
                      Add lesson
                    </button>
                  </form>

                  <div className="mt-5 grid gap-3">
                    {courseLessons.length ? (
                      courseLessons.map((lesson) => (
                        <details key={lesson.id} className="rounded-2xl bg-black/25 p-4">
                          <summary className="cursor-pointer font-bold">
                            {lesson.order}. {lesson.title}
                          </summary>

                          <form
                            action={`/api/admin/courses/${course.id}/lessons/${lesson.id}/update`}
                            method="post"
                            className="mt-4 grid gap-4"
                          >
                            <input className="input" name="title" defaultValue={lesson.title} required />

                            <textarea
                              className="input min-h-20"
                              name="description"
                              defaultValue={lesson.description}
                            />

                            <CloudinaryUploadField
                              name="videoUrl"
                              label="Lesson video"
                              defaultValue={lesson.videoUrl}
                              resourceType="video"
                              buttonText="Upload video"
                              placeholder="Paste lesson video URL or upload video"
                            />

                            <CloudinaryUploadField
                              name="captionsUrl"
                              label="Captions file"
                              defaultValue={lesson.captionsUrl}
                              resourceType="raw"
                              buttonText="Upload captions"
                              placeholder="Paste .vtt captions URL or upload .vtt file"
                            />

                            <input className="input" name="duration" defaultValue={lesson.duration} />
                            <input className="input" name="order" type="number" min="1" defaultValue={lesson.order} />

                            <label className="flex items-center gap-3 text-sm font-bold">
                              <input name="isPreview" type="checkbox" defaultChecked={lesson.isPreview} />
                              Preview lesson
                            </label>

                            <button className="primary-button w-fit" type="submit">
                              Save lesson
                            </button>
                          </form>

                          <form
                            action={`/api/admin/courses/${course.id}/lessons/${lesson.id}/delete`}
                            method="post"
                            className="mt-3"
                          >
                            <button
                              className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100"
                              type="submit"
                            >
                              Delete lesson
                            </button>
                          </form>
                        </details>
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
              </details>
            );
          })
        ) : (
          <div className="glass-panel rounded-[2rem] p-6 text-white/55">
            No courses yet. Add your first course.
          </div>
        )}
      </div>
    </section>
  );
}
