import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NameWithBadge } from "@/components/user-plan-badge";

type SubscriptionRow = {
  subscription: string | null;
};

type SiteSetting = {
  key: string;
  value: string;
};

type NavbarLink = {
  label: string;
  href: string;
};

const fallbackNavbar = {
  logoUrl: "/brand/arienkai-logo.png",
  links: "Home|/,Explore|/explore,Courses|/courses,Materials|/materials,News|/news,Premium|/premium",
  showUpload: "true",
  showCreateAccount: "true"
};

async function getUserSubscription(userId?: string) {
  if (!userId) return "FREE";

  try {
    const rows = await prisma.$queryRaw<SubscriptionRow[]>`
      SELECT "subscription"
      FROM "User"
      WHERE "id" = ${userId}
      LIMIT 1
    `;

    return rows[0]?.subscription || "FREE";
  } catch {
    return "FREE";
  }
}

async function getNavbarSettings() {
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
      logoUrl: map.get("navbar_logo_url") || fallbackNavbar.logoUrl,
      links: map.get("navbar_links") || fallbackNavbar.links,
      showUpload: map.get("navbar_show_upload") || fallbackNavbar.showUpload,
      showCreateAccount:
        map.get("navbar_show_create_account") || fallbackNavbar.showCreateAccount
    };
  } catch {
    return fallbackNavbar;
  }
}

function parseNavbarLinks(value: string): NavbarLink[] {
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

export async function Navbar() {
  const user = await currentUser();

  const [subscription, settings] = await Promise.all([
    getUserSubscription(user?.id),
    getNavbarSettings()
  ]);

  const links = parseNavbarLinks(settings.links);
  const showUpload = settings.showUpload === "true";
  const showCreateAccount = settings.showCreateAccount === "true";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface/78 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center">
          <img
            src={settings.logoUrl}
            alt="Arienkai"
            className="h-11 w-11 rounded-xl object-contain"
          />
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <Link
              key={`${link.label}-${link.href}`}
              href={link.href}
              className="text-sm font-medium text-white/68 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <SearchBox />

          {showUpload ? (
            <Link href="/upload" className="secondary-button hidden sm:inline-flex">
              Upload
            </Link>
          ) : null}

          {user ? (
            <>
              {user.role === "ADMIN" ? (
                <Link href="/admin" className="secondary-button hidden sm:inline-flex">
                  Admin
                </Link>
              ) : null}

              <Link href={`/profile/${user.username}`} className="primary-button">
                <NameWithBadge subscription={subscription}>
                  @{user.username}
                </NameWithBadge>
              </Link>

              <form action="/api/auth/logout" method="post" className="hidden sm:block">
                <button className="secondary-button" type="submit">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              {showCreateAccount ? (
                <Link href="/signup" className="secondary-button hidden sm:inline-flex">
                  Create account
                </Link>
              ) : null}

              <Link href="/login" className="primary-button">
                Sign in
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
