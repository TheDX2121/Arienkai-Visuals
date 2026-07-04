export default function UploadPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
      <div>
        <div className="pill mb-4 w-fit">Creator upload</div>
        <h1 className="text-4xl font-black">Publish anime artwork, edits, GIF previews, or design breakdowns.</h1>
        <p className="mt-4 text-white/55">This page is Cloudinary-ready. Use `/api/upload/signature` for signed uploads, then save the returned media URL to a post.</p>
      </div>
      <form action="/api/posts" method="post" className="glass-panel rounded-[2rem] p-6">
        <label className="mb-2 block text-sm font-bold">Title</label>
        <input className="input" name="title" placeholder="Akuma City Color Grade" />
        <label className="mb-2 mt-5 block text-sm font-bold">Caption</label>
        <textarea className="input min-h-28" name="caption" placeholder="Explain your process, plugins, colors, and inspiration..." />
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold">Hashtags</label>
            <input className="input" name="hashtags" placeholder="aftereffects, animeedit, gfx" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">Anime tags</label>
            <input className="input" name="animeTags" placeholder="Solo Leveling, Naruto" />
          </div>
        </div>
        <div className="mt-5 rounded-[1.5rem] border border-dashed border-white/20 bg-black/30 p-8 text-center">
          <div className="text-4xl">☁</div>
          <div className="mt-3 font-black">Drop media here</div>
          <p className="mt-2 text-sm text-white/45">Wire this to Cloudinary Upload Widget or signed server upload.</p>
        </div>
        <button className="primary-button mt-6 w-full" type="submit">Publish post</button>
      </form>
    </section>
  );
}
