"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { StorageUploadField } from "@/components/admin/storage-upload-field";
import { Button } from "@/components/ui/button";
import { upsertProjectAction } from "@/app/admin/actions";
import { cn, slugify } from "@/lib/utils";
import type { CaseStudy, Project, PublishStatus } from "@/types";

const PROJECT_CATEGORIES = [
  "Project Management",
  "Product",
  "Banking",
  "Digital Transformation",
  "Data",
  "Software",
] as const;

const CASE_FIELDS: { key: keyof Omit<CaseStudy, "id" | "project_id" | "lifecycle_stages">; label: string }[] = [
  { key: "challenge", label: "Challenge" },
  { key: "discovery", label: "Discovery" },
  { key: "requirements", label: "Requirements" },
  { key: "strategy", label: "Strategy" },
  { key: "execution", label: "Execution" },
  { key: "collaboration", label: "Collaboration" },
  { key: "solution", label: "Solution" },
  { key: "results", label: "Results" },
  { key: "lessons_learned", label: "Lessons learned" },
];

const fieldClass =
  "w-full rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-4 py-3 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]";

const labelClass =
  "text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]";

type ProjectFormProps = {
  project?: Project | null;
};

function emptyCaseStudy(projectId: string): CaseStudy {
  return {
    id: `cs-${crypto.randomUUID()}`,
    project_id: projectId,
    challenge: "",
    discovery: "",
    requirements: "",
    strategy: "",
    execution: "",
    collaboration: "",
    solution: "",
    results: "",
    lessons_learned: "",
    lifecycle_stages: ["Idea", "Strategy", "Requirements", "Delivery", "Impact"],
  };
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(project);

  const initialId = useMemo(
    () => project?.id ?? `proj-${crypto.randomUUID()}`,
    [project?.id],
  );

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [shortDescription, setShortDescription] = useState(
    project?.short_description ?? "",
  );
  const [role, setRole] = useState(project?.role ?? "");
  const [industry, setIndustry] = useState(project?.industry ?? "");
  const [coverImage, setCoverImage] = useState(project?.cover_image ?? "");
  const [externalUrl, setExternalUrl] = useState(project?.external_url ?? "");
  const [technologies, setTechnologies] = useState(
    project?.technologies.join(", ") ?? "",
  );
  const [responsibilities, setResponsibilities] = useState(
    project?.responsibilities.join("\n") ?? "",
  );
  const [achievements, setAchievements] = useState(
    project?.achievements.join("\n") ?? "",
  );
  const [categories, setCategories] = useState<string[]>(
    project?.categories ?? [],
  );
  const [status, setStatus] = useState<PublishStatus>(
    project?.status ?? "draft",
  );
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [sortOrder, setSortOrder] = useState(project?.sort_order ?? 0);
  const [caseStudy, setCaseStudy] = useState<CaseStudy>(
    project?.case_study ?? emptyCaseStudy(initialId),
  );

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }

    const now = new Date().toISOString();
    const next: Project = {
      id: initialId,
      title: title.trim(),
      slug: slug.trim(),
      short_description: shortDescription.trim(),
      role: role.trim(),
      industry: industry.trim(),
      cover_image: coverImage.trim() || null,
      external_url: externalUrl.trim() || null,
      technologies: technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      responsibilities: responsibilities
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean),
      achievements: achievements
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean),
      categories,
      status,
      featured,
      sort_order: Number(sortOrder) || 0,
      published_at:
        status === "published"
          ? project?.published_at || now
          : project?.published_at ?? null,
      created_at: project?.created_at ?? now,
      updated_at: now,
      images: project?.images,
      case_study: {
        ...caseStudy,
        project_id: initialId,
      },
    };

    startTransition(async () => {
      try {
        await upsertProjectAction(next);
        router.push("/admin/projects");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save project");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 lg:grid-cols-2">
        <label className="space-y-1.5 lg:col-span-2">
          <span className={labelClass}>Title</span>
          <input
            className={fieldClass}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
          />
        </label>
        <label className="space-y-1.5">
          <span className={labelClass}>Slug</span>
          <input
            className={fieldClass}
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            required
          />
        </label>
        <label className="space-y-1.5">
          <span className={labelClass}>Status</span>
          <select
            className={fieldClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as PublishStatus)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <label className="space-y-1.5 lg:col-span-2">
          <span className={labelClass}>Short description</span>
          <textarea
            className={cn(fieldClass, "min-h-[96px] resize-y")}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
          />
        </label>
        <label className="space-y-1.5">
          <span className={labelClass}>Role</span>
          <input
            className={fieldClass}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </label>
        <label className="space-y-1.5">
          <span className={labelClass}>Industry</span>
          <input
            className={fieldClass}
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
        </label>
        <div className="space-y-1.5">
          <StorageUploadField
            label="Cover image"
            value={coverImage}
            onChange={setCoverImage}
            folder="covers"
            accept="image/*"
            hint="Upload to Supabase Storage or paste an image URL"
          />
        </div>
        <label className="space-y-1.5">
          <span className={labelClass}>External URL</span>
          <input
            className={fieldClass}
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://…"
          />
        </label>
        <label className="space-y-1.5 lg:col-span-2">
          <span className={labelClass}>Technologies (comma-separated)</span>
          <input
            className={fieldClass}
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
            placeholder="Jira, Agile, Power BI"
          />
        </label>
        <label className="space-y-1.5">
          <span className={labelClass}>Responsibilities (one per line)</span>
          <textarea
            className={cn(fieldClass, "min-h-[120px] resize-y")}
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
          />
        </label>
        <label className="space-y-1.5">
          <span className={labelClass}>Achievements (one per line)</span>
          <textarea
            className={cn(fieldClass, "min-h-[120px] resize-y")}
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
          />
        </label>
        <div className="space-y-2 lg:col-span-2">
          <span className={labelClass}>Categories</span>
          <div className="flex flex-wrap gap-2">
            {PROJECT_CATEGORIES.map((cat) => {
              const active = categories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]",
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="size-4 accent-[var(--accent)]"
          />
          Featured project
        </label>
        <label className="space-y-1.5">
          <span className={labelClass}>Sort order</span>
          <input
            type="number"
            className={fieldClass}
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div>
          <h2 className="font-semibold text-xl tracking-tight">Case study</h2>
          <p className="text-sm text-[var(--muted)]">
            Narrative sections for the project detail page.
          </p>
        </div>
        <div className="grid gap-5">
          {CASE_FIELDS.map((field) => (
            <label key={field.key} className="space-y-1.5">
              <span className={labelClass}>{field.label}</span>
              <RichTextEditor
                value={caseStudy[field.key]}
                onChange={(html) =>
                  setCaseStudy((prev) => ({ ...prev, [field.key]: html }))
                }
                placeholder={`Write the ${field.label.toLowerCase()}…`}
              />
            </label>
          ))}
        </div>
      </div>

      {error ? (
        <p className="rounded-xl bg-[color-mix(in_oklab,var(--danger)_12%,transparent)] px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : isEdit ? (
            "Save project"
          ) : (
            "Create project"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
