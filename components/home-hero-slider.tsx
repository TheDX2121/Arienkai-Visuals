"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

type HomeHeroSliderProps = {
  slides: HomeSlide[];
  isLoggedIn: boolean;
};

export function HomeHeroSlider({ slides, isLoggedIn }: HomeHeroSliderProps) {
  const safeSlides = useMemo(() => {
    if (slides.length) return slides;

    return [
      {
        id: "fallback",
        type: "course" as const,
        title: "Arienkai Visuals",
        description:
          "A creator-first platform for courses, anime artwork, GFX materials, editing tutorials, and designer discovery.",
        imageUrl: null,
        href: "/explore",
        primaryLabel: "Explore",
        tag: "Featured",
        meta: "Courses · Materials · Explore"
      }
    ];
  }, [slides]);

  const [index, setIndex] = useState(0);

  const activeSlide = safeSlides[index];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % safeSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [safeSlides.length]);

  function previousSlide() {
    setIndex((current) => {
      if (current === 0) return safeSlides.length - 1;
      return current - 1;
    });
  }

  function nextSlide() {
    setIndex((current) => (current + 1) % safeSlides.length);
  }

  return (
    <section className="relative min-h-[650px] overflow-hidden bg-black">
      {activeSlide.imageUrl ? (
        <img
          src={activeSlide.imageUrl}
          alt={activeSlide.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-purple-950" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/35" />

      <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-500 px-4 py-1 text-sm font-black uppercase text-white shadow-lg">
              {activeSlide.tag}
            </span>

            <span className="pill bg-black/35">
              {activeSlide.type}
            </span>
          </div>

          <h1 className="text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            {activeSlide.title}
          </h1>

          <p className="mt-4 text-sm font-bold text-yellow-200/80">
            {activeSlide.meta}
          </p>

          <p className="mt-4 max-w-xl text-lg leading-8 text-white/78">
            {activeSlide.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={activeSlide.href} className="primary-button text-base">
              ▶ {activeSlide.primaryLabel}
            </Link>

            <Link href={activeSlide.href} className="secondary-button text-base">
              More Info
            </Link>

            {!isLoggedIn ? (
              <Link href="/signup" className="secondary-button text-base">
                Create account
              </Link>
            ) : null}
          </div>

          <div className="mt-12 flex items-center gap-2">
            {safeSlides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(slideIndex)}
                className={
                  slideIndex === index
                    ? "h-2 w-8 rounded-full bg-white"
                    : "h-2 w-2 rounded-full bg-white/35"
                }
                aria-label={`Open slide ${slideIndex + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 right-6 z-20 hidden gap-3 sm:flex">
        <button
          type="button"
          onClick={previousSlide}
          className="grid h-14 w-14 place-items-center rounded-xl bg-white/15 text-3xl font-black text-white backdrop-blur transition hover:bg-white/25"
          aria-label="Previous slide"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="grid h-14 w-14 place-items-center rounded-xl bg-white/15 text-3xl font-black text-white backdrop-blur transition hover:bg-white/25"
          aria-label="Next slide"
        >
          ›
        </button>
      </div>

      <div className="absolute bottom-7 left-4 z-20 sm:left-6 lg:left-[calc((100vw-80rem)/2+2rem)]">
        <Link href={activeSlide.href} className="text-xl font-black text-white transition hover:text-sky-300">
          Trending Now ›
        </Link>
      </div>
    </section>
  );
}
