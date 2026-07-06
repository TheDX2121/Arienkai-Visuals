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
      description: "Add, edit, delete courses and lessons."
    },
    {
      title: "Materials",
      href: "/admin/materials",
      description: "Add, edit, delete downloadable materials."
    },
    {
      title: "Categories",
      href: "/admin/categories",
      description: "Add, edit, delete categories."
    },
    {
      title: "Footer",
      href: "/admin/footer",
      description: "Edit footer brand, description, and links."
    },
    {
      title: "News",
      href: "/admin",
      description: "Coming later: anime and creator news."
    },
    {
      title: "Users",
      href: "/admin",
      description: "Coming later: roles, premium access, and moderation."
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="pill mb-4 w-fit">Admin dashboard</div>

        <h1 className="text-4xl font-black">
          Arienkai Admin Panel
        </h1>

        <p className="mt-3 text-white/55">
          Open the menu below and choose what you want to manage.
        </p>

        <p className="mt-3 text-sm text-white/40">
          Logged in as @{user.username}
        </p>
      </div>

      <details className="glass-panel rounded-[2rem] p-5">
        <summary className="cursor-pointer text-xl font-black">
          ☰ Admin Menu
        </summary>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="card-hover rounded-[1.5rem] bg-white/5 p-5 transition hover:bg-white/10"
            >
              <h2 className="text-2xl font-black">{section.title}</h2>

              <p className="mt-3 text-sm leading-6 text-white/55">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </details>
    </section>
  );
}
