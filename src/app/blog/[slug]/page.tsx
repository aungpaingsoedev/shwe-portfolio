import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import {
  getPostBySlug,
  getProfile,
  getPublishedPosts,
  getRelatedPosts,
  getSiteCopy,
} from "@/lib/data/content";
import { absoluteUrl, formatDate } from "@/lib/utils";
import { SiteShell } from "@/components/layout/site-shell";
import { Reveal } from "@/components/animations/reveal";
import { BlogCard } from "@/components/blog/blog-card";
import {
  ArticleBody,
  ArticleReadingProgress,
  ShareButtons,
  TableOfContents,
} from "@/components/blog/article-extras";
import { InkArrow } from "@/components/ui/ink-arrow";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article" };

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      type: "article",
      publishedTime: post.published_at || undefined,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
      url: absoluteUrl(`/blog/${post.slug}`),
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [profile, related, allPosts, copy] = await Promise.all([
    getProfile(),
    getRelatedPosts(post),
    getPublishedPosts(),
    getSiteCopy(),
  ]);

  const index = allPosts.findIndex((p) => p.id === post.id);
  const prev = index < allPosts.length - 1 ? allPosts[index + 1] : null;
  const next = index > 0 ? allPosts[index - 1] : null;

  return (
    <SiteShell
      name={profile.full_name}
      tagline={profile.tagline}
      resumeUrl={profile.resume_url}
      footerStickyNote={copy.footer_sticky_note}
      showLoader={false}
    >
      <ArticleReadingProgress />
      <article className="pb-24 pt-28 md:pt-32">
        <div className="container-page">
          <Reveal>
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            >
              <InkArrow direction="left" className="size-4" />
              All articles
            </Link>
          </Reveal>

          <header className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">
              {post.category?.name || "Insights"}
            </p>
            <h1 className="font-hand mt-4 text-[2.5rem] text-[var(--foreground)] md:text-[3.5rem]">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
              {post.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--muted)]">
              <span>{formatDate(post.published_at)}</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {post.reading_time} min read
              </span>
            </div>
          </header>

          {post.cover_image ? (
            <div className="relative mx-auto mt-12 aspect-[21/9] max-w-5xl overflow-hidden border border-[var(--border)]">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1100px"
              />
            </div>
          ) : null}

          <div className="mx-auto mt-14 grid max-w-5xl gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <TableOfContents content={post.content} />
              <div className="mt-6">
                <ShareButtons title={post.title} slug={post.slug} />
              </div>
            </aside>

            <div>
              <ArticleBody content={post.content} />
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-b border-dashed border-[var(--ink-faint)] pb-0.5 text-xs text-[var(--muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-8 lg:hidden">
                <ShareButtons title={post.title} slug={post.slug} />
              </div>
            </div>
          </div>

          <nav className="mx-auto mt-16 flex max-w-5xl flex-col gap-4 border-t border-[var(--border)] pt-10 sm:flex-row sm:justify-between">
            {prev ? (
              <Link href={`/blog/${prev.slug}`} className="group max-w-sm">
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  Previous
                </span>
                <p className="mt-1 inline-flex items-center gap-2 font-medium group-hover:text-[var(--accent)]">
                  <InkArrow direction="left" className="size-4" />
                  {prev.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="group max-w-sm sm:text-right"
              >
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  Next
                </span>
                <p className="mt-1 inline-flex items-center gap-2 font-medium group-hover:text-[var(--accent)] sm:justify-end">
                  {next.title}
                  <InkArrow direction="right" tone="accent" className="size-4" />
                </p>
              </Link>
            ) : null}
          </nav>

          {related.length > 0 ? (
            <section className="mx-auto mt-20 max-w-5xl">
              <h2 className="font-hand mb-8 text-[2rem] sm:text-3xl">
                Related reading
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {related.map((item, i) => (
                  <BlogCard key={item.id} post={item} index={i} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>
    </SiteShell>
  );
}
