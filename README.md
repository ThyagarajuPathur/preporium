# Preporax MVP

Modern LeetCode prep tracker built with Next.js and Supabase.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase Auth + Postgres

## Local setup

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials
3. Run the SQL in `supabase/schema.sql`
4. Generate the seed file:

```bash
npm run seed:sql
```

5. Run the generated `supabase/seed.sql` in Supabase SQL Editor
6. Start the app:

```bash
npm run dev
```

## Included MVP features

- Email/password auth
- Google sign-in
- Protected dashboard, problems, path, and profile pages
- 30-day curated DSA path
- Problem filtering by difficulty, topic, day, and status
- Manual progress tracking with optimistic updates
- Direct links out to LeetCode
