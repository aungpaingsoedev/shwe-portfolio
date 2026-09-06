import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogForm } from "@/components/admin/blog-form";
import { getBlogCategories, getPostById } from "@/lib/data/content";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getPostById(id),
    getBlogCategories(),
  ]);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ← Blog
        </Link>
        <h1 className="mt-2 font-semibold text-3xl tracking-tight">Edit post</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{post.title}</p>
      </div>
      <BlogForm post={post} categories={categories} />
    </div>
  );
}
