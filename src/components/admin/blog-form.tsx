"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { StorageUploadField } from "@/components/admin/storage-upload-field";
import { Button } from "@/components/ui/button";
import { upsertPostAction } from "@/app/admin/actions";
import { cn, readingTimeFromContent, slugify } from "@/lib/utils";
import type { BlogCategory, BlogPost, PublishStatus } from "@/types";

const fieldClass =
  "w-full rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-4 py-3 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]";

const labelClass =
  "text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]";

type BlogFormProps = {
  post?: BlogPost | null;
  categories: BlogCategory[];
};

export function BlogForm({ post, categories }: BlogFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(post);

  const initialId = useMemo(
    () => post?.id ?? `bp-${crypto.randomUUID()}`,
    [post?.id],
  );

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "");
  const [categoryId, setCategoryId] = useState(post?.category_id ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [readingTime, setReadingTime] = useState(
    post?.reading_time ?? 3,
  );
  const [autoReading, setAutoReading] = useState(!post);
  const [status, setStatus] = useState<PublishStatus>(post?.status ?? "draft");
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    post?.seo_description ?? "",
  );

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const onContentChange = (html: string) => {
    setContent(html);
    if (autoReading) {
      setReadingTime(readingTimeFromContent(html.replace(/<[^>]+>/g, " ")));
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }

    const now = new Date().toISOString();
    const category =
      categories.find((c) => c.id === categoryId) ?? null;

    const next: BlogPost = {
      id: initialId,
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content,
      cover_image: coverImage.trim() || null,
      category_id: categoryId || null,
      category,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      reading_time: Number(readingTime) || 1,
      status,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      published_at:
        status === "published"
          ? post?.published_at || now
          : post?.published_at ?? null,
      created_at: post?.created_at ?? now,
      updated_at: now,
      views: post?.views ?? 0,
    };

    startTransition(async () => {
      try {
        await upsertPostAction(next);
        router.push("/admin/blog");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save post");
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
          <span className={labelClass}>Excerpt</span>
          <textarea
            className={cn(fieldClass, "min-h-[88px] resize-y")}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </label>
        <div className="space-y-1.5">
          <StorageUploadField
            label="Cover image"
            value={coverImage}
            onChange={setCoverImage}
            folder="blog"
            accept="image/*"
            hint="Upload to Supabase Storage or paste an image URL"
          />
        </div>
        <label className="space-y-1.5">
          <span className={labelClass}>Category</span>
          <select
            className={fieldClass}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Uncategorized</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className={labelClass}>Tags (comma-separated)</span>
          <input
            className={fieldClass}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </label>
        <label className="space-y-1.5">
          <span className={labelClass}>Reading time (minutes)</span>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              className={fieldClass}
              value={readingTime}
              onChange={(e) => {
                setAutoReading(false);
                setReadingTime(Number(e.target.value));
              }}
            />
            <label className="flex shrink-0 items-center gap-2 text-xs text-[var(--muted)]">
              <input
                type="checkbox"
                checked={autoReading}
                onChange={(e) => setAutoReading(e.target.checked)}
                className="accent-[var(--accent)]"
              />
              Auto
            </label>
          </div>
        </label>
        <label className="space-y-1.5">
          <span className={labelClass}>SEO title</span>
          <input
            className={fieldClass}
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
        </label>
        <label className="space-y-1.5 lg:col-span-2">
          <span className={labelClass}>SEO description</span>
          <textarea
            className={cn(fieldClass, "min-h-[72px] resize-y")}
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
          />
        </label>
      </div>

      <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div>
          <h2 className="font-semibold text-xl tracking-tight">Content</h2>
          <p className="text-sm text-[var(--muted)]">
            Rich HTML content for the article body.
          </p>
        </div>
        <RichTextEditor value={content} onChange={onContentChange} />
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
            "Save post"
          ) : (
            "Create post"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/blog")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
