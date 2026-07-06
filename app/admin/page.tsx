import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

export default async function AdminPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const sections = [
    {
      title: "Courses",
      href: "/admin/courses",
      description: "Add, edit, delete courses and manage lessons."
    },
    {
      title: "Materials",
      href: "/admin",
      description: "Coming next: add GFX packs, overlays, PSDs, presets, and downloads."
    },
    {
      title: "News",
      href: "/admin",
      description: "Coming next: add anime and creator news."
    },
    {
      title: "Users",
      href: "/admin",
      description: "Coming next: manage users, roles, premium access, and moderation."
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <details className="glass-panel mb-8 rounded-2xl p-4">
        <summary className="cursor-pointer text-lg font-black">
          ☰ Admin Menu
        </summary>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="rounded-2xl bg-white/5 p-4 transition hover:bg-white/10"
            >
              <div className="font-black">{section.title}</div>
              <p className="mt-2 text-sm text-white/50">{section.description}</p>
            </Link>
          ))}
        </div>
      </details>

      <div className="mb-8">
        <div className="pill mb-4 w-fit">Admin dashboard</div>

        <h1 className="text-4xl font-black">
          Arienkai Admin Panel
        </h1>

        <p className="mt-3 text-white/55">
          Choose a section from the admin menu. We will add each system one by one.
        </p>

        <p className="mt-3 text-sm text-white/40">
          Logged in as @{user.username}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {sections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="card-hover glass-panel rounded-[2rem] p-5"
          >
            <h2 className="text-2xl font-black">{section.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/55">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
