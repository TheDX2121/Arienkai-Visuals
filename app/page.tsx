import Link from "next/link";

const rails = [
  {
    title: "Explore",
    href: "/explore",
    description: "Discover trending edits, anime artwork, thumbnails, and creator posts."
  },
  {
    title: "Courses",
    href: "/courses",
    description: "Learn editing, thumbnail design, GFX, motion, and creator workflows."
  },
  {
    title: "Materials",
    href: "/materials",
    description: "Download overlays, packs, thumbnails, PSD assets, LUTs, and presets."
  },
  {
    title: "Premium",
    href: "/premium",
    description: "Unlock full courses, premium packs, advanced tutorials, and creator tools."
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-red-950 via-black to-zinc-950 p-8 shadow-card md:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-300">
          Arienkai Visuals
        </p>

        <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
          A Netflix-style creator platform for editors and designers.
        </h1>

        <p className="mt-5 max-w-2xl text-white/65">
          Watch tutorials, explore courses, download GFX materials, rate previews,
          follow creators, and build your visual editing skills.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/explore" className="primary-button">
            Start Exploring
          </Link>
          <Link href="/signup" className="rounded-full border border-white/15 px-5 py-3 font-bold text-white/80">
            Create Account
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rails.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card-hover glass-panel rounded-[1.5rem] p-5"
          >
            <h2 className="text-xl font-black">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/55">{item.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
