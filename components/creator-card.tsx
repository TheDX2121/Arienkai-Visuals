import Link from "next/link";
import type { Creator } from "@/lib/types";

export function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <Link href={`/profile/${creator.username}`} className="card-hover glass-panel block min-h-[250px] rounded-[1.75rem] p-5">
      <div className={`grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br ${creator.gradient} text-3xl font-black`}>
        {creator.displayName.slice(0, 1)}
      </div>
      <div className="mt-5 text-xl font-black">{creator.displayName}</div>
      <div className="text-sm text-white/55">@{creator.username}</div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/58">{creator.bio}</p>
      <div className="mt-5 flex gap-2 text-xs text-white/45">
        <span>{creator.followers.toLocaleString()} followers</span>
        <span>•</span>
        <span>{creator.posts} posts</span>
      </div>
    </Link>
  );
}
