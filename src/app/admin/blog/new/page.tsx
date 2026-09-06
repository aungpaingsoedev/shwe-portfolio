import Link from "next/link";
import { BlogForm } from "@/components/admin/blog-form";
import { getBlogCategories } from "@/lib/data/content";

export default async function NewBlogPostPage() {
  const categories = await getBlogCategories();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ← Blog
        </Link>
        <h1 className="mt-2 font-semibold text-3xl tracking-tight">New post</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Write and publish a new article.
        </p>
      </div>
      <BlogForm categories={categories} />
    </div>
  );
}
