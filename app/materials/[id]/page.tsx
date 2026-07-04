import Link from "next/link";
import { notFound } from "next/navigation";
import { materials } from "@/lib/demo-data";

type MaterialDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MaterialDetailPage({ params }: MaterialDetailProps) {
  const { id } = await params;
  const material = materials.find((item) => item.id === id);

  if (!material) {
    notFound();
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
      <div className={`min-h-[520px] rounded-[2rem] bg-gradient-to-br ${material.gradient} p-8 shadow-card`}>
        <span className="pill bg-black/30">{material.type}</span>

        <h1 className="mt-6 max-w-2xl text-5xl font-black tracking-tight">
          {material.title}
        </h1>

        <p className="mt-5 max-w-xl text-white/70">
          A creator-ready design pack for anime edits, thumbnails, posters, and GFX workflows.
        </p>
      </div>

      <aside className="glass-panel h-fit rounded-[2rem] p-6">
        <h2 className="text-2xl font-black">Pack details</h2>

        <div className="mt-6 grid gap-3">
          <div className="flex justify-between rounded-2xl bg-white/5 p-4">
            <span className="text-white/50">Files</span>
            <b>{material.files}</b>
          </div>

          <div className="flex justify-between rounded-2xl bg-white/5 p-4">
            <span className="text-white/50">License</span>
            <b>{material.license}</b>
          </div>

          <div className="flex justify-between rounded-2xl bg-white/5 p-4">
            <span className="text-white/50">Price</span>
            <b>{material.price}</b>
          </div>
        </div>

        {material.price === "Free" ? (
          <Link href="/signup" className="primary-button mt-7 w-full justify-center">
            Get free pack
          </Link>
        ) : (
          <Link href="/premium" className="primary-button mt-7 w-full justify-center">
            Unlock premium pack
          </Link>
        )}

        <p className="mt-4 text-sm leading-6 text-white/45">
          Real file downloads will be connected later using Cloudinary, S3, or protected download URLs.
        </p>
      </aside>
    </section>
  );
}
