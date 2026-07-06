className={
                  slideIndex === index
                    ? "h-2 w-8 rounded-full bg-white"
                    : "h-2 w-2 rounded-full bg-white/35"
                }
                aria-label={Open slide ${slideIndex + 1}}
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
