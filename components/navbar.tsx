import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { currentUser } from "@/lib/auth";

const links = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/courses", label: "Courses" },
  { href: "/materials", label: "Materials" },
  { href: "/premium", label: "Premium" }
];

export async function Navbar() {
  const user = await currentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface/78 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-black shadow-glow transition group-hover:rotate-3">
            A
          </span>
          <span className="hidden text-sm font-black uppercase tracking-[0.22em] sm:inline">
            Arienkai
          </span>
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-white/68 transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <SearchBox />

          {user ? (
            <>
              <Link href="/upload" className="secondary-button hidden sm:inline-flex">
                Upload
              </Link>

              <Link href={`/profile/${user.username}`} className="secondary-button">
                @{user.username}
              </Link>

              <form action="/api/auth/logout" method="post">
                <button className="primary-button" type="submit">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="primary-button">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
