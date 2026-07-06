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

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { HomeHeroSlider } from "@/components/home-hero-slider";

type HomeSlide = {
  id: string;
  type: string;
  title: string;
  description: string;
  imageUrl: string | null;
  href: string;
  primaryLabel: string;
  tag: string;
  meta: string;
};

type DbHomeSlide = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  href: string;
  buttonLabel: string;
  tag: string;
  meta: string;
  type: string;
};

type DbHomeCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  label: string;
};

type DbPost = {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  mediaType: string;
  tag: string;
  hashtag: string;
  likeCount: bigint | number;
};

type DbCourse = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  level: string;
  duration: string;
  lessons: number;
  isPremium: boolean;
  priceInr: number;
};

type DbMaterial = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  fileType: string;
  isPremium: boolean;
  priceInr: number;
};

type SiteSetting = {
  key: string;
  value: string;
};

async function getHomeSettings() {
  const fallback = {
    trendingTitle: "Trending Now",
    coursesTitle: "Courses for you",
    materialsTitle: "Creator materials",
    cardsTitle: "Start creating with Arienkai"
  };

  try {
    const rows = await prisma.$queryRaw<SiteSetting[]>`
      SELECT
        "key",
        "value"
      FROM "SiteSetting"
      WHERE "key" IN (
        'home_trending_title',
        'home_courses_title',
        'home_materials_title',
        'home_cards_title'
      )
    `;

    const map = new Map(rows.map((item) => [item.key, item.value]));

    return {
      trendingTitle: map.get("home_trending_title") || fallback.trendingTitle,
      coursesTitle: map.get("home_courses_title") || fallback.coursesTitle,
      materialsTitle: map.get("home_materials_title") || fallback.materialsTitle,
      cardsTitle: map.get("home_cards_title") || fallback.cardsTitle
    };
  } catch {
    return fallback;
  }
}

async function getAdminSlides(): Promise<HomeSlide[]> {
  try {
    const slides = await prisma.$queryRaw<DbHomeSlide[]>`
      SELECT
        "id",
        "title",
        "description",
        "imageUrl",
        "href",
        "buttonLabel",
        "tag",
        "meta",
        "type"
      FROM "HomeSlide"
      WHERE "isActive" = true
      ORDER BY "sortOrder" ASC, "createdAt" DESC
      LIMIT 12
    `;

    return slides.map((slide) => ({
      id: slide.id,
      type: slide.type,
      title: slide.title,
      description: slide.description,
      imageUrl: slide.imageUrl,
      href: slide.href,
      primaryLabel: slide.buttonLabel,
      tag: slide.tag,
      meta: slide.meta
    }));
  } catch {
    return [];
  }
}

async function getFallbackSlides(): Promise<HomeSlide[]> {
  try {
    const courses = await prisma.$queryRaw<DbCourse[]>`
      SELECT
        "id",
        "title",
        "description",
        "thumbnailUrl",
        "level",
        "duration",
        "lessons",
        "isPremium",
        "priceInr"
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

async function getTrendingPosts() {
  try {
    return await prisma.$queryRaw<DbPost[]>`
      SELECT
        p."id",
        p."title",
        p."description",
        p."fileUrl",
        p."mediaType",
        p."tag",
        p."hashtag",
        COUNT(l."id") AS "likeCount"
      FROM "Post" p
      LEFT JOIN "PostLike" l ON l."postId" = p."id"
      GROUP BY p."id", p."title", p."description", p."fileUrl", p."mediaType", p."tag", p."hashtag", p."createdAt"
      ORDER BY COUNT(l."id") DESC, p."createdAt" DESC
      LIMIT 8
    `;
  } catch {
    return [];
  }
}

async function getRandomCourses() {
  try {
    return await prisma.$queryRaw<DbCourse[]>`
      SELECT
        "id",
        "title",
        "description",
        "thumbnailUrl",
        "level",
        "duration",
        "lessons",
        "isPremium",
        "priceInr"
      FROM "Course"
      ORDER BY RANDOM()
      LIMIT 6
    `;
  } catch {
    return [];
  }
}

async function getRandomMaterials() {
  try {
    return await prisma.$queryRaw<DbMaterial[]>`
      SELECT
        "id",
        "title",
        "description",
        "thumbnailUrl",
        "previewUrl",
        "fileType",
        "isPremium",
        "priceInr"
      FROM "Material"
      ORDER BY RANDOM()
      LIMIT 6
    `;
  } catch {
    return [];
  }
}

async function getHomeCards() {
  try {
    return await prisma.$queryRaw<DbHomeCard[]>`
      SELECT
        "id",
        "title",
        "description",
        "href",
        "label"
      FROM "HomeCard"
      WHERE "isActive" = true
      ORDER BY "sortOrder" ASC, "createdAt" DESC
      LIMIT 6
    `;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const user = await currentUser();

  const [
    settings,
    adminSlides,
    fallbackSlides,
    trendingPosts,
    randomCourses,
    randomMaterials,
    homeCards
  ] = await Promise.all([
    getHomeSettings(),
    getAdminSlides(),
    getFallbackSlides(),
    getTrendingPosts(),
    getRandomCourses(),
    getRandomMaterials(),
    getHomeCards()
  ]);

  const slides = adminSlides.length ? adminSlides : fallbackSlides;

  return (
    <div className="min-h-screen bg-spotlight">
      <HomeHeroSlider slides={slides} isLoggedIn={Boolean(user)} />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-black">
            {settings.trendingTitle}
          </h2>

          <Link href="/explore" className="text-sm font-bold text-white/55 hover:text-white">
            View all →
          </Link>
        </div>

        {trendingPosts.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trendingPosts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="card-hover glass-panel overflow-hidden rounded-[1.75rem]"
              >
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-red-700 via-black to-purple-900">
                  {post.mediaType === "video" ? (
                    <video
                      src={post.fileUrl}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={post.fileUrl}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/25" />

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span className="pill bg-black/40">{post.tag}</span>
                    <span className="pill bg-black/40">♥ {String(post.likeCount)}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-black">
                    {post.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/55">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-[2rem] p-6 text-white/55">
            No posts yet.
          </div>
        )}
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-black">
              {settings.coursesTitle}
            </h2>

            <Link href="/courses" className="text-sm font-bold text-white/55 hover:text-white">
              View courses →
            </Link>
          </div>

          <div className="grid gap-4">
            {randomCourses.length ? (
              randomCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="card-hover glass-panel grid overflow-hidden rounded-[1.75rem] sm:grid-cols-[170px_1fr]"
                >
                  <div className="relative min-h-36 bg-gradient-to-br from-red-700 via-black to-purple-900">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="pill">{course.level}</span>
                      {course.isPremium ? (
                        <span className="pill bg-gold/20 text-yellow-100">
                          Premium
                        </span>
                      ) : (
                        <span className="pill">Free</span>
                      )}
                    </div>

                    <h3 className="mt-3 text-xl font-black">
                      {course.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/55">
                      {course.description}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="glass-panel rounded-[2rem] p-6 text-white/55">
                No courses yet.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-black">
              {settings.materialsTitle}
            </h2>

            <Link href="/materials" className="text-sm font-bold text-white/55 hover:text-white">
              View materials →
            </Link>
          </div>

          <div className="grid gap-4">
            {randomMaterials.length ? (
              randomMaterials.map((material) => (
                <Link
                  key={material.id}
                  href="/materials"
                  className="card-hover glass-panel grid overflow-hidden rounded-[1.75rem] sm:grid-cols-[170px_1fr]"
                >
                  <div className="relative min-h-36 bg-gradient-to-br from-blue-800 via-black to-purple-900">
                    {material.thumbnailUrl || material.previewUrl ? (
                      <img
                        src={material.thumbnailUrl || material.previewUrl || ""}
                        alt={material.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="pill">{material.fileType}</span>
                      {material.isPremium ? (
                        <span className="pill bg-gold/20 text-yellow-100">
                          Premium
                        </span>
                      ) : (
                        <span className="pill">Free</span>
                      )}
                    </div>

                    <h3 className="mt-3 text-xl font-black">
                      {material.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/55">
                      {material.description}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="glass-panel rounded-[2rem] p-6 text-white/55">
                No materials yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-black">
          {settings.cardsTitle}
        </h2>

        {homeCards.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {homeCards.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="card-hover glass-panel rounded-[2rem] p-6"
              >
                <div className="pill mb-4 w-fit">
                  {card.label}
                </div>

                <h3 className="text-3xl font-black">
                  {card.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/55">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
      }
phics, and UI/UX.
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
