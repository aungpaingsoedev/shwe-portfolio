import type { Metadata } from "next";
import { getProfile, getPublishedPosts, getSiteCopy } from "@/lib/data/content";
import { SiteShell } from "@/components/layout/site-shell";
import { BlogCard } from "@/components/blog/blog-card";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thinking Beyond Delivery — essays on project management, product ownership, leadership, and digital transformation.",
};

export default async function BlogPage() {
  const [posts, profile, copy] = await Promise.all([
    getPublishedPosts(),
    getProfile(),
    getSiteCopy(),
  ]);

  return (
    <SiteShell
      name={profile.full_name}
      tagline={profile.tagline}
      resumeUrl={profile.resume_url}
      footerStickyNote={copy.footer_sticky_note}
      showLoader={false}
    >
      <section className="pb-20 pt-28 md:pb-28 md:pt-32">
        <div className="container-page mb-12">
          <SectionHeading
            as="h1"
            eyebrow={copy.blog_page.eyebrow}
            title={copy.blog_page.title}
            description={copy.blog_page.description}
            align="left"
            className="max-w-3xl"
            marginNote={copy.blog_page.margin_note}
          />
        </div>
        <div className="container-page grid gap-6 md:grid-cols-2">
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
