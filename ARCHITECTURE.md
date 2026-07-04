# Arienkai Visuals Architecture

## Product flow

1. Visitor opens the homepage.
2. Anime news appears first, followed by personalized posts from followed artists.
3. General trending posts, courses, and materials are shown in horizontal rails.
4. Signed-in users can upload artwork, rate previews, like, save, comment, and follow creators.
5. Premium users unlock paid courses, paid material packs, and advanced rating analytics.
6. Admin users moderate content, curate news, and review premium material submissions.

## Main entities

- User: profile, avatar, bio, role, subscription status
- Follow: follower/following graph
- Post: image/GIF/video artwork with hashtags and anime tags
- Like, Comment, Save: engagement signals
- PreviewRating: composition, color, readability, motion, click appeal
- Course and Lesson: structured tutorials
- Material: GFX packs and downloadable design files
- NewsItem: curated or RSS-imported anime news
- Notification: follow/like/comment alerts

## Recommended production services

- Web: Vercel or Railway
- Database: Supabase Postgres, Railway Postgres, Neon, or Prisma Postgres
- Media: Cloudinary
- Payments: Stripe internationally, Razorpay for India-first pricing
- Email: Resend, Postmark, or AWS SES
- Realtime: Socket.io or Pusher
- Background jobs: Inngest, Trigger.dev, or Railway cron jobs

## Ranking idea

Trending score can combine:

```txt
likes * 1.0 + saves * 2.2 + comments * 1.8 + avgPreviewRating * 7 - ageHours * 0.35
```

Personal recommendation score can combine:

```txt
sameAnimeTags + sameHashtags + followedByFriends + similarSavedPosts + creatorQualityScore
```

## Moderation

For a creator platform, moderation should happen before wide distribution:

- Auto-check file size, file type, and NSFW risk.
- Let admins review reported posts and comments.
- Add strike/warning records for repeat abuse.
- Hide premium submissions until approved.
