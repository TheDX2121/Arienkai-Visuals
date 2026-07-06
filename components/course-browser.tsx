"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Course = {
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
  categoryName: string | null;
  categorySlug: string | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type CourseBrowserProps = {
  courses: Course[];
  categories: Category[];
};

export function CourseBrowser({ courses, categories }: CourseBrowserProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCourses = useMemo(() => {
    const search = query.toLowerCase().trim();

    return courses.filter((course) => {
      const matchesCategory =
        activeCategory === "all" || course.categorySlug === activeCategory;

      const matchesSearch =
        !search ||
        course.title.toLowerCase().includes(search) ||
        course.description.toLowerCase().includes(search) ||
        course.level.toLowerCase().includes(search) ||
        String(course.categoryName || "").toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [courses, query, activeCategory]);

  return (
    <div>
      <div className="glass-panel mb-6 rounded-[2rem] p-4">
        <input
          className="input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search courses, editing, artwork, UI/UX, motion graphics..."
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={activeCategory === "all" ? "primary-button" : "secondary-button"}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.slug)}
              className={activeCategory === category.slug ? "primary-button" : "secondary-button"}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {filteredCourses.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="card-hover glass-panel block min-h-[315px] overflow-hidden rounded-[1.75rem]"
            >
              <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${course.gradient} p-4`}>
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}

                <div className="absolute inset-0 bg-black/25" />

                <div className="relative z-10 flex flex-wrap gap-2">
                  <span className="pill bg-black/30">{course.level}</span>

                  {course.categoryName ? (
                    <span className="pill bg-black/30">{course.categoryName}</span>
                  ) : null}

                  {course.isPremium ? (
                    <span className="pill bg-gold/25 text-yellow-100">
                      Premium {course.priceInr ? `₹${course.priceInr}` : ""}
                    </span>
                  ) : (
                    <span className="pill bg-black/30">Free</span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="text-lg font-black">
                  {course.title}
                </div>

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
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-[2rem] p-8 text-white/55">
          No courses found for this search or category.
        </div>
      )}
    </div>
  );
}
