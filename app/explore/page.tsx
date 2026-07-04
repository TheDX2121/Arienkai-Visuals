import { ArtworkCard } from "@/components/artwork-card";
import { CreatorCard } from "@/components/creator-card";
import { creators, trendingPosts } from "@/lib/demo-data";

type ExploreProps = { searchParams?: Promise<{ q?: string }> };

export default async function ExplorePage({ searchParams }: ExploreProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q ?? "";
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="pill mb-4 w-fit">Discovery</div>
          <h1 className="text-4xl font-black">Explore artists, anime tags, and visuals</h1>
          <p className="mt-3 text-white/55">{query ? `Search results for “${query}”` : "Trending posts and creators based on engagement signals."}</p>
        </div>
        <form className="w-full md:max-w-sm">
          <input className="input" name="q" defaultValue={query} placeholder="Search #gfx, Jujutsu Kaisen, Rin..." />
        </form>
      </div>
      <div className="mb-10 flex flex-wrap gap-2">
        {["#animeedit", "#thumbnail", "#aftereffects", "#psd", "#luts", "#sololeveling"].map((tag) => <span className="pill" key={tag}>{tag}</span>)}
      </div>
      <h2 className="mb-4 text-2xl font-black">Trending artwork</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trendingPosts.map((post) => <ArtworkCard key={post.id} post={post} />)}
      </div>
      <h2 className="mb-4 mt-12 text-2xl font-black">Artists to watch</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {creators.map((creator) => <CreatorCard key={creator.username} creator={creator} />)}
      </div>
    </section>
  );
}
