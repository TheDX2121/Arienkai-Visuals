import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CloudinaryUploadField } from "@/components/cloudinary-upload-field";

type SiteSetting = {
  key: string;
  value: string;
};

type HomeSlide = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  href: string;
  buttonLabel: string;
  tag: string;
  meta: string;
  type: string;
  sortOrder: number;
  isActive: boolean;
};

type HomeCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
};

async function getHomeSettings() {
  const fallback = {
    trendingTitle: "Trending Now",
    coursesTitle: "Courses for you",
    materialsTitle: "Creator materials",
    cardsTitle: "Start creating with Arienkai"
  };

  try {
    const rows = await prisma.$queryRaw<SiteSetting[]>`
      SELECT
        "key",
        "value"
      FROM "SiteSetting"
      WHERE "key" IN (
        'home_trending_title',
        'home_courses_title',
        'home_materials_title',
        'home_cards_title'
      )
    `;

    const map = new Map(rows.map((item) => [item.key, item.value]));

    return {
      trendingTitle: map.get("home_trending_title") || fallback.trendingTitle,
      coursesTitle: map.get("home_courses_title") || fallback.coursesTitle,
      materialsTitle: map.get("home_materials_title") || fallback.materialsTitle,
      cardsTitle: map.get("home_cards_title") || fallback.cardsTitle
    };
  } catch {
    return fallback;
  }
}

async function getSlides() {
  try {
    return await prisma.$queryRaw<HomeSlide[]>`
      SELECT
        "id",
        "title",
        "description",
        "imageUrl",
        "href",
        "buttonLabel",
        "tag",
        "meta",
        "type",
        "sortOrder",
        "isActive"
      FROM "HomeSlide"
      ORDER BY "sortOrder" ASC, "createdAt" DESC
    `;
  } catch {
    return [];
  }
}

async function getCards() {
  try {
    return await prisma.$queryRaw<HomeCard[]>`
      SELECT
        "id",
        "title",
        "description",
        "href",
        "label",
        "sortOrder",
        "isActive"
      FROM "HomeCard"
      ORDER BY "sortOrder" ASC, "createdAt" DESC
    `;
  } catch {
    return [];
  }
}

export default async function AdminHomePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login?next=/admin/home");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const [settings, slides, cards] = await Promise.all([
    getHomeSettings(),
    getSlides(),
    getCards()
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <details className="glass-panel mb-8 rounded-2xl p-4">
        <summary className="cursor-pointer text-lg font-black">
          ☰ Admin Menu
        </summary>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin" className="secondary-button">Dashboard</Link>
          <Link href="/admin/home" className="primary-button">Home</Link>
          <Link href="/admin/courses" className="secondary-button">Courses</Link>
          <Link href="/admin/materials" className="secondary-button">Materials</Link>
          <Link href="/admin/news" className="secondary-button">News</Link>
          <Link href="/admin/users" className="secondary-button">Users</Link>
          <Link href="/admin/navbar" className="secondary-button">Navbar</Link>
          <Link href="/admin/footer" className="secondary-button">Footer</Link>
        </div>
      </details>

      <div className="mb-8">
        <div className="pill mb-4 w-fit">Home editor</div>

        <h1 className="text-4xl font-black">
          Edit home page
        </h1>

        <p className="mt-3 text-white/55">
          Control slider, section titles, bottom cards, pinned offers, and home layout content.
        </p>
      </div>

      <details className="glass-panel mb-6 rounded-[2rem] p-6" open>
        <summary className="cursor-pointer text-2xl font-black">
          Section titles
        </summary>

        <form action="/api/admin/home/settings" method="post" className="mt-5 grid gap-4">
          <input className="input" name="trendingTitle" defaultValue={settings.trendingTitle} required />
          <input className="input" name="coursesTitle" defaultValue={settings.coursesTitle} required />
          <input className="input" name="materialsTitle" defaultValue={settings.materialsTitle} required />
          <input className="input" name="cardsTitle" defaultValue={settings.cardsTitle} required />

          <button className="primary-button w-fit" type="submit">
            Save section titles
          </button>
        </form>
      </details>

      <details className="glass-panel mb-6 rounded-[2rem] p-6">
        <summary className="cursor-pointer text-2xl font-black">
          + Add hero slider item / pinned offer
        </summary>

        <form action="/api/admin/home/slides" method="post" className="mt-5 grid gap-4">
          <input className="input" name="title" placeholder="Slider title" required />

          <textarea
            className="input min-h-24"
            name="description"
            placeholder="Slider description"
            required
          />

          <CloudinaryUploadField
            name="imageUrl"
            label="Slider image"
            resourceType="image"
            buttonText="Upload image"
            placeholder="Paste image URL or upload image"
          />

          <input className="input" name="href" placeholder="/courses or /post/id or external link" defaultValue="/" required />
          <input className="input" name="buttonLabel" placeholder="Open Course" defaultValue="Open" required />
          <input className="input" name="tag" placeholder="Featured / Offer / Course" defaultValue="Featured" required />
          <input className="input" name="meta" placeholder="Beginner · 5 lessons · 2h" />
          <input className="input" name="type" placeholder="course / material / post / offer" defaultValue="offer" />
          <input className="input" name="sortOrder" type="number" defaultValue="1" />

          <label className="flex items-center gap-3 text-sm font-bold">
            <input name="isActive" type="checkbox" defaultChecked />
            Show this slide
          </label>

          <button className="primary-button w-fit" type="submit">
            Add slider item
          </button>
        </form>
      </details>

      <div className="mb-6 grid gap-4">
        {slides.map((slide) => (
          <details key={slide.id} className="glass-panel rounded-[2rem] p-5">
            <summary className="cursor-pointer">
              <span className="text-xl font-black">{slide.title}</span>
              <span className="ml-3 pill">{slide.type}</span>
              {slide.isActive ? <span className="ml-2 pill">Active</span> : <span className="ml-2 pill">Hidden</span>}
            </summary>

            <form
              action={`/api/admin/home/slides/${slide.id}/update`}
              method="post"
              className="mt-5 grid gap-4"
            >
              <input className="input" name="title" defaultValue={slide.title} required />

              <textarea
                className="input min-h-24"
                name="description"
                defaultValue={slide.description}
                required
              />

              <CloudinaryUploadField
                name="imageUrl"
                label="Slider image"
                defaultValue={slide.imageUrl}
                resourceType="image"
                buttonText="Upload image"
                placeholder="Paste image URL or upload image"
              />

              <input className="input" name="href" defaultValue={slide.href} required />
              <input className="input" name="buttonLabel" defaultValue={slide.buttonLabel} required />
              <input className="input" name="tag" defaultValue={slide.tag} required />
              <input className="input" name="meta" defaultValue={slide.meta} />
              <input className="input" name="type" defaultValue={slide.type} />
              <input className="input" name="sortOrder" type="number" defaultValue={slide.sortOrder} />

              <label className="flex items-center gap-3 text-sm font-bold">
                <input name="isActive" type="checkbox" defaultChecked={slide.isActive} />
                Show this slide
              </label>

              <button className="primary-button w-fit" type="submit">
                Save slide
              </button>
            </form>

            <form action={`/api/admin/home/slides/${slide.id}/delete`} method="post" className="mt-4">
              <button className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100">
                Delete slide
              </button>
            </form>
          </details>
        ))}
      </div>

      <details className="glass-panel mb-6 rounded-[2rem] p-6">
        <summary className="cursor-pointer text-2xl font-black">
          + Add bottom home card
        </summary>

        <form action="/api/admin/home/cards" method="post" className="mt-5 grid gap-4">
          <input className="input" name="label" placeholder="Courses" required />
          <input className="input" name="title" placeholder="Learn editing" required />

          <textarea
            className="input min-h-24"
            name="description"
            placeholder="Card description"
            required
          />

          <input className="input" name="href" placeholder="/courses" defaultValue="/" required />
          <input className="input" name="sortOrder" type="number" defaultValue="1" />

          <label className="flex items-center gap-3 text-sm font-bold">
            <input name="isActive" type="checkbox" defaultChecked />
            Show this card
          </label>

          <button className="primary-button w-fit" type="submit">
            Add card
          </button>
        </form>
      </details>

      <div className="grid gap-4">
        {cards.map((card) => (
          <details key={card.id} className="glass-panel rounded-[2rem] p-5">
            <summary className="cursor-pointer">
              <span className="text-xl font-black">{card.title}</span>
              <span className="ml-3 pill">{card.label}</span>
              {card.isActive ? <span className="ml-2 pill">Active</span> : <span className="ml-2 pill">Hidden</span>}
            </summary>

            <form
              action={`/api/admin/home/cards/${card.id}/update`}
              method="post"
              className="mt-5 grid gap-4"
            >
              <input className="input" name="label" defaultValue={card.label} required />
              <input className="input" name="title" defaultValue={card.title} required />

              <textarea
                className="input min-h-24"
                name="description"
                defaultValue={card.description}
                required
              />

              <input className="input" name="href" defaultValue={card.href} required />
              <input className="input" name="sortOrder" type="number" defaultValue={card.sortOrder} />

              <label className="flex items-center gap-3 text-sm font-bold">
                <input name="isActive" type="checkbox" defaultChecked={card.isActive} />
                Show this card
              </label>

              <button className="primary-button w-fit" type="submit">
                Save card
              </button>
            </form>

            <form action={`/api/admin/home/cards/${card.id}/delete`} method="post" className="mt-4">
              <button className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100">
                Delete card
              </button>
            </form>
          </details>
        ))}
      </div>
    </section>
  );
  }
