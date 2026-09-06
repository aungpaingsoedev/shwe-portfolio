-- Create public media storage bucket (run in Supabase → SQL Editor if uploads say "Bucket not found")

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,
  array['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','application/pdf']
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read
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
