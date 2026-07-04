import Link from "next/link";
import { newsItems } from "@/lib/demo-data";

export function NewsTicker() {
  return (
    <section className="glass-panel relative z-10 overflow-hidden rounded-[2rem] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.24em] text-brand">Anime news desk</div>
          <h2 className="mt-1 text-2xl font-black">Latest creator-relevant anime updates</h2>
        </div>
        <Link href="/api/news" className="secondary-button hidden sm:inline-flex">RSS API</Link>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {newsItems.map((item) => (
          <a key={item.id} href={item.url} className="rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:bg-white/10">
            <div className="text-xs text-white/40">{item.source} · {item.publishedAt}</div>
            <div className="mt-2 line-clamp-2 font-bold">{item.title}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
