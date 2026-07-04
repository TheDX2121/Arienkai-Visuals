export function Rail({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-white/48">{subtitle}</p> : null}
        </div>
        <button className="hidden rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-white/62 transition hover:bg-white/10 sm:block">View all</button>
      </div>
      <div className="horizontal-rail">{children}</div>
    </section>
  );
}
