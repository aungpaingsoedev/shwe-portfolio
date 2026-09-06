"use client";

import { useEffect, useMemo, useState } from "react";
import { LinkIcon, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { absoluteUrl, cn } from "@/lib/utils";

type Heading = { id: string; text: string; level: number };

function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split("\n");
  const headings: Heading[] = [];
  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const text = match[2].replace(/[*_`]/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level: match[1].length });
  }
  return headings;
}

export function ArticleReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const article = document.getElementById("article-body");
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = article.offsetHeight - window.innerHeight;
      const scrolled = Math.min(
        Math.max(-rect.top, 0),
        Math.max(total, 1),
      );
      setProgress((scrolled / Math.max(total, 1)) * 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent">
      <div
        className="h-full bg-[var(--accent)] transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function TableOfContents({ content }: { content: string }) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  if (!headings.length) return null;

  return (
    <nav aria-label="Table of contents" className="glass sticky top-28 rounded-2xl p-5">
      <p className="eyebrow mb-3">On this page</p>
      <ul className="space-y-2">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "block text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]",
                h.level === 3 && "pl-3",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ArticleBody({ content }: { content: string }) {
  return (
    <div id="article-body" className="prose-article">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function ShareButtons({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const url = absoluteUrl(`/blog/${slug}`);
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
        Share
      </span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        aria-label="Share on X"
      >
        <Share2 className="size-4" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        aria-label="Share on LinkedIn"
      >
        <span className="text-[10px] font-bold tracking-tight">in</span>
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        aria-label="Copy link"
      >
        <LinkIcon className="size-4" />
      </button>
    </div>
  );
}
