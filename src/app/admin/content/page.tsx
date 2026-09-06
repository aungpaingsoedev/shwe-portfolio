import { ContentAdmin } from "@/components/admin/content-admin";
import { getSiteCopy } from "@/lib/data/content";

export default async function AdminContentPage() {
  const copy = await getSiteCopy();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-3xl tracking-tight">Content</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Edit hero, section titles, CTAs, and other marketing copy shown on the
          public site. Profile identity fields remain under Settings.
        </p>
      </div>
      <ContentAdmin initial={copy} />
    </div>
  );
}
