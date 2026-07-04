import Link from "next/link";

type PostProps = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: PostProps) {
  const { id } = await params;

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_.8fr] lg:px-8">
      <section className="min-h-[520px] rounded-[2rem] bg-gradient-to-br from-red-800 via-black to-blue-950 p-8 shadow-card">
        <span className="pill bg-black/30">Preview</span>
      </section>

      <aside className="glass-panel h-fit rounded-[2rem] p-6">
        <p className="text-sm text-white/45">Post ID</p>
        <h1 className="mt-2 break-all text-3xl font-black">{id}</h1>

        <p className="mt-5 leading-7 text-white/60">
          Post detail page is working. Database-connected post data can be added after the basic routes are stable.
        </p>

        <div className="mt-7">
          <Link href="/explore" className="primary-button">
            Back to Explore
          </Link>
        </div>
      </aside>
    </main>
  );
}
