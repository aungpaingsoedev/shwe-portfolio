import { MessagesAdmin } from "@/components/admin/messages-admin";
import { getMessages, isDatabaseConfigured } from "@/lib/data/content";
import { isSupabaseStorageConfigured } from "@/lib/supabase/storage";

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  const usingDb = isDatabaseConfigured();
  const storage = isSupabaseStorageConfigured();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-3xl tracking-tight">Messages</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Review and triage contact form submissions.
        </p>
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">
          Data source:{" "}
          <span className="font-medium text-[var(--foreground)]">
            {usingDb ? "Supabase Postgres" : "Local JSON"}
          </span>
          {storage ? " · Storage ready" : ""}
        </p>
      </div>
      <MessagesAdmin messages={messages} />
    </div>
  );
}
