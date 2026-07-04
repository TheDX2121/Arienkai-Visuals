import { notFound } from "next/navigation";
import { ArtworkCard } from "@/components/artwork-card";
import { creators, trendingPosts } from "@/lib/demo-data";

type ProfileProps = { params: Promise<{ username: string }> };

export default async function ProfilePage({ params }: ProfileProps) {
  const { username } = await params;
  const creator = creators.find((item) => item.username === username);
  if (!creator) notFound();
  const posts = trendingPosts.filter((post) => post.author.username === creator.username);
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-[2rem] p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex gap-5">
            <div className={`grid h-24 w-24 place-items-center rounded-[2rem] bg-gradient-to-br ${creator.gradient} text-4xl font-black`}>{creator.displayName.slice(0, 1)}</div>
            <div>
              <h1 className="text-4xl font-black">{creator.displayName}</h1>
              <div className="mt-1 text-white/50">@{creator.username}</div>
              <p className="mt-4 max-w-2xl text-white/60">{creator.bio}</p>
            </div>
          </div>
          <button className="primary-button">Follow</button>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-white/5 p-4"><b>{creator.posts}</b><div className="text-xs text-white/45">Posts</div></div>
          <div className="rounded-2xl bg-white/5 p-4"><b>{creator.followers.toLocaleString()}</b><div className="text-xs text-white/45">Followers</div></div>
          <div className="rounded-2xl bg-white/5 p-4"><b>{creator.following.toLocaleString()}</b><div className="text-xs text-white/45">Following</div></div>
        </div>
      </div>
      <h2 className="mb-4 mt-10 text-2xl font-black">Posts</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {posts.length ? posts.map((post) => <ArtworkCard key={post.id} post={post} />) : <p className="text-white/50">No posts in demo data yet.</p>}
      </div>
    </section>
  );
}
