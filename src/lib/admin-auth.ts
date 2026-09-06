import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

/** Accept local demo cookie or a signed-in Supabase Auth user. */
export async function requireAdminAuth(): Promise<boolean> {
  const jar = await cookies();
  if (jar.get("sym_admin_session")?.value === "1") return true;

  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return Boolean(user);
  } catch {
    return false;
  }
}
