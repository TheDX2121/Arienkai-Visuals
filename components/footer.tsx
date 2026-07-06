import Link from "next/link";
import { prisma } from "@/lib/prisma";

type SiteSetting = {
  key: string;
  value: string;
};

type FooterLink = {
  label: string;
  href: string;
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

function parseLinks(value: string): FooterLink[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [label, href] = item.split("|").map((part) => part.trim());

      return {
        label: label || "Link",
        href: href || "/"
      };
    });
}

export async function Footer() {
  const settings = await getFooterSettings();

  const createLinks = parseLinks(settings.createLinks);
  const platformLinks = parseLinks(settings.platformLinks);

  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_.6fr_.6fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={settings.logoUrl}
              alt={settings.brand}
              className="h-12 w-12 rounded-xl object-contain"
            />

            <span className="text-sm font-black uppercase tracking-[0.22em]">
              {settings.brand}
            </span>
          </div>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/50">
            {settings.description}
          </p>
        </div>

        <div>
          <h3 className="font-black">Create</h3>

          <div className="mt-4 grid gap-3 text-sm text-white/55">
            {createLinks.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-black">Platform</h3>

          <div className="mt-4 grid gap-3 text-sm text-white/55">
            {platformLinks.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}