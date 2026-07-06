import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NameWithBadge } from "@/components/user-plan-badge";

const links = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/courses", label: "Courses" },
  { href: "/materials", label: "Materials" },
  { href: "/premium", label: "Premium" }
];

type SubscriptionRow = {
  subscription: string | null;
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

export async function Navbar() {
  const user = await currentUser();
  const subscription = await getUserSubscription(user?.id);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface/78 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <img
            src="/brand/arienkai-logo.png"
            alt="Arienkai"
            className="h-10 w-10 rounded-xl object-contain"
          />

          <span className="hidden text-sm font-black uppercase tracking-[0.22em] sm:inline">
            Arienkai
          </span>
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/68 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <SearchBox />

          <Link href="/upload" className="secondary-button hidden sm:inline-flex">
            Upload
          </Link>

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
              <Link href="/signup" className="secondary-button hidden sm:inline-flex">
                Create account
              </Link>

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
