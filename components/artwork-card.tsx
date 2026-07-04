import Link from "next/link";
import type { ArtworkPost } from "@/lib/types";
import { RatingPill } from "@/components/rating-pill";

export function ArtworkCard({ post }: { post: ArtworkPost }) {
  return (
    <Link href={`/post/${post.id}`} className="card-hover glass-panel group block min-h-[330px] overflow-hidden rounded-[1.75rem]">
      <div className={`relative h-48 bg-gradient-to-br ${post.gradient}`}>
        <div className="absolute left-4 top-4 flex gap-2">
          {post.premium ? <span className="pill bg-gold/25 text-yellow-100">Premium</span> : <span className="pill bg-black/30">Free</span>}
          <span className="pill bg-black/30">{post.mediaType}</span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <RatingPill rating={post.rating} />
        </div>
      </div>
      <div className="p-4">
        <div className="line-clamp-1 text-lg font-black">{post.title}</div>
        <div className="mt-1 text-sm text-white/55">by @{post.author.username}</div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/58">{post.caption}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-white/45">
          <span>♥ {post.likes.toLocaleString()}</span>
          <span>💬 {post.comments}</span>
          <span>🔖 {post.saves}</span>
        </div>
      </div>
    </Link>
  );
}
