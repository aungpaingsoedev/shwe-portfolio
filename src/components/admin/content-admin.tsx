"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { saveSiteCopyAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SectionCopy, SiteCopy } from "@/types";

const fieldClass =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]";
const labelClass =
  "text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]";

function SectionFields({
  label,
  value,
  onChange,
  showViewAll,
}: {
  label: string;
  value: SectionCopy;
  onChange: (next: SectionCopy) => void;
  showViewAll?: boolean;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-[var(--border)] p-4">
      <h3 className="font-semibold text-base tracking-tight">{label}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className={labelClass}>Eyebrow</span>
          <input
            className={fieldClass}
            value={value.eyebrow}
            onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
          />
        </label>
        <label className="space-y-1.5">
          <span className={labelClass}>Margin note</span>
          <input
            className={fieldClass}
            value={value.margin_note}
            onChange={(e) =>
              onChange({ ...value, margin_note: e.target.value })
            }
          />
        </label>
        <label className="space-y-1.5 sm:col-span-2">
          <span className={labelClass}>Title</span>
          <input
            className={fieldClass}
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
          />
        </label>
        <label className="space-y-1.5 sm:col-span-2">
          <span className={labelClass}>Description</span>
          <textarea
            className={cn(fieldClass, "min-h-[72px] resize-y")}
            value={value.description}
            onChange={(e) =>
              onChange({ ...value, description: e.target.value })
            }
          />
        </label>
        {showViewAll ? (
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>View all label</span>
            <input
              className={fieldClass}
              value={value.view_all_label ?? ""}
              onChange={(e) =>
                onChange({ ...value, view_all_label: e.target.value })
              }
            />
          </label>
        ) : null}
      </div>
    </div>
  );
}

export function ContentAdmin({ initial }: { initial: SiteCopy }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [copy, setCopy] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);

  const save = () => {
    setMessage(null);
    startTransition(async () => {
      await saveSiteCopyAction(copy);
      setMessage("Content saved. Public pages updated.");
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div>
          <h2 className="font-semibold text-xl tracking-tight">Hero</h2>
          <p className="text-sm text-[var(--muted)]">
            Use {"{years_it}"} in subcopy to insert years dynamically.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>Eyebrow</span>
            <input
              className={fieldClass}
              value={copy.hero_eyebrow}
              onChange={(e) =>
                setCopy({ ...copy, hero_eyebrow: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>Subcopy</span>
            <textarea
              className={cn(fieldClass, "min-h-[80px] resize-y")}
              value={copy.hero_subcopy}
              onChange={(e) =>
                setCopy({ ...copy, hero_subcopy: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Primary CTA</span>
            <input
              className={fieldClass}
              value={copy.hero_cta_primary}
              onChange={(e) =>
                setCopy({ ...copy, hero_cta_primary: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Secondary CTA</span>
            <input
              className={fieldClass}
              value={copy.hero_cta_secondary}
              onChange={(e) =>
                setCopy({ ...copy, hero_cta_secondary: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Sticky note</span>
            <input
              className={fieldClass}
              value={copy.hero_sticky_note}
              onChange={(e) =>
                setCopy({ ...copy, hero_sticky_note: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Lifecycle label</span>
            <input
              className={fieldClass}
              value={copy.lifecycle_label}
              onChange={(e) =>
                setCopy({ ...copy, lifecycle_label: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>Lifecycle stages (comma separated)</span>
            <input
              className={fieldClass}
              value={copy.lifecycle_stages.join(", ")}
              onChange={(e) =>
                setCopy({
                  ...copy,
                  lifecycle_stages: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </label>
        </div>
      </section>

      <SectionFields
        label="About section"
        value={copy.about}
        onChange={(about) => setCopy({ ...copy, about })}
      />

      <section className="space-y-3 rounded-xl border border-[var(--border)] p-4">
        <h3 className="font-semibold text-base tracking-tight">About extras</h3>
        <label className="block space-y-1.5">
          <span className={labelClass}>Bridge labels (comma separated)</span>
          <input
            className={fieldClass}
            value={copy.about_bridge_labels.join(", ")}
            onChange={(e) =>
              setCopy({
                ...copy,
                about_bridge_labels: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </label>
        <label className="block space-y-1.5">
          <span className={labelClass}>Education eyebrow</span>
          <input
            className={fieldClass}
            value={copy.education_eyebrow}
            onChange={(e) =>
              setCopy({ ...copy, education_eyebrow: e.target.value })
            }
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["years_it", "Years IT label"],
              ["years_dev", "Years dev label"],
              ["years_pm", "Years PM label"],
              ["industry", "Industry label"],
            ] as const
          ).map(([key, title]) => (
            <label key={key} className="space-y-1.5">
              <span className={labelClass}>{title}</span>
              <input
                className={fieldClass}
                value={copy.stats_labels[key]}
                onChange={(e) =>
                  setCopy({
                    ...copy,
                    stats_labels: {
                      ...copy.stats_labels,
                      [key]: e.target.value,
                    },
                  })
                }
              />
            </label>
          ))}
        </div>
      </section>

      <SectionFields
        label="Experience section"
        value={copy.experience}
        onChange={(experience) => setCopy({ ...copy, experience })}
      />
      <SectionFields
        label="Skills section"
        value={copy.skills}
        onChange={(skills) => setCopy({ ...copy, skills })}
      />
      <SectionFields
        label="Projects (home)"
        value={copy.projects}
        onChange={(projects) => setCopy({ ...copy, projects })}
        showViewAll
      />
      <SectionFields
        label="Blog (home)"
        value={copy.blog}
        onChange={(blog) => setCopy({ ...copy, blog })}
        showViewAll
      />
      <SectionFields
        label="Projects page"
        value={copy.projects_page}
        onChange={(projects_page) => setCopy({ ...copy, projects_page })}
      />
      <SectionFields
        label="Blog page"
        value={copy.blog_page}
        onChange={(blog_page) => setCopy({ ...copy, blog_page })}
      />
      <SectionFields
        label="Contact page"
        value={copy.contact}
        onChange={(contact) => setCopy({ ...copy, contact })}
      />

      <section className="space-y-3 rounded-xl border border-[var(--border)] p-4">
        <h3 className="font-semibold text-base tracking-tight">CTA + Footer</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className={labelClass}>CTA eyebrow</span>
            <input
              className={fieldClass}
              value={copy.cta_eyebrow}
              onChange={(e) =>
                setCopy({ ...copy, cta_eyebrow: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>CTA button</span>
            <input
              className={fieldClass}
              value={copy.cta_button_label}
              onChange={(e) =>
                setCopy({ ...copy, cta_button_label: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>CTA title</span>
            <input
              className={fieldClass}
              value={copy.cta_title}
              onChange={(e) => setCopy({ ...copy, cta_title: e.target.value })}
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>CTA description</span>
            <textarea
              className={cn(fieldClass, "min-h-[72px] resize-y")}
              value={copy.cta_description}
              onChange={(e) =>
                setCopy({ ...copy, cta_description: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>CTA sticky note</span>
            <input
              className={fieldClass}
              value={copy.cta_sticky_note}
              onChange={(e) =>
                setCopy({ ...copy, cta_sticky_note: e.target.value })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Footer sticky note</span>
            <input
              className={fieldClass}
              value={copy.footer_sticky_note}
              onChange={(e) =>
                setCopy({ ...copy, footer_sticky_note: e.target.value })
              }
            />
          </label>
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
            "Save all content"
          )}
        </Button>
        {message ? (
          <p className="text-sm text-[var(--accent)]">{message}</p>
        ) : null}
      </div>
    </div>
  );
}
