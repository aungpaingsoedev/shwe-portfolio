"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { saveProfileAction, saveSettingsAction, saveEducationsAction } from "@/app/admin/actions";
import { StorageUploadField } from "@/components/admin/storage-upload-field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Education, Profile, SiteSettings } from "@/types";

const fieldClass =
  "w-full rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]";
const labelClass =
  "text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]";

export function SettingsAdmin({
  settings: initialSettings,
  profile: initialProfile,
  educations: initialEducations,
}: {
  settings: SiteSettings;
  profile: Profile;
  educations: Education[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initialSettings);
  const [profile, setProfile] = useState(initialProfile);
  const [educations, setEducations] = useState(initialEducations);
  const [message, setMessage] = useState<string | null>(null);

  const save = () => {
    setMessage(null);
    startTransition(async () => {
      await Promise.all([
        saveSettingsAction(settings),
        saveProfileAction({
          ...profile,
          updated_at: new Date().toISOString(),
        }),
        saveEducationsAction(educations),
      ]);
      setMessage("Settings saved.");
      router.refresh();
    });
  };

  const updateEducation = (id: string, patch: Partial<Education>) => {
    setEducations((list) =>
      list.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const addEducation = () => {
    setEducations((list) => [
      ...list,
      {
        id: `edu-${crypto.randomUUID()}`,
        school: "",
        degree: "",
        field: null,
        location: null,
        start_year: "",
        end_year: null,
        note: null,
        sort_order: list.length + 1,
      },
    ]);
  };

  const removeEducation = (id: string) => {
    setEducations((list) => list.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div>
          <h2 className="font-semibold text-xl tracking-tight">Site settings</h2>
          <p className="text-sm text-[var(--muted)]">
            SEO and contact defaults for the public site.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>Site title</span>
            <input
              className={fieldClass}
              value={settings.site_title}
              onChange={(e) =>
                setSettings({ ...settings, site_title: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>Site description</span>
            <textarea
              className={cn(fieldClass, "min-h-[88px] resize-y")}
              value={settings.site_description}
              onChange={(e) =>
                setSettings({ ...settings, site_description: e.target.value })
              }
            />
          </label>
          <div className="space-y-1.5">
            <StorageUploadField
              label="OG image"
              value={settings.og_image ?? ""}
              onChange={(url) =>
                setSettings({ ...settings, og_image: url || null })
              }
              folder="og"
              accept="image/*"
              hint="Upload to Supabase Storage or paste a URL"
            />
          </div>
          <label className="space-y-1.5">
            <span className={labelClass}>Twitter handle</span>
            <input
              className={fieldClass}
              value={settings.twitter_handle ?? ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  twitter_handle: e.target.value || null,
                })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Contact email</span>
            <input
              className={fieldClass}
              value={settings.contact_email}
              onChange={(e) =>
                setSettings({ ...settings, contact_email: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>LinkedIn URL</span>
            <input
              className={fieldClass}
              value={settings.linkedin_url ?? ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  linkedin_url: e.target.value || null,
                })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>GitHub URL</span>
            <input
              className={fieldClass}
              value={settings.github_url ?? ""}
              onChange={(e) =>
                setSettings({ ...settings, github_url: e.target.value || null })
              }
            />
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={settings.show_admin_link}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  show_admin_link: e.target.checked,
                })
              }
              className="accent-[var(--accent)]"
            />
            Show admin link in footer
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div>
          <h2 className="font-semibold text-xl tracking-tight">Profile</h2>
          <p className="text-sm text-[var(--muted)]">
            Public identity shown on the homepage and about sections.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className={labelClass}>Full name</span>
            <input
              className={fieldClass}
              value={profile.full_name}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Role</span>
            <input
              className={fieldClass}
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>Tagline</span>
            <input
              className={fieldClass}
              value={profile.tagline}
              onChange={(e) =>
                setProfile({ ...profile, tagline: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>Headline</span>
            <input
              className={fieldClass}
              value={profile.headline}
              onChange={(e) =>
                setProfile({ ...profile, headline: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>Bio</span>
            <textarea
              className={cn(fieldClass, "min-h-[120px] resize-y")}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>About title lines (one per line)</span>
            <textarea
              className={cn(fieldClass, "min-h-[88px] resize-y")}
              value={profile.about_title_lines.join("\n")}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  about_title_lines: e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean),
                })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Status text</span>
            <input
              className={fieldClass}
              value={profile.status_text}
              onChange={(e) =>
                setProfile({ ...profile, status_text: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Email</span>
            <input
              className={fieldClass}
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Location</span>
            <input
              className={fieldClass}
              value={profile.location}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
            />
          </label>
          <div className="space-y-1.5">
            <StorageUploadField
              label="Resume"
              value={profile.resume_url ?? ""}
              onChange={(url) =>
                setProfile({ ...profile, resume_url: url || null })
              }
              folder="resumes"
              accept="application/pdf,.pdf"
              preview={false}
              hint="Upload a PDF to Supabase Storage or paste a URL"
            />
          </div>
          <div className="space-y-1.5">
            <StorageUploadField
              label="Avatar"
              value={profile.avatar_url ?? ""}
              onChange={(url) =>
                setProfile({ ...profile, avatar_url: url || null })
              }
              folder="avatars"
              accept="image/*"
              hint="Upload a photo to Supabase Storage or paste a URL"
            />
          </div>
          <label className="space-y-1.5">
            <span className={labelClass}>Years in IT</span>
            <input
              type="number"
              className={fieldClass}
              value={profile.years_it}
              onChange={(e) =>
                setProfile({ ...profile, years_it: Number(e.target.value) || 0 })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Years development</span>
            <input
              type="number"
              className={fieldClass}
              value={profile.years_dev}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  years_dev: Number(e.target.value) || 0,
                })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Years project management</span>
            <input
              type="number"
              className={fieldClass}
              value={profile.years_pm}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  years_pm: Number(e.target.value) || 0,
                })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Industry focus</span>
            <input
              className={fieldClass}
              value={profile.industry_focus}
              onChange={(e) =>
                setProfile({ ...profile, industry_focus: e.target.value })
              }
            />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-xl tracking-tight">Education</h2>
            <p className="text-sm text-[var(--muted)]">
              Shown in the About section on the public site.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addEducation}>
            Add entry
          </Button>
        </div>

        <div className="space-y-4">
          {educations.map((item) => (
            <div
              key={item.id}
              className="grid gap-3 rounded-xl border border-[var(--border)] p-4 sm:grid-cols-2"
            >
              <label className="space-y-1.5 sm:col-span-2">
                <span className={labelClass}>Degree</span>
                <input
                  className={fieldClass}
                  value={item.degree}
                  onChange={(e) =>
                    updateEducation(item.id, { degree: e.target.value })
                  }
                />
              </label>
              <label className="space-y-1.5">
                <span className={labelClass}>Field</span>
                <input
                  className={fieldClass}
                  value={item.field ?? ""}
                  onChange={(e) =>
                    updateEducation(item.id, {
                      field: e.target.value || null,
                    })
                  }
                />
              </label>
              <label className="space-y-1.5">
                <span className={labelClass}>School</span>
                <input
                  className={fieldClass}
                  value={item.school}
                  onChange={(e) =>
                    updateEducation(item.id, { school: e.target.value })
                  }
                />
              </label>
              <label className="space-y-1.5">
                <span className={labelClass}>Location</span>
                <input
                  className={fieldClass}
                  value={item.location ?? ""}
                  onChange={(e) =>
                    updateEducation(item.id, {
                      location: e.target.value || null,
                    })
                  }
                />
              </label>
              <label className="space-y-1.5">
                <span className={labelClass}>Start year</span>
                <input
                  className={fieldClass}
                  value={item.start_year}
                  onChange={(e) =>
                    updateEducation(item.id, { start_year: e.target.value })
                  }
                />
              </label>
              <label className="space-y-1.5">
                <span className={labelClass}>End year</span>
                <input
                  className={fieldClass}
                  value={item.end_year ?? ""}
                  onChange={(e) =>
                    updateEducation(item.id, {
                      end_year: e.target.value || null,
                    })
                  }
                />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className={labelClass}>Note</span>
                <textarea
                  className={cn(fieldClass, "min-h-[72px] resize-y")}
                  value={item.note ?? ""}
                  onChange={(e) =>
                    updateEducation(item.id, { note: e.target.value || null })
                  }
                />
              </label>
              <div className="sm:col-span-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(item.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          {educations.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No education entries yet.</p>
          ) : null}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={save} disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save settings"
          )}
        </Button>
        {message ? (
          <p className="text-sm text-[var(--accent)]">{message}</p>
        ) : null}
      </div>
    </div>
  );
}
