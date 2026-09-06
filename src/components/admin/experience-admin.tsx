"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  deleteExperienceAction,
  upsertExperienceAction,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import type { Experience } from "@/types";

const fieldClass =
  "w-full rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]";
const labelClass =
  "text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]";

function blankExperience(sortOrder: number): Experience {
  const now = new Date().toISOString();
  return {
    id: `exp-${crypto.randomUUID()}`,
    company: "",
    position: "",
    location: "",
    start_date: "",
    end_date: null,
    is_current: false,
    summary: "",
    responsibilities: [],
    achievements: [],
    technologies: [],
    sort_order: sortOrder,
    created_at: now,
    updated_at: now,
  };
}

export function ExperienceAdmin({
  experiences,
}: {
  experiences: Experience[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Experience | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openNew = () => {
    setError(null);
    setEditing(blankExperience(experiences.length + 1));
  };

  const save = () => {
    if (!editing) return;
    if (!editing.company.trim() || !editing.position.trim()) {
      setError("Company and position are required.");
      return;
    }
    const now = new Date().toISOString();
    startTransition(async () => {
      await upsertExperienceAction({
        ...editing,
        company: editing.company.trim(),
        position: editing.position.trim(),
        location: editing.location?.trim() || null,
        end_date: editing.is_current ? null : editing.end_date,
        updated_at: now,
      });
      setEditing(null);
      router.refresh();
    });
  };

  const remove = (id: string) => {
    if (!window.confirm("Delete this experience?")) return;
    startTransition(async () => {
      await deleteExperienceAction(id);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={openNew}>
          <Plus className="size-4" />
          Add experience
        </Button>
      </div>

      {editing ? (
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
          <h2 className="font-semibold text-xl tracking-tight">
            {experiences.some((e) => e.id === editing.id)
              ? "Edit experience"
              : "New experience"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className={labelClass}>Company</span>
              <input
                className={fieldClass}
                value={editing.company}
                onChange={(e) =>
                  setEditing({ ...editing, company: e.target.value })
                }
              />
            </label>
            <label className="space-y-1.5">
              <span className={labelClass}>Position</span>
              <input
                className={fieldClass}
                value={editing.position}
                onChange={(e) =>
                  setEditing({ ...editing, position: e.target.value })
                }
              />
            </label>
            <label className="space-y-1.5">
              <span className={labelClass}>Location</span>
              <input
                className={fieldClass}
                value={editing.location ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, location: e.target.value })
                }
              />
            </label>
            <label className="space-y-1.5">
              <span className={labelClass}>Sort order</span>
              <input
                type="number"
                className={fieldClass}
                value={editing.sort_order}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    sort_order: Number(e.target.value) || 0,
                  })
                }
              />
            </label>
            <label className="space-y-1.5">
              <span className={labelClass}>Start date</span>
              <input
                type="date"
                className={fieldClass}
                value={editing.start_date?.slice(0, 10) ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, start_date: e.target.value })
                }
              />
            </label>
            <label className="space-y-1.5">
              <span className={labelClass}>End date</span>
              <input
                type="date"
                className={fieldClass}
                disabled={editing.is_current}
                value={editing.end_date?.slice(0, 10) ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, end_date: e.target.value || null })
                }
              />
            </label>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={editing.is_current}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    is_current: e.target.checked,
                    end_date: e.target.checked ? null : editing.end_date,
                  })
                }
                className="accent-[var(--accent)]"
              />
              Current role
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className={labelClass}>Summary</span>
              <textarea
                className={cn(fieldClass, "min-h-[88px] resize-y")}
                value={editing.summary}
                onChange={(e) =>
                  setEditing({ ...editing, summary: e.target.value })
                }
              />
            </label>
            <label className="space-y-1.5">
              <span className={labelClass}>Responsibilities (one per line)</span>
              <textarea
                className={cn(fieldClass, "min-h-[100px] resize-y")}
                value={editing.responsibilities.join("\n")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    responsibilities: e.target.value
                      .split("\n")
                      .map((l) => l.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
            <label className="space-y-1.5">
              <span className={labelClass}>Achievements (one per line)</span>
              <textarea
                className={cn(fieldClass, "min-h-[100px] resize-y")}
                value={editing.achievements.join("\n")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    achievements: e.target.value
                      .split("\n")
                      .map((l) => l.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className={labelClass}>Technologies (comma-separated)</span>
              <input
                className={fieldClass}
                value={editing.technologies.join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    technologies: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
          </div>
          {error ? (
            <p className="text-sm text-[var(--danger)]">{error}</p>
          ) : null}
          <div className="flex gap-3">
            <Button type="button" onClick={save} disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <div className="space-y-1">
              <p className="font-medium">{exp.position}</p>
              <p className="text-sm text-[var(--accent)]">{exp.company}</p>
              <p className="text-xs text-[var(--muted)]">
                {formatDate(exp.start_date)} —{" "}
                {exp.is_current ? "Present" : formatDate(exp.end_date)}
                {exp.location ? ` · ${exp.location}` : ""}
              </p>
              <p className="max-w-2xl text-sm text-[var(--muted)]">
                {exp.summary}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setEditing(exp);
                }}
                className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] hover:text-[var(--accent)]"
                aria-label="Edit"
              >
                <Pencil className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(exp.id)}
                className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] hover:text-[var(--danger)]"
                aria-label="Delete"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {experiences.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-10 text-center text-sm text-[var(--muted)]">
            No experience entries yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
