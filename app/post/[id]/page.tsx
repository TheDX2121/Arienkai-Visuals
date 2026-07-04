import { notFound } from "next/navigation";
import Link from "next/link";
import { RatingPill } from "@/components/rating-pill";
import { trendingPosts } from "@/lib/demo-data";

type PostProps = { params: Promise<{ id: string }> };

export default async function PostDetailPage({ params }: PostProps) {
  const { id } = await params;
  const post = trendingPosts.find((item) => item.id === id);
  if (!post) notFound();
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_.8fr] lg:px-8">
      <div className={`min-h-[560px] rounded-[2rem] bg-gradient-to-br ${post.gradient} p-6 shadow-card`}>
        <div className="flex gap-2">
          <span className="pill bg-black/30">{post.mediaType}</span>
          {post.premium ? <span className="pill bg-gold/25 text-yellow-100">Premium</span> : <span className="pill bg-black/30">Free</span>}
        </div>
      </div>
      <aside className="glass-panel h-fit rounded-[2rem] p-6">
        <RatingPill rating={post.rating} />
        <h1 className="mt-5 text-4xl font-black">{post.title}</h1>
        <Link href={`/profile/${post.author.username}`} className="mt-3 block text-white/55 hover:text-white">by @{post.author.username}</Link>
        <p className="mt-5 leading-7 text-white/65">{post.caption}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {post.hashtags.map((tag) => <span className="pill" key={tag}>#{tag}</span>)}
          {post.animeTags.map((tag) => <span className="pill bg-brand/10 text-red-100" key={tag}>{tag}</span>)}
        </div>
        <div className="mt-7 grid grid-cols-3 gap-3 text-center text-sm">
          <button className="rounded-2xl bg-white/8 p-4 transition hover:bg-white/12">♥<br />{post.likes.toLocaleString()}</button>
          <button className="rounded-2xl bg-white/8 p-4 transition hover:bg-white/12">💬<br />{post.comments}</button>
          <button className="rounded-2xl bg-white/8 p-4 transition hover:bg-white/12">🔖<br />{post.saves}</button>
        </div>
        <div className="mt-7 rounded-2xl bg-black/25 p-4">
          <div className="font-black">Preview rating</div>
          <p className="mt-2 text-sm text-white/50">Let users score composition, color, title readability, motion, and click appeal.</p>
          <input type="range" min="1" max="10" defaultValue="9" className="mt-4 w-full" />
        </div>
      </aside>
    </section>
  );
}
