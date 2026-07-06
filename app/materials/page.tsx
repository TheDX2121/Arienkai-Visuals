import { prisma } from "@/lib/prisma";
import { MaterialBrowser } from "@/components/material-browser";

type DbMaterial = {
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

type DbCategory = {
  id: string;
  name: string;
  slug: string;
};

async function getMaterials() {
  try {
    return await prisma.$queryRaw<DbMaterial[]>`
      SELECT
        m."id",
        m."title",
        m."description",
        cat."name" AS "categoryName",
        cat."slug" AS "categorySlug",
        m."thumbnailUrl",
        m."fileUrl",
        m."previewUrl",
        m."fileType",
        m."isPremium",
        m."priceInr",
        m."purchaseUrl"
      FROM "Material" m
      LEFT JOIN "Category" cat ON cat."id" = m."categoryId"
      ORDER BY m."createdAt" DESC
    `;
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.$queryRaw<DbCategory[]>`
      SELECT
        "id",
        "name",
        "slug"
      FROM "Category"
      ORDER BY "name" ASC
    `;
  } catch {
    return [];
  }
}

export default async function MaterialsPage() {
  const materials = await getMaterials();
  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="pill mb-4 w-fit">Materials</div>

        <h1 className="text-4xl font-black">
          Download GFX packs, presets, overlays, PSDs, and creator resources.
        </h1>

        <p className="mt-3 max-w-2xl text-white/55">
          Search materials or filter them by category.
        </p>
      </div>

      <MaterialBrowser materials={materials} categories={categories} />
    </section>
  );
}
