import { SettingsAdmin } from "@/components/admin/settings-admin";
import { getEducations, getProfile, getSettings } from "@/lib/data/content";

export default async function AdminSettingsPage() {
  const [settings, profile, educations] = await Promise.all([
    getSettings(),
    getProfile(),
    getEducations(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-3xl tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Site metadata and public profile fields.
        </p>
      </div>
      <SettingsAdmin
        settings={settings}
        profile={profile}
        educations={educations}
      />
    </div>
  );
}
