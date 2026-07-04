import type { ArtworkPost, Course, Creator, Material, NewsItem } from "@/lib/types";

export const creators: Creator[] = [
  {
    username: "rinfx",
    displayName: "Rin FX",
    bio: "Anime glow edits, impact frames, and cinematic thumbnail systems.",
    followers: 48200,
    following: 390,
    posts: 128,
    gradient: "from-red-500 via-fuchsia-600 to-indigo-700"
  },
  {
    username: "kaizen.psd",
    displayName: "Kaizen PSD",
    bio: "PSD templates, title treatments, and full GFX breakdowns.",
    followers: 31100,
    following: 228,
    posts: 84,
    gradient: "from-amber-400 via-orange-600 to-red-800"
  },
  {
    username: "mira.motion",
    displayName: "Mira Motion",
    bio: "After Effects rigs, short form edits, and soft cinematic color grading.",
    followers: 27650,
    following: 160,
    posts: 91,
    gradient: "from-cyan-400 via-blue-600 to-violet-800"
  },
  {
    username: "noirframes",
    displayName: "Noir Frames",
    bio: "Dark anime posters, minimal compositions, and typography-first designs.",
    followers: 19300,
    following: 112,
    posts: 67,
    gradient: "from-zinc-300 via-zinc-700 to-black"
  }
];

export const followedPosts: ArtworkPost[] = [
  {
    id: "post_akuma_city",
    title: "Akuma City Color Grade",
    caption: "A night-city anime grade using split toning, grain, glow control, and red-blue contrast.",
    hashtags: ["aftereffects", "colorgrade", "animeedit"],
    animeTags: ["Jujutsu Kaisen"],
    mediaType: "Video",
    premium: false,
    rating: 9.2,
    likes: 18200,
    comments: 420,
    saves: 3900,
    gradient: "from-red-700 via-black to-blue-900",
    author: creators[0]
  },
  {
    id: "post_psd_hero",
    title: "Hero Thumbnail PSD Breakdown",
    caption: "Layer-by-layer deconstruction of depth, rim light, smoke overlays, and CTA placement.",
    hashtags: ["thumbnail", "psd", "gfx"],
    animeTags: ["Solo Leveling"],
    mediaType: "Image",
    premium: true,
    rating: 9.6,
    likes: 9400,
    comments: 186,
    saves: 2410,
    gradient: "from-yellow-500 via-red-600 to-black",
    author: creators[1]
  },
  {
    id: "post_soft_motion",
    title: "Soft Motion Scene Pack",
    caption: "Smooth pan, blur, and shake presets for clean anime AMV transitions.",
    hashtags: ["amv", "motion", "preset"],
    animeTags: ["Demon Slayer"],
    mediaType: "GIF",
    premium: false,
    rating: 8.8,
    likes: 7200,
    comments: 94,
    saves: 1350,
    gradient: "from-indigo-500 via-purple-700 to-slate-950",
    author: creators[2]
  }
];

export const trendingPosts: ArtworkPost[] = [
  ...followedPosts,
  {
    id: "post_noir_poster",
    title: "Noir Poster Composition",
    caption: "Dark poster design with masked typography and low-key rim lighting.",
    hashtags: ["poster", "typography", "composition"],
    animeTags: ["Chainsaw Man"],
    mediaType: "Image",
    premium: false,
    rating: 9.0,
    likes: 15500,
    comments: 301,
    saves: 4420,
    gradient: "from-neutral-700 via-black to-red-950",
    author: creators[3]
  }
];

export const courses: Course[] = [
  {
    id: "course_after_effects_zero_to_pro",
    title: "After Effects Zero to Pro",
    description: "A complete editing course covering project setup, timing, impact frames, shakes, typography, and export workflows.",
    level: "Beginner",
    lessons: 42,
    duration: "8h 20m",
    gradient: "from-red-500 to-black"
  },
  {
    id: "course_thumbnail_psychology",
    title: "Thumbnail Psychology for Anime Channels",
    description: "Learn hierarchy, contrast, facial emotion, text density, and mobile-first preview testing.",
    level: "Advanced",
    lessons: 28,
    duration: "5h 45m",
    gradient: "from-amber-400 to-red-800"
  },
  {
    id: "course_gfx_materials_mastery",
    title: "GFX Materials Mastery",
    description: "Build reusable PSD systems, overlays, LUT workflows, and asset libraries for fast client work.",
    level: "Pro",
    lessons: 34,
    duration: "7h 10m",
    gradient: "from-fuchsia-500 to-indigo-900"
  }
];

export const materials: Material[] = [
  {
    id: "mat_red_impact_overlays",
    title: "Red Impact Overlay Pack",
    type: "Overlay",
    files: 64,
    license: "Commercial",
    price: "Free",
    gradient: "from-red-500 to-black"
  },
  {
    id: "mat_anime_title_psd",
    title: "Anime Title PSD System",
    type: "PSD",
    files: 18,
    license: "Commercial",
    price: "₹299",
    gradient: "from-purple-500 to-slate-950"
  },
  {
    id: "mat_lut_cinematic",
    title: "Cinematic Anime LUTs",
    type: "LUT",
    files: 32,
    license: "Personal",
    price: "₹149",
    gradient: "from-cyan-400 to-blue-950"
  }
];

export const newsItems: NewsItem[] = [
  {
    id: "news_1",
    title: "Major anime trailers and creator opportunities to track this week",
    source: "Arienkai Curated",
    url: "/api/news",
    publishedAt: "Live"
  },
  {
    id: "news_2",
    title: "New visual trends: film grain, aggressive rim light, and mobile-first posters",
    source: "Studio Desk",
    url: "/api/news",
    publishedAt: "Today"
  },
  {
    id: "news_3",
    title: "How artists can turn seasonal anime hype into thumbnail packs and edits",
    source: "Creator Notes",
    url: "/api/news",
    publishedAt: "Featured"
  }
];
