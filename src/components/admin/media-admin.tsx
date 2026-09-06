"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2, Trash2 } from "lucide-react";
import { deleteMediaAction, upsertMediaAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { MediaItem } from "@/types";

const fieldClass =
  "w-full rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]";

export function MediaAdmin({ media }: { media: MediaItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const addFromUrl = () => {
    if (!url.trim()) return;
    const now = new Date().toISOString();
    const item: MediaItem = {
      id: `media-${crypto.randomUUID()}`,
      name: name.trim() || "Untitled asset",
      url: url.trim(),
      path: url.trim(),
      mime_type: guessMime(url.trim()),
      size: 0,
      alt: alt.trim() || null,
      created_at: now,
    };
    startTransition(async () => {
      await upsertMediaAction(item);
      setName("");
      setUrl("");
      setAlt("");
      router.refresh();
    });
  };

  const onFile = async (file: File | null) => {
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    if (name.trim()) body.append("name", name.trim());
    if (alt.trim()) body.append("alt", alt.trim());

    startTransition(async () => {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body,
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        window.alert(data?.error || "Upload failed");
        return;
      }
      setName("");
      setAlt("");
      router.refresh();
    });
  };

  const copyUrl = async (item: MediaItem) => {
    await navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId(null), 1500);
  };

  const remove = (id: string) => {
    if (!window.confirm("Delete this media item?")) return;
    startTransition(async () => {
      await deleteMediaAction(id);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="font-semibold text-xl tracking-tight">Add media</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className={fieldClass}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className={fieldClass}
            placeholder="Alt text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
          />
          <input
            className={fieldClass}
            placeholder="Or paste an image URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
            Upload file to Supabase Storage
          </label>
        </div>
        <Button type="button" onClick={addFromUrl} disabled={pending || !url.trim()}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          Add from URL
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]"
          >
            <div className="aspect-[4/3] bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.alt || item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-3 p-4">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-[var(--muted)]">
                  {formatDate(item.created_at)} · {item.mime_type}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => copyUrl(item)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="size-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> Copy URL
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="rounded-xl border border-[var(--border)] p-2 text-[var(--muted)] hover:border-[var(--danger)] hover:text-[var(--danger)]"
                  aria-label="Delete"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {media.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-10 text-center text-sm text-[var(--muted)]">
          No media items yet.
        </p>
      ) : null}
    </div>
  );
}

function guessMime(url: string): string {
  const lower = url.toLowerCase();
  if (lower.startsWith("data:")) {
    return lower.slice(5).split(";")[0] || "image/png";
  }
  if (lower.includes(".png")) return "image/png";
  if (lower.includes(".webp")) return "image/webp";
  if (lower.includes(".gif")) return "image/gif";
  if (lower.includes(".svg")) return "image/svg+xml";
  return "image/jpeg";
}

