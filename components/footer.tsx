import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-white/55 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="mb-3 text-lg font-black text-white">Arienkai Visuals</div>
          <p className="max-w-xl">A creator-first streaming platform for editing tutorials, anime artwork, premium courses, GFX assets, preview ratings, and designer discovery.</p>
        </div>
        <div>
          <div className="mb-3 font-bold text-white">Create</div>
          <div className="grid gap-2">
            <Link href="/upload">Upload post</Link>
            <Link href="/courses">Courses</Link>
            <Link href="/materials">Materials</Link>
          </div>
        </div>
        <div>
          <div className="mb-3 font-bold text-white">Platform</div>
          <div className="grid gap-2">
            <Link href="/premium">Premium</Link>
            <Link href="/admin">Admin</Link>
            <Link href="/explore">Explore</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
