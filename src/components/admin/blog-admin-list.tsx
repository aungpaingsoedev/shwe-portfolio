"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  DataTable,
  DataTableCell,
  DataTableRow,
} from "@/components/admin/data-table";
import { deletePostAction, upsertPostAction } from "@/app/admin/actions";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

export function BlogAdminList({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const remove = (id: string) => {
    if (!window.confirm("Delete this post?")) return;
    startTransition(async () => {
      await deletePostAction(id);
      router.refresh();
    });
  };

  const togglePublish = (post: BlogPost) => {
    const nextStatus = post.status === "published" ? "draft" : "published";
    const now = new Date().toISOString();
    startTransition(async () => {
      await upsertPostAction({
        ...post,
        status: nextStatus,
        published_at:
          nextStatus === "published" ? post.published_at || now : post.published_at,
        updated_at: now,
      });
      router.refresh();
    });
  };

  return (
    <DataTable
      columns={[
        { key: "title", header: "Post" },
        { key: "status", header: "Status" },
        { key: "views", header: "Views" },
        { key: "updated", header: "Updated" },
        { key: "actions", header: "Actions", className: "text-right" },
      ]}
      empty={posts.length === 0 ? "No posts yet." : undefined}
    >
      {posts.map((post) => (
        <DataTableRow key={post.id} className={pending ? "opacity-70" : undefined}>
          <DataTableCell>
            <div>
              <p className="font-medium">{post.title}</p>
              <p className="text-xs text-[var(--muted)]">{post.slug}</p>
            </div>
          </DataTableCell>
          <DataTableCell>
            <span
              className={
                post.status === "published"
                  ? "rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]"
                  : "rounded-full bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] px-2.5 py-1 text-xs font-medium text-[var(--muted)]"
              }
            >
              {post.status}
            </span>
          </DataTableCell>
          <DataTableCell className="text-[var(--muted)]">{post.views}</DataTableCell>
          <DataTableCell className="text-[var(--muted)]">
            {formatDate(post.updated_at)}
          </DataTableCell>
          <DataTableCell>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => togglePublish(post)}
                className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {post.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <Link
                href={`/admin/blog/${post.id}`}
                className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                aria-label="Edit"
              >
                <Pencil className="size-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => remove(post.id)}
                className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--muted)] hover:border-[var(--danger)] hover:text-[var(--danger)]"
                aria-label="Delete"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </DataTableCell>
        </DataTableRow>
      ))}
    </DataTable>
  );
}
