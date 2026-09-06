# Shwe Yi Mon — Portfolio

Premium personal portfolio and admin CMS for **Shwe Yi Mon**, IT Project Manager & Product Owner.

## Stack

- Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion
- Supabase (Auth, Postgres, Storage) with a local JSON store for zero-config demos

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Admin (local demo)

1. Visit [/admin/login](http://localhost:3000/admin/login)
2. Sign in with `admin@shweyimon.com` / `admin123` (or any non-empty credentials in demo mode)
3. Manage projects, experience, skills, blog, messages, media, and settings

Content persists in `.data/store.json` until you connect Supabase.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` → `.env.local` and fill credentials
3. Run `supabase/schema.sql` in the SQL editor
4. Create a public Storage bucket named `media`
5. Create an Auth user for admin access

Public pages continue to work from the local store until you migrate queries to live Supabase tables.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint

## Structure

- `src/app` — public site + `/admin` portal
- `src/components` — UI, animations, sections
- `src/lib/data` — seed content + local store + content API
- `supabase/schema.sql` — Postgres schema, indexes, RLS
