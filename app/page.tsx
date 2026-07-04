import { Hero } from "@/components/hero";
import { NewsTicker } from "@/components/news-ticker";
import { Rail } from "@/components/rail";
import { ArtworkCard } from "@/components/artwork-card";
import { CourseCard } from "@/components/course-card";
import { MaterialCard } from "@/components/material-card";
import { CreatorCard } from "@/components/creator-card";
import { followedPosts, trendingPosts, courses, materials, creators } from "@/lib/demo-data";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-spotlight">
      <Hero />
      <section className="mx-auto -mt-10 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <NewsTicker />
        <Rail title="From artists you follow" subtitle="A personal feed for your creator circle">
          {followedPosts.map((post) => <ArtworkCard key={post.id} post={post} />)}
        </Rail>
        <Rail title="Trending anime artworks" subtitle="Fresh uploads gaining likes, saves, and preview ratings">
          {trendingPosts.map((post) => <ArtworkCard key={post.id} post={post} />)}
        </Rail>
        <Rail title="Premium editing courses" subtitle="Structured learning paths for editors, thumbnail artists, and GFX designers">
          {courses.map((course) => <CourseCard key={course.id} course={course} />)}
        </Rail>
        <Rail title="GFX & design materials" subtitle="Packs, overlays, LUTs, PSDs, thumbnails, and creator assets">
          {materials.map((material) => <MaterialCard key={material.id} material={material} />)}
        </Rail>
        <Rail title="Recommended creators" subtitle="Artists to follow based on your saves, likes, and anime tags">
          {creators.map((creator) => <CreatorCard key={creator.username} creator={creator} />)}
        </Rail>
      </section>
    </div>
  );
}
