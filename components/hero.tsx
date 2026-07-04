import Link from "next/link";
import { StatBadge } from "@/components/stat-badge";

export function Hero() {
  return (
    <section className="hero-noise relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#07070a_0%,rgba(7,7,10,.92)_35%,rgba(7,7,10,.45)_100%)]" />
      <div className="absolute right-[-8rem] top-10 h-[34rem] w-[34rem] rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute right-20 top-32 h-72 w-72 rounded-full bg-electric/20 blur-3xl" />
      <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-10 px-4 pb-24 pt-20 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-black uppercase tracking-[0.26em] text-red-200">
            Premium creator studio · affordable access
          </div>
          <h1 className="text-balance text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Stream tutorials. Drop artwork. Build your visual empire.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
            Arienkai Visuals blends Netflix-style discovery with creator tools for editors, anime artists, thumbnail designers, and GFX makers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="primary-button">Start creating</Link>
            <Link href="/explore" className="secondary-button">Explore visuals</Link>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBadge value="4K+" label="Assets" />
            <StatBadge value="120+" label="Courses" />
            <StatBadge value="24/7" label="News" />
            <StatBadge value="₹199" label="Starter premium" />
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="grid rotate-2 grid-cols-2 gap-4">
            {[
              ["After Effects Mastery", "from-red-500 to-purple-700"],
              ["Anime GFX Pack", "from-fuchsia-500 to-blue-700"],
              ["Thumbnail Breakdown", "from-amber-400 to-red-700"],
              ["Preview Rating Lab", "from-cyan-400 to-violet-700"]
            ].map(([title, gradient], index) => (
              <div key={title} className={`card-hover glass-panel h-60 rounded-[2rem] bg-gradient-to-br ${gradient} p-5 ${index % 2 ? "mt-14" : ""}`}>
                <div className="flex h-full flex-col justify-between">
                  <span className="pill w-fit bg-black/35">Episode {index + 1}</span>
                  <div>
                    <div className="text-2xl font-black">{title}</div>
                    <div className="mt-2 text-sm text-white/78">Tap to watch · save · rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
