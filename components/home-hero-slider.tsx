"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type HomeSlide = {
  id: string;
  type?: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  href: string;
  primaryLabel?: string;
  tag?: string;
  meta?: string;
};

type HomeHeroSliderProps = {
  slides: HomeSlide[];
  isLoggedIn: boolean;
};

export function HomeHeroSlider({
  slides,
  isLoggedIn,
}: HomeHeroSliderProps) {
  const safeSlides = useMemo(() => {
    if (slides && slides.length > 0) {
      return slides;
    }

    return [
      {
        id: "default",
        type: "featured",
        title: "Arienkai Visuals",
        description:
          "A creator-first platform for editing tutorials, anime artwork, premium courses, GFX assets, and creator discovery.",
        imageUrl: null,
        href: "/explore",
        primaryLabel: "Explore",
        tag: "Featured",
        meta: "Courses · Materials · Explore",
      },
    ];
  }, [slides]);

  const [activeIndex, setActiveIndex] = useState(0);

  const currentSlide = safeSlides[activeIndex];


  useEffect(() => {
    if (safeSlides.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((previous) =>
        previous === safeSlides.length - 1
          ? 0
          : previous + 1
      );
    }, 6000);


    return () => clearInterval(timer);

  }, [safeSlides.length]);


  function nextSlide() {
    setActiveIndex((previous) =>
      previous === safeSlides.length - 1
        ? 0
        : previous + 1
    );
  }


  function previousSlide() {
    setActiveIndex((previous) =>
      previous === 0
        ? safeSlides.length - 1
        : previous - 1
    );
  }


  return (
    <section className="relative min-h-[620px] overflow-hidden">


      {currentSlide.imageUrl ? (

        <img
          src={currentSlide.imageUrl}
          alt={currentSlide.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

      ) : (

        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-purple-950" />

      )}



      <div className="absolute inset-0 bg-black/60" />


      <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">


        <div className="max-w-3xl">


          <div className="mb-5 flex flex-wrap gap-3">


            {currentSlide.tag ? (
              <span className="pill">
                {currentSlide.tag}
              </span>
            ) : null}


            {currentSlide.type ? (
              <span className="pill">
                {currentSlide.type}
              </span>
            ) : null}


          </div>



          <h1 className="text-5xl font-black leading-tight text-white sm:text-6xl">

            {currentSlide.title}

          </h1>



          {currentSlide.meta ? (

            <p className="mt-4 text-sm font-bold text-yellow-200">
              {currentSlide.meta}
            </p>

          ) : null}




          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">

            {currentSlide.description}

          </p>




          <div className="mt-8 flex flex-wrap gap-4">


            <Link
              href={currentSlide.href}
              className="primary-button"
            >

              {currentSlide.primaryLabel || "Open"}

            </Link>



            <Link
              href={currentSlide.href}
              className="secondary-button"
            >

              More Info

            </Link>



            {!isLoggedIn ? (

              <Link
                href="/signup"
                className="secondary-button"
              >

                Create account

              </Link>

            ) : null}



          </div>



          <div className="mt-10 flex gap-2">


            {safeSlides.map((slide, index) => (

              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={
                  index === activeIndex
                    ? "h-2 w-10 rounded-full bg-white"
                    : "h-2 w-2 rounded-full bg-white/40"
                }
              />

            ))}


          </div>


        </div>


      </div>





      <div className="absolute bottom-10 right-5 z-20 flex gap-3">


        <button
          type="button"
          onClick={previousSlide}
          className="grid h-12 w-12 place-items-center rounded-full bg-white/20 text-3xl text-white backdrop-blur"
        >
          ‹
        </button>


        <button
          type="button"
          onClick={nextSlide}
          className="grid h-12 w-12 place-items-center rounded-full bg-white/20 text-3xl text-white backdrop-blur"
        >
          ›
        </button>


      </div>



    </section>
  );
}