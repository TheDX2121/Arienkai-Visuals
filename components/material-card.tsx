import Link from "next/link";
import type { Material } from "@/lib/types";

export function MaterialCard({ material }: { material: Material }) {
  return (
    <Link href={`/materials/${material.id}`} className="card-hover glass-panel block min-h-[300px] overflow-hidden rounded-[1.75rem]">
      <div className={`h-40 bg-gradient-to-br ${material.gradient} p-4`}>
        <span className="pill bg-black/30">{material.type}</span>
      </div>

      <div className="p-4">
        <div className="text-lg font-black">{material.title}</div>

        <div className="mt-2 text-sm text-white/55">
          {material.files} files · {material.license}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-bold">{material.price}</span>
          <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-black">
            Get pack
          </span>
        </div>
      </div>
    </Link>
  );
}
