"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-4 py-3 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]";

const labelClass =
  "text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]";

type StorageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  folder?: string;
  hint?: string;
  preview?: boolean;
};

export async function uploadAdminFile(
  file: File,
  options?: { folder?: string; name?: string; library?: boolean },
): Promise<{ url: string; path: string }> {
  const body = new FormData();
  body.append("file", file);
  if (options?.folder) body.append("folder", options.folder);
  if (options?.name) body.append("name", options.name);
  body.append("library", options?.library === false ? "0" : "1");

  const res = await fetch("/api/admin/media/upload", {
    method: "POST",
    body,
  });
  const data = (await res.json().catch(() => null)) as {
    url?: string;
    path?: string;
    error?: string;
  } | null;

  if (!res.ok || !data?.url) {
    throw new Error(data?.error || "Upload failed");
  }

  return { url: data.url, path: data.path || "" };
}

export function StorageUploadField({
  label,
  value,
  onChange,
  accept = "image/*",
  folder = "uploads",
  hint = "Upload to Supabase Storage, or paste a URL",
  preview = true,
}: StorageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadAdminFile(file, {
        folder,
        name: file.name,
        library: true,
      });
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const isImage =
    preview &&
    value &&
    (value.startsWith("data:image") ||
      /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(value) ||
      value.includes("/storage/v1/object/public/"));

  return (
    <div className="space-y-2">
      <span className={labelClass}>{label}</span>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          className={cn(fieldClass, "flex-1")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or upload below"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] p-3 text-[var(--muted)] hover:border-[var(--danger)] hover:text-[var(--danger)]"
            aria-label="Clear"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={uploading}
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
        {uploading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Upload className="size-3.5" />
        )}
        {uploading ? "Uploading…" : "Upload file"}
      </label>
      <p className="text-[11px] text-[var(--muted-foreground)]">{hint}</p>
      {error ? (
        <p className="text-xs text-[var(--danger)]">{error}</p>
      ) : null}
      {isImage ? (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="max-h-40 w-full object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}
