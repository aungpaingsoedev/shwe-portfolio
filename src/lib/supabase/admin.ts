import { createClient } from "@supabase/supabase-js";

/** Server-only client with service role (bypasses RLS). Never import in client components. */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key || key.includes("your-service-role")) {
    throw new Error("Supabase service role is not configured");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role") &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project"),
  );
}
