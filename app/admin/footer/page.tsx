import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CloudinaryUploadField } from "@/components/cloudinary-upload-field";

type FooterPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

type SiteSetting = {
  key: string;
  value: string;
};

async function getFooterSettings() {
  const fallback = {
    logoUrl: "/brand/arienkai-logo.png",
    brand: "Arienkai Visuals",
    description:
      "A creator-first streaming platform for editing tutorials, anime artwork, premium courses, GFX assets, preview ratings, and designer discovery.",
    createLinks: "Upload post|/upload,Courses|/courses,Materials|/materials",
    platformLinks: "Premium|/premium,Admin|/admin,Explore|/explore"
  };

  try {
    const settings = await prisma.$queryRaw<SiteSetting[]>`
      SELECT
        "key",
        "value"
      FROM "SiteSetting"
      WHERE "key" IN (
        'footer_logo_url',
        'navbar_logo_url',
        'footer_brand',
        'footer_description',
        'footer_create_links',
        'footer_platform_links'
      )
    `;

    const map = new Map(settings.map((setting) => [setting.key, setting.value]));

    return {
      logoUrl:
        map.get("footer_logo_url") ||
        map.get("navbar_logo_url") ||
        fallback.logoUrl,
      brand: map.get("footer_brand") || fallback.brand,
      description: map.get("footer_description") || fallback.description,
      createLinks: map.get("footer_create_links") || fallback.createLinks,
      platformLinks: map.get("footer_platform_links") || fallback.platformLinks
    };
  } catch {
    return fallback;
  }
}

export default async function AdminFooterPage({ searchParams }: FooterPageProps) {
  const user = await currentUser();
  const params = await searchParams;

  if (!user) {
    redirect("/login?next=/admin/footer");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const settings = await getFooterSettings();

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <details className="glass-panel mb-8 rounded-2xl p-4">
        <summary className="cursor-pointer text-lg font-black">
          ☰ Admin Menu
        </summary>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin" className="secondary-button">
            Dashboard
          </Link>

          <Link href="/admin/courses" className="secondary-button">
            Courses
          </Link>

          <Link href="/admin/materials" className="secondary-button">
            Materials
          </Link>

          <Link href="/admin/news" className="secondary-button">
            News
          </Link>

          <Link href="/admin/navbar" className="secondary-button">
            Navbar
          </Link>

          <Link href="/admin/footer" className="primary-button">
            Footer
          </Link>
        </div>
      </details>

      <div className="mb-8">
        <div className="pill mb-4 w-fit">Footer editor</div>

        <h1 className="text-4xl font-black">
          Edit website footer
        </h1>

        <p className="mt-3 text-white/55">
          Change footer logo, brand name, description, and links.
        </p>
      </div>

      {params.success ? (
        <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-100">
          Footer updated successfully.
        </div>
      ) : null}

      {params.error ? (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          Something went wrong. Please check the fields.
        </div>
      ) : null}

      <form
        action="/api/admin/footer"
        method="post"
        className="glass-panel rounded-[2rem] p-6"
      >
        <CloudinaryUploadField
          name="logoUrl"
          label="Footer logo"
          defaultValue={settings.logoUrl}
          resourceType="image"
          buttonText="Upload logo"
          placeholder="Paste logo link or code path like /brand/arienkai-logo.png"
        />

        <p className="mt-2 text-xs text-white/40">
          You can upload a logo, paste a Cloudinary URL, or paste a code path like /brand/arienkai-logo.png.
        </p>

        <label className="mb-2 mt-5 block text-sm font-bold">
          Footer brand name
        </label>

        <input
          className="input"
          name="brand"
          defaultValue={settings.brand}
          required
        />

        <label className="mb-2 mt-5 block text-sm font-bold">
          Footer description
        </label>

        <textarea
          className="input min-h-32"
          name="description"
          defaultValue={settings.description}
          required
        />

        <label className="mb-2 mt-5 block text-sm font-bold">
          Create links
        </label>

        <textarea
          className="input min-h-28"
          name="createLinks"
          defaultValue={settings.createLinks}
          required
        />

        <p className="mt-2 text-xs text-white/40">
          Format: Label|URL,Label|URL
        </p>

        <p className="mt-1 text-xs text-white/30">
          Example: Upload post|/upload,Courses|/courses,Materials|/materials
        </p>

        <label className="mb-2 mt-5 block text-sm font-bold">
          Platform links
        </label>

        <textarea
          className="input min-h-28"
          name="platformLinks"
          defaultValue={settings.platformLinks}
          required
        />

        <p className="mt-2 text-xs text-white/40">
          Format: Label|URL,Label|URL
        </p>

        <p className="mt-1 text-xs text-white/30">
          Example: Premium|/premium,Admin|/admin,Explore|/explore
        </p>

        <button className="primary-button mt-6" type="submit">
          Save footer
        </button>
      </form>

      <div className="glass-panel mt-6 rounded-[2rem] p-6">
        <h2 className="text-2xl font-black">
          Preview
        </h2>

        <div className="mt-5 grid gap-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={settings.logoUrl}
                alt="Footer logo preview"
                className="h-12 w-12 rounded-xl object-contain"
              />

              <div className="font-black">
                {settings.brand}
              </div>
            </div>

            <p className="mt-3 text-sm leading-6 text-white/55">
              {settings.description}
            </p>
          </div>

          <div>
            <div className="font-black">Create</div>

            <p className="mt-3 whitespace-pre-line text-sm text-white/55">
              {settings.createLinks}
            </p>
          </div>

          <div>
            <div className="font-black">Platform</div>

            <p className="mt-3 whitespace-pre-line text-sm text-white/55">
              {settings.platformLinks}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}