import { MaterialCard } from "@/components/material-card";
import { materials } from "@/lib/demo-data";

export default function MaterialsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="pill mb-4 w-fit">Asset store</div>
        <h1 className="text-4xl font-black">GFX materials and design packs</h1>
        <p className="mt-3 max-w-2xl text-white/55">Free and premium packs for commercial-ready edits, thumbnails, posters, and anime channel branding.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {materials.map((material) => <MaterialCard key={material.id} material={material} />)}
      </div>
    </section>
  );
}
