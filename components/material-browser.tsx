"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Material = {
  id: string;
  title: string;
  description: string;
  categoryName: string | null;
  categorySlug: string | null;
  thumbnailUrl: string | null;
  fileUrl: string | null;
  previewUrl: string | null;
  fileType: string;
  isPremium: boolean;
  priceInr: number;
  purchaseUrl: string | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type MaterialBrowserProps = {
  materials: Material[];
  categories: Category[];
};

export function MaterialBrowser({ materials, categories }: MaterialBrowserProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredMaterials = useMemo(() => {
    const search = query.toLowerCase().trim();

    return materials.filter((material) => {
      const matchesCategory =
        activeCategory === "all" || material.categorySlug === activeCategory;

      const matchesSearch =
        !search ||
        material.title.toLowerCase().includes(search) ||
        material.description.toLowerCase().includes(search) ||
        material.fileType.toLowerCase().includes(search) ||
        String(material.categoryName || "").toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [materials, query, activeCategory]);

  return (
    <div>
      <div className="glass-panel mb-6 rounded-[2rem] p-4">
        <input
          className="input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search materials, PSD, presets, overlays, UI kits..."
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={activeCategory === "all" ? "primary-button" : "secondary-button"}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.slug)}
              className={activeCategory === category.slug ? "primary-button" : "secondary-button"}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {filteredMaterials.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material) => (
            <article
              key={material.id}
              className="card-hover glass-panel overflow-hidden rounded-[1.75rem]"
            >
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-red-700 via-black to-purple-900 p-4">
                {material.thumbnailUrl || material.previewUrl ? (
                  <img
                    src={material.thumbnailUrl || material.previewUrl || ""}
                    alt={material.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}

                <div className="absolute inset-0 bg-black/35" />

                <div className="relative z-10 flex flex-wrap gap-2">
                  {material.categoryName ? (
                    <span className="pill bg-black/30">{material.categoryName}</span>
                  ) : null}

                  <span className="pill bg-black/30">{material.fileType}</span>

                  {material.isPremium ? (
                    <span className="pill bg-gold/25 text-yellow-100">
                      Premium {material.priceInr ? `₹${material.priceInr}` : ""}
                    </span>
                  ) : (
                    <span className="pill bg-black/30">Free</span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-black">
                  {material.title}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/58">
                  {material.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {material.isPremium ? (
                    material.purchaseUrl ? (
                      <a href={material.purchaseUrl} className="primary-button">
                        Buy material
                      </a>
                    ) : (
                      <Link href="/premium" className="primary-button">
                        Premium
                      </Link>
                    )
                  ) : material.fileUrl ? (
                    <a href={material.fileUrl} className="primary-button" download>
                      Download
                    </a>
                  ) : (
                    <span className="secondary-button opacity-60">
                      No file
                    </span>
                  )}

                  {material.previewUrl ? (
                    <a
                      href={material.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="secondary-button"
                    >
                      View
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-[2rem] p-8 text-white/55">
          No materials found.
        </div>
      )}
    </div>
  );
}
