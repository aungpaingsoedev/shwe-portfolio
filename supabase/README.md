# Prisma + Supabase setup

## 1. Create tables + storage bucket

In Supabase → **SQL Editor**, paste and run:

`supabase/schema.sql`

This creates all portfolio tables and a public **`media`** storage bucket.

## 2. Database connection strings

Supabase → **Project Settings → Database**:

1. Copy **Connection string** → URI  
2. Use **Transaction** pooler for app queries (`DATABASE_URL`, port `6543`)  
3. Use **Direct** connection for Prisma migrate/push (`DIRECT_URL`, port `5432`)  
4. Replace `[YOUR-PASSWORD]` with the database password

Add to `.env`:

```env
DATABASE_URL=postgresql://postgres.REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres
```

## 3. Generate client + seed

```bash
npm run db:generate
npm run db:seed
```

If tables were created only via SQL Editor, seed is enough after `db:generate`.  
If you prefer Prisma to create tables: `npm run db:push` then `npm run db:seed`.

## 4. Storage uploads

Admin → Media file uploads go to the **`media`** bucket when `SUPABASE_SERVICE_ROLE_KEY` is set.

## Fallback

Without `DATABASE_URL`, the app keeps using local `.data/store.json`.
