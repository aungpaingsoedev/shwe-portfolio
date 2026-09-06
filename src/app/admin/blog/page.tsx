import { Plus } from "lucide-react";
import { BlogAdminList } from "@/components/admin/blog-admin-list";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/lib/data/content";

export default async function AdminBlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-semibold text-3xl tracking-tight">Blog</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Draft and publish articles.
          </p>
        </div>
        <Button href="/admin/blog/new" size="sm">
          <Plus className="size-4" />
          New post
        </Button>
      </div>
      <BlogAdminList posts={posts} />
    </div>
  );
}
