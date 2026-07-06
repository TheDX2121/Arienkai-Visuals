import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CloudinaryUploadField } from "@/components/cloudinary-upload-field";

type DbCategory = {
  id: string;
  name: string;
  slug: string;
};

type DbMaterial = {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string | null;
  categoryName: string | null;
  thumbnailUrl: string | null;
  fileUrl: string | null;
  previewUrl: string | null;
  fileType: string;
  isPremium: boolean;
  priceInr: number;
  purchaseUrl: string | null;
  createdAt: Date;
};

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

async function getMaterials() {
  try {
    return await prisma.$queryRaw<DbMaterial[]>`
      SELECT
        m."id",
        m."title",
        m."slug",
        m."description",
        m."categoryId",
        cat."name" AS "categoryName",
        m."thumbnailUrl",
        m."fileUrl",
        m."previewUrl",
        m."fileType",
        m."isPremium",
        m."priceInr",
        m."purchaseUrl",
        m."createdAt"
      FROM "Material" m
      LEFT JOIN "Category" cat ON cat."id" = m."categoryId"
      ORDER BY m."createdAt" DESC
    `;
  } catch {
    return [];
  }
}

export default async function AdminMaterialsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login?next=/admin/materials");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const categories = await getCategories();
  const materials = await getMaterials();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <details className="glass-panel mb-8 rounded-2xl p-4">
        <summary className="cursor-pointer text-lg font-black">
          ☰ Admin Menu
        </summary>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin" className="secondary-button">Dashboard</Link>
          <Link href="/admin/courses" className="secondary-button">Courses</Link>
          <Link href="/admin/materials" className="primary-button">Materials</Link>
          <Link href="/admin/categories" className="secondary-button">Categories</Link>
          <Link href="/admin/footer" className="secondary-button">Footer</Link>
        </div>
      </details>

      <div className="mb-8">
        <div className="pill mb-4 w-fit">Material manager</div>

        <h1 className="text-4xl font-black">
          Add, edit, delete materials
        </h1>

        <p className="mt-3 text-white/55">
          Upload files to Cloudinary or paste a direct file URL. The file URL becomes the download link.
        </p>
      </div>

      <details className="glass-panel mb-6 rounded-[2rem] p-6">
        <summary className="cursor-pointer text-2xl font-black">
          + Add new material
        </summary>

        <form
          action="/api/admin/materials"
          method="post"
          className="mt-5 grid gap-4"
        >
          <input className="input" name="title" placeholder="Material title" required />

          <textarea
            className="input min-h-28"
            name="description"
            placeholder="Material description..."
            required
          />

          <select className="input" name="categoryId" defaultValue="">
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            className="input"
            name="fileType"
            placeholder="PSD, ZIP, Preset, Overlay, UI Kit..."
            defaultValue="Digital file"
          />

          <CloudinaryUploadField
            name="thumbnailUrl"
            label="Thumbnail image"
            resourceType="image"
            buttonText="Upload thumbnail"
            placeholder="Paste thumbnail URL or upload image"
          />

          <CloudinaryUploadField
            name="previewUrl"
            label="Preview image"
            resourceType="image"
            buttonText="Upload preview"
            placeholder="Paste preview URL or upload image"
          />

          <CloudinaryUploadField
            name="fileUrl"
            label="Material file"
            resourceType="raw"
            buttonText="Upload file"
            placeholder="Paste file URL or upload file"
          />

          <label className="flex items-center gap-3 text-sm font-bold">
            <input name="isPremium" type="checkbox" />
            Premium / purchasable material
          </label>

          <input className="input" name="priceInr" type="number" min="0" defaultValue="0" />
          <input className="input" name="purchaseUrl" placeholder="Purchase link" />

          <button className="primary-button w-fit" type="submit">
            Publish material
          </button>
        </form>
      </details>

      <div className="grid gap-4">
        {materials.length ? (
          materials.map((material) => (
            <details key={material.id} className="glass-panel rounded-[2rem] p-5">
              <summary className="cursor-pointer">
                <div className="inline-flex flex-wrap items-center gap-3">
                  <span className="text-xl font-black">{material.title}</span>
                  {material.categoryName ? <span className="pill">{material.categoryName}</span> : null}
                  <span className="pill">{material.fileType}</span>
                  {material.isPremium ? (
                    <span className="pill bg-gold/20 text-yellow-100">
                      Premium {material.priceInr ? `₹${material.priceInr}` : ""}
                    </span>
                  ) : (
                    <span className="pill">Free</span>
                  )}
                </div>
              </summary>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/materials" className="secondary-button">
                  View materials page
                </Link>

                {material.fileUrl ? (
                  <a href={material.fileUrl} className="secondary-button" target="_blank" rel="noopener noreferrer">
                    Test file link
                  </a>
                ) : null}
              </div>

              <details className="mt-5 rounded-2xl bg-white/5 p-4">
                <summary className="cursor-pointer font-black">Edit material</summary>

                <form
                  action={`/api/admin/materials/${material.id}/update`}
                  method="post"
                  className="mt-4 grid gap-4"
                >
                  <input className="input" name="title" defaultValue={material.title} required />

                  <textarea
                    className="input min-h-24"
                    name="description"
                    defaultValue={material.description}
                    required
                  />

                  <select className="input" name="categoryId" defaultValue={material.categoryId || ""}>
                    <option value="">No category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <input className="input" name="fileType" defaultValue={material.fileType} />

                  <CloudinaryUploadField
                    name="thumbnailUrl"
                    label="Thumbnail image"
                    defaultValue={material.thumbnailUrl}
                    resourceType="image"
                    buttonText="Upload thumbnail"
                    placeholder="Paste thumbnail URL or upload image"
                  />

                  <CloudinaryUploadField
                    name="previewUrl"
                    label="Preview image"
                    defaultValue={material.previewUrl}
                    resourceType="image"
                    buttonText="Upload preview"
                    placeholder="Paste preview URL or upload image"
                  />

                  <CloudinaryUploadField
                    name="fileUrl"
                    label="Material file"
                    defaultValue={material.fileUrl}
                    resourceType="raw"
                    buttonText="Upload file"
                    placeholder="Paste file URL or upload file"
                  />

                  <label className="flex items-center gap-3 text-sm font-bold">
                    <input name="isPremium" type="checkbox" defaultChecked={material.isPremium} />
                    Premium / purchasable material
                  </label>

                  <input className="input" name="priceInr" type="number" min="0" defaultValue={material.priceInr} />
                  <input className="input" name="purchaseUrl" defaultValue={material.purchaseUrl || ""} />

                  <button className="primary-button w-fit" type="submit">
                    Save material
                  </button>
                </form>
              </details>

              <form
                action={`/api/admin/materials/${material.id}/delete`}
                method="post"
                className="mt-4"
              >
                <button
                  className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100"
                  type="submit"
                >
                  Delete material
                </button>
              </form>
            </details>
          ))
        ) : (
          <div className="glass-panel rounded-[2rem] p-6 text-white/55">
            No materials yet. Add your first material.
          </div>
        )}
      </div>
    </section>
  );
}
