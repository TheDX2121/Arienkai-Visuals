import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CloudinaryUploadField } from "@/components/cloudinary-upload-field";

type SiteSetting = {
  key: string;
  value: string;
};

async function getNavbarSettings() {
  const fallback = {
    logoUrl: "/brand/arienkai-logo.png",
    links: "Home|/,Explore|/explore,Courses|/courses,Materials|/materials,News|/news,Premium|/premium",
    showUpload: "true",
    showCreateAccount: "true"
  };

  try {
    const settings = await prisma.$queryRaw<SiteSetting[]>`
      SELECT
        "key",
        "value"
      FROM "SiteSetting"
      WHERE "key" IN (
        'navbar_logo_url',
        'navbar_links',
        'navbar_show_upload',
        'navbar_show_create_account'
      )
    `;

    const map = new Map(settings.map((setting) => [setting.key, setting.value]));

    return {
      logoUrl: map.get("navbar_logo_url") || fallback.logoUrl,
      links: map.get("navbar_links") || fallback.links,
      showUpload: map.get("navbar_show_upload") || fallback.showUpload,
      showCreateAccount:
        map.get("navbar_show_create_account") || fallback.showCreateAccount
    };
  } catch {
    return fallback;
  }
}

export default async function AdminNavbarPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login?next=/admin/navbar");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const settings = await getNavbarSettings();

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

          <Link href="/admin/users" className="secondary-button">
            Users
          </Link>

          <Link href="/admin/navbar" className="primary-button">
            Navbar
          </Link>

          <Link href="/admin/footer" className="secondary-button">
            Footer
          </Link>
        </div>
      </details>

      <div className="mb-8">
        <div className="pill mb-4 w-fit">Navbar editor</div>

        <h1 className="text-4xl font-black">
          Edit website navbar
        </h1>

        <p className="mt-3 text-white/55">
          Change the logo, navbar links, and navbar buttons.
        </p>
      </div>

      <form
        action="/api/admin/navbar"
        method="post"
        className="glass-panel rounded-[2rem] p-6"
      >
        <CloudinaryUploadField
          name="logoUrl"
          label="Navbar logo"
          defaultValue={settings.logoUrl}
          resourceType="image"
          buttonText="Upload logo"
          placeholder="Paste logo link or code path like /brand/arienkai-logo.png"
        />

        <p className="mt-2 text-xs text-white/40">
          You can upload a logo, paste a Cloudinary URL, or paste a code path like /brand/arienkai-logo.png.
        </p>

        <label className="mb-2 mt-5 block text-sm font-bold">
          Navbar links
        </label>

        <textarea
          className="input min-h-32"
          name="links"
          defaultValue={settings.links}
          required
        />

        <p className="mt-2 text-xs text-white/40">
          Format: Label|URL,Label|URL
        </p>

        <p className="mt-1 text-xs text-white/30">
          Example: Home|/,Explore|/explore,Courses|/courses,Materials|/materials,News|/news,Premium|/premium
        </p>

        <div className="mt-6 grid gap-3">
          <label className="flex items-center gap-3 text-sm font-bold">
            <input
              name="showUpload"
              type="checkbox"
              defaultChecked={settings.showUpload === "true"}
            />
            Show Upload button
          </label>

          <label className="flex items-center gap-3 text-sm font-bold">
            <input
              name="showCreateAccount"
              type="checkbox"
              defaultChecked={settings.showCreateAccount === "true"}
            />
            Show Create account button when user is logged out
          </label>
        </div>

        <button className="primary-button mt-6" type="submit">
          Save navbar
        </button>
      </form>

      <div className="glass-panel mt-6 rounded-[2rem] p-6">
        <h2 className="text-2xl font-black">
          Preview
        </h2>

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <img
              src={settings.logoUrl}
              alt="Navbar logo preview"
              className="h-12 w-12 rounded-xl object-contain"
            />

            <p className="break-all text-sm text-white/55">
              {settings.links}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}