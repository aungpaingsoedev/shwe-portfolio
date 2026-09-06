import { MediaAdmin } from "@/components/admin/media-admin";
import { getMedia, isDatabaseConfigured } from "@/lib/data/content";
import { isSupabaseStorageConfigured } from "@/lib/supabase/storage";

export default async function AdminMediaPage() {
  const media = await getMedia();
  const usingDb = isDatabaseConfigured();
  const storage = isSupabaseStorageConfigured();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-3xl tracking-tight">Media</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Upload images and files to the Supabase{" "}
          <span className="font-medium text-[var(--foreground)]">media</span>{" "}
          bucket. Copied URLs can be used for covers, avatars, and posts.
        </p>
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">
          {storage
            ? "Supabase Storage connected"
            : "Storage not configured — set SUPABASE_SERVICE_ROLE_KEY"}
          {" · "}
          {usingDb ? "Library saved in Postgres" : "Library saved in local JSON"}
        </p>
      </div>
      <MediaAdmin media={media} />
    </div>
  );
}
