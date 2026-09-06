import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatMonthYear(date: string | null | undefined): string {
  if (!date) return "Present";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export function readingTimeFromContent(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("your-anon"),
  );
}

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL ?? "";
  return Boolean(
    url.startsWith("postgres") &&
      !url.includes("YOUR_PASSWORD") &&
      !url.includes("your-password"),
  );
}

/** True when content is served from local JSON (no Prisma DATABASE_URL). */
export function usingLocalData(): boolean {
  return !isDatabaseConfigured();
}

export function absoluteUrl(path = ""): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function excerpt(text: string, length = 160): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}…`;
}
