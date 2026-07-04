const queues = [
  { title: "Pending artwork reviews", count: 18 },
  { title: "Reported comments", count: 5 },
  { title: "News items waiting curation", count: 9 },
  { title: "Premium material submissions", count: 12 }
];

export default function AdminPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="pill mb-4 w-fit">Admin dashboard</div>
        <h1 className="text-4xl font-black">Moderation and platform analytics</h1>
        <p className="mt-3 text-white/55">Protect the community, curate news, approve premium materials, and watch growth metrics.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {queues.map((queue) => (
          <article key={queue.title} className="glass-panel rounded-[2rem] p-5">
            <div className="text-4xl font-black">{queue.count}</div>
            <div className="mt-2 text-sm text-white/55">{queue.title}</div>
          </article>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black">Creator growth</h2>
          <div className="mt-6 grid gap-3">
            {[72, 88, 64, 93, 80].map((height, index) => <div key={index} className="h-8 rounded-full bg-white/8"><div style={{ width: `${height}%` }} className="h-full rounded-full bg-brand" /></div>)}
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black">Manual news post</h2>
          <input className="input mt-5" placeholder="News title" />
          <textarea className="input mt-4 min-h-28" placeholder="Summary for homepage ticker" />
          <button className="primary-button mt-5">Publish news</button>
        </div>
      </div>
    </section>
  );
}
