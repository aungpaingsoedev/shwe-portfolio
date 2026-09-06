import {
  createAdminClient,
  isSupabaseStorageConfigured,
} from "@/lib/supabase/admin";

export const MEDIA_BUCKET = "media";

export { isSupabaseStorageConfigured };

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

/** Create the public `media` bucket if it does not exist yet. */
export async function ensureMediaBucket(): Promise<void> {
  const supabase = createAdminClient();

  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();
  if (listError) throw new Error(listError.message);

  const exists = buckets?.some((b) => b.name === MEDIA_BUCKET);
  if (exists) return;

  const { error: createError } = await supabase.storage.createBucket(
    MEDIA_BUCKET,
    {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
      allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
        "application/pdf",
      ],
    },
  );

  // Concurrent create races are fine
  if (
    createError &&
    !/already exists|duplicate|Bucket already exists/i.test(createError.message)
  ) {
    throw new Error(
      `Could not create storage bucket "${MEDIA_BUCKET}": ${createError.message}`,
    );
  }
}

export async function uploadToMediaBucket(
  file: File | Blob,
  fileName: string,
  mimeType?: string,
  folder = "uploads",
): Promise<{ path: string; url: string }> {
  await ensureMediaBucket();

  const supabase = createAdminClient();
  const safeFolder =
    folder.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/^\/+|\/+$/g, "") ||
    "uploads";
  const path = `${safeFolder}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${sanitizeFileName(fileName)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, buffer, {
      contentType: mimeType || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    if (/bucket not found/i.test(error.message)) {
      await ensureMediaBucket();
      const retry = await supabase.storage.from(MEDIA_BUCKET).upload(path, buffer, {
        contentType: mimeType || "application/octet-stream",
        upsert: false,
      });
      if (retry.error) throw new Error(retry.error.message);
    } else {
      throw new Error(error.message);
    }
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function deleteFromMediaBucket(path: string): Promise<void> {
  if (!path || path.startsWith("http") || path.startsWith("data:")) return;
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}
