import Link from "next/link";

type ProfileProps = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: ProfileProps) {
  const { username } = await params;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="glass-panel rounded-[2rem] p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="grid h-24 w-24 place-items-center rounded-[2rem] bg-gradient-to-br from-red-500 to-purple-700 text-4xl font-black">
            {username.slice(0, 1).toUpperCase()}
          </div>

          <div>
            <h1 className="text-4xl font-black">@{username}</h1>
            <p className="mt-3 max-w-2xl text-white/60">
              Creator profile page is working. Database-connected profile data can be added after the basic routes are stable.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-white/5 p-4">
            <b>0</b>
            <div className="text-xs text-white/45">Posts</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-4">
            <b>0</b>
            <div className="text-xs text-white/45">Followers</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-4">
            <b>0</b>
            <div className="text-xs text-white/45">Following</div>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/explore" className="primary-button">
            Explore Posts
          </Link>
        </div>
      </section>
    </main>
  );
}
