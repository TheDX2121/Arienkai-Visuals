# Arienkai Visuals

A high-end, affordable creator platform for editors, GFX artists, anime artwork creators, and designers. The UI is inspired by premium streaming products: dark theme, hero rails, thumbnail-first cards, fast discovery, and creator-focused profiles.

## What is included

- Next.js App Router project structure
- Tailwind dark Netflix-style UI
- Home page with anime news, followed feed, trending artwork, courses, and GFX materials
- Auth pages plus email/username login API scaffold
- User profiles, post detail, upload, explore, premium, and admin pages
- Prisma schema for users, follows, posts, likes, comments, saves, preview ratings, courses, materials, notifications, and subscriptions
- RSS news fetcher API with fallback content
- Cloudinary upload signature API scaffold
- Railway/Vercel friendly environment variables

## Tech stack

- Frontend: Next.js + React + Tailwind CSS
- Backend: Next.js Route Handlers
- Database: PostgreSQL + Prisma ORM 7
- Auth: JWT cookie scaffold with bcrypt password hashing
- Media storage: Cloudinary-ready signature endpoint
- News: RSS parser route with cache-friendly response

## Local setup

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Required environment variables

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="change-this-to-a-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
ADMIN_EMAIL=""
```

## Deploy notes

### Vercel frontend + managed Postgres

1. Push this project to GitHub.
2. Import it in Vercel.
3. Add the environment variables above.
4. Run `npx prisma db push` locally or in a deploy job after connecting your production database.

### Railway full app

1. Create a Railway project.
2. Add a PostgreSQL database.
3. Add the variables from `.env.example`.
4. Build command: `npm run build`
5. Start command: `npm start`
6. Railway automatically provides a `PORT`; Next.js handles it through `next start`.

## Demo accounts after seeding

- `admin@arienkai.visuals` / `arienkai123`
- `rin@arienkai.visuals` / `arienkai123`

## Prisma note

This project uses Prisma ORM 7 style config: `prisma.config.ts` stores the database URL mapping, and the generated client is written to `generated/prisma`. The build script runs `prisma generate` before `next build`.

## Next production steps

- Replace the starter JWT auth with Better Auth/Auth.js if you want Google and Discord OAuth.
- Add Stripe/Razorpay for premium subscriptions.
- Wire Cloudinary unsigned upload widget or signed server uploads.
- Add moderation queues, report handling, and creator payouts.
- Add recommendation ranking based on follows, saves, likes, comments, and watch/course history.
