import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { HomeHeroSlider } from "@/components/home-hero-slider";

type HomeSlide = {
  id: string;
  type: "course" | "material" | "post";
  title: string;
  description: string;
  imageUrl: string | null;
  href: string;
  primaryLabel: string;
  tag: string;
  meta: string;
};

type CourseRow = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  level: string;
  duration: string;
  lessons: number;
  isPremium: boolean;
};

type MaterialRow = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  fileType: string;
  isPremium: boolean;
};

type PostRow = {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  mediaType: string;
  tag: string;
  hashtag: string;
};

async function getCourseSlides(): Promise<HomeSlide[]> {
  try {
    const courses = await prisma.$queryRaw<CourseRow[]>`
      SELECT
        "id",
        "title",
        "description",
        "thumbnailUrl",
        "level",
        "duration",
        "lessons",
        "isPremium"
      FROM "Course"
      ORDER BY "createdAt" DESC
      LIMIT 6
    `;

    return courses.map((course) => ({
      id: `course-${course.id}`,
      type: "course",
      title: course.title,
      description: course.description,
      imageUrl: course.thumbnailUrl,
      href: `/courses/${course.id}`,
      primaryLabel: "Open Course",
      tag: course.isPremium ? "Premium Course" : "Course",
      meta: `${course.level} · ${course.lessons} lessons · ${course.duration}`
    }));
  } catch {
    return [];
  }
}

async function getMaterialSlides(): Promise<HomeSlide[]> {
  try {
    const materials = await prisma.$queryRaw<MaterialRow[]>`
      SELECT
        "id",
        "title",
        "description",
        "thumbnailUrl",
        "previewUrl",
        "fileType",
        "isPremium"
      FROM "Material"
      ORDER BY "createdAt" DESC
      LIMIT 6
    `;

    return materials.map((material) => ({
      id: `material-${material.id}`,
      type: "material",
      title: material.title,
      description: material.description,
      imageUrl: material.thumbnailUrl || material.previewUrl,
      href: "/materials",
      primaryLabel: material.isPremium ? "View Material" : "Download",
      tag: material.isPremium ? "Premium Material" : "Material",
      meta: material.fileType
    }));
  } catch {
    return [];
  }
}

async function getPostSlides(): Promise<HomeSlide[]> {
  try {
    const posts = await prisma.$queryRaw<PostRow[]>`
      SELECT
        "id",
        "title",
        "description",
        "fileUrl",
        "mediaType",
        "tag",
        "hashtag"
      FROM "Post"
      ORDER BY "createdAt" DESC
      LIMIT 6
    `;

    return posts
      .filter((post) => post.mediaType === "image")
      .map((post) => ({
        id: `post-${post.id}`,
        type: "post",
        title: post.title,
        description: post.description,
        imageUrl: post.fileUrl,
        href: `/post/${post.id}`,
        primaryLabel: "View Post",
        tag: post.tag,
        meta: `#${post.hashtag}`
      }));
  } catch {
    return [];
  }
}

function shuffleSlides(slides: HomeSlide[]) {
  return slides.sort(() => Math.random() - 0.5);
}

export default async function HomePage() {
  const user = await currentUser();

  const [courseSlides, materialSlides, postSlides] = await Promise.all([
    getCourseSlides(),
    getMaterialSlides(),
    getPostSlides()
  ]);

  const slides = shuffleSlides([
    ...courseSlides,
    ...materialSlides,
    ...postSlides
  ]).slice(0, 10);

  return (
    <div className="min-h-screen bg-spotlight">
      <HomeHeroSlider slides={slides} isLoggedIn={Boolean(user)} />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/courses" className="card-hover glass-panel rounded-[2rem] p-6">
            <div className="pill mb-4 w-fit">Courses</div>

            <h2 className="text-3xl font-black">
              Learn editing
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Premium and free courses for artwork, video editing, motion graphics, and UI/UX.
            </p>
          </Link>

          <Link href="/explore" className="card-hover glass-panel rounded-[2rem] p-6">
            <div className="pill mb-4 w-fit">Explore</div>

            <h2 className="text-3xl font-black">
              Discover creators
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/55">
              See posts, edits, artwork, thumbnails, GFX previews, and creator uploads.
            </p>
          </Link>

          <Link href="/materials" className="card-hover glass-panel rounded-[2rem] p-6">
            <div className="pill mb-4 w-fit">Materials</div>

            <h2 className="text-3xl font-black">
              Download assets
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Get presets, overlays, PSDs, GFX packs, UI kits, and downloadable resources.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
