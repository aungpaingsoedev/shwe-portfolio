-- Shwe Yi Mon Portfolio — Supabase / PostgreSQL schema
-- 1) Run this in Supabase → SQL Editor
-- 2) Create Storage bucket "media" (public) OR run the storage section at the bottom
-- 3) Add DATABASE_URL + DIRECT_URL to .env, then: npx prisma generate && npx prisma db seed

create extension if not exists "pgcrypto";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null,
  tagline text,
  headline text,
  bio text,
  about_title_lines text[] default '{}',
  status_text text,
  email text,
  location text,
  resume_url text,
  avatar_url text,
  years_it int default 0,
  years_dev int default 0,
  years_pm int default 0,
  industry_focus text,
  updated_at timestamptz default now()
);

-- Experiences
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  position text not null,
  location text,
  start_date date not null,
  end_date date,
  is_current boolean default false,
  summary text,
  responsibilities text[] default '{}',
  achievements text[] default '{}',
  technologies text[] default '{}',
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists experiences_sort_idx on public.experiences (sort_order);

-- Education
create table if not exists public.educations (
  id uuid primary key default gen_random_uuid(),
  school text not null,
  degree text not null,
  field text,
  location text,
  start_year text not null,
  end_year text,
  note text,
  sort_order int default 0
);

create index if not exists educations_sort_idx on public.educations (sort_order);

-- Skill categories & skills
create table if not exists public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  sort_order int default 0
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.skill_categories(id) on delete cascade,
  name text not null,
  proficiency int,
  sort_order int default 0
);

create index if not exists skills_category_idx on public.skills (category_id);

-- Project categories
create table if not exists public.project_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  short_description text,
  role text,
  industry text,
  cover_image text,
  external_url text,
  technologies text[] default '{}',
  responsibilities text[] default '{}',
  achievements text[] default '{}',
  status text check (status in ('draft', 'published')) default 'draft',
  featured boolean default false,
  sort_order int default 0,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists projects_status_idx on public.projects (status);
create index if not exists projects_slug_idx on public.projects (slug);

create table if not exists public.project_category_links (
  project_id uuid references public.projects(id) on delete cascade,
  category_id uuid references public.project_categories(id) on delete cascade,
  primary key (project_id, category_id)
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  url text not null,
  alt text,
  sort_order int default 0
);

create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid unique references public.projects(id) on delete cascade,
  challenge text,
  discovery text,
  requirements text,
  strategy text,
  execution text,
  collaboration text,
  solution text,
  results text,
  lessons_learned text,
  lifecycle_stages text[] default '{Idea,Strategy,Requirements,Delivery,Impact}'
);

-- Blog
create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

create table if not exists public.blog_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image text,
  category_id uuid references public.blog_categories(id) on delete set null,
  reading_time int default 1,
  status text check (status in ('draft', 'published')) default 'draft',
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  views int default 0
);

create index if not exists blog_posts_status_idx on public.blog_posts (status);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);

create table if not exists public.blog_post_tags (
  post_id uuid references public.blog_posts(id) on delete cascade,
  tag_id uuid references public.blog_tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Contact messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text check (status in ('unread', 'read', 'archived')) default 'unread',
  created_at timestamptz default now()
);

create index if not exists contact_messages_status_idx on public.contact_messages (status);

-- Media library
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  path text not null,
  mime_type text,
  size bigint default 0,
  alt text,
  created_at timestamptz default now()
);

-- Site settings
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_title text,
  site_description text,
  og_image text,
  twitter_handle text,
  contact_email text,
  linkedin_url text,
  github_url text,
  show_admin_link boolean default true
);

-- Marketing / chrome copy (Admin → Content)
create table if not exists public.site_copy (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.experiences enable row level security;
alter table public.educations enable row level security;
alter table public.skill_categories enable row level security;
alter table public.skills enable row level security;
alter table public.project_categories enable row level security;
alter table public.projects enable row level security;
alter table public.project_category_links enable row level security;
alter table public.project_images enable row level security;
alter table public.case_studies enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_tags enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_tags enable row level security;
alter table public.contact_messages enable row level security;
alter table public.media enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_copy enable row level security;

-- Public read policies (drop/recreate safe for re-runs)
do $$ begin
  create policy "Public read profiles" on public.profiles for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read experiences" on public.experiences for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read educations" on public.educations for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read skill_categories" on public.skill_categories for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read skills" on public.skills for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read project_categories" on public.project_categories for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read published projects" on public.projects for select using (status = 'published' or auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read project links" on public.project_category_links for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read project images" on public.project_images for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read case studies" on public.case_studies for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read blog categories" on public.blog_categories for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read blog tags" on public.blog_tags for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read published posts" on public.blog_posts for select using (status = 'published' or auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read post tags" on public.blog_post_tags for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read settings" on public.site_settings for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read site_copy" on public.site_copy for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read media" on public.media for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Anyone can submit contact" on public.contact_messages
    for insert with check (true);
exception when duplicate_object then null; end $$;

-- Authenticated admin full access
do $$ begin
  create policy "Admin all profiles" on public.profiles for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all experiences" on public.experiences for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all educations" on public.educations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all skill_categories" on public.skill_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all skills" on public.skills for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all project_categories" on public.project_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all projects" on public.projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all project links" on public.project_category_links for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all project images" on public.project_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all case studies" on public.case_studies for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all blog categories" on public.blog_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all blog tags" on public.blog_tags for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all blog posts" on public.blog_posts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all post tags" on public.blog_post_tags for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin read/update messages" on public.contact_messages for select using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin update messages" on public.contact_messages for update using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin delete messages" on public.contact_messages for delete using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all media" on public.media for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all settings" on public.site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admin all site_copy" on public.site_copy for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- Storage: public media bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,
  array['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','application/pdf']
)
on conflict (id) do update set public = excluded.public;

do $$ begin
  create policy "Public read media bucket"
    on storage.objects for select
    using (bucket_id = 'media');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated upload media"
    on storage.objects for insert
    with check (bucket_id = 'media' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated update media"
    on storage.objects for update
    using (bucket_id = 'media' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Authenticated delete media"
    on storage.objects for delete
    using (bucket_id = 'media' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- Note: Prisma / server uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS for admin writes.
