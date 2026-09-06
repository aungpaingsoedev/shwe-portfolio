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
import {
  deleteProjectAction,
  upsertProjectAction,
} from "@/app/admin/actions";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types";

export function ProjectsAdminList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const remove = (id: string) => {
    if (!window.confirm("Delete this project?")) return;
    startTransition(async () => {
      await deleteProjectAction(id);
      router.refresh();
    });
  };

  const togglePublish = (project: Project) => {
    const nextStatus = project.status === "published" ? "draft" : "published";
    const now = new Date().toISOString();
    startTransition(async () => {
      await upsertProjectAction({
        ...project,
        status: nextStatus,
        published_at:
          nextStatus === "published" ? project.published_at || now : project.published_at,
        updated_at: now,
      });
      router.refresh();
    });
  };

  return (
    <DataTable
      columns={[
        { key: "title", header: "Project" },
        { key: "status", header: "Status" },
        { key: "updated", header: "Updated" },
        { key: "actions", header: "Actions", className: "text-right" },
      ]}
      empty={projects.length === 0 ? "No projects yet." : undefined}
    >
      {projects.map((project) => (
        <DataTableRow key={project.id} className={pending ? "opacity-70" : undefined}>
          <DataTableCell>
            <div>
              <p className="font-medium">{project.title}</p>
              <p className="text-xs text-[var(--muted)]">{project.slug}</p>
            </div>
          </DataTableCell>
          <DataTableCell>
            <span
              className={
                project.status === "published"
                  ? "rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]"
                  : "rounded-full bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] px-2.5 py-1 text-xs font-medium text-[var(--muted)]"
              }
            >
              {project.status}
            </span>
          </DataTableCell>
          <DataTableCell className="text-[var(--muted)]">
            {formatDate(project.updated_at)}
          </DataTableCell>
          <DataTableCell>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => togglePublish(project)}
                className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {project.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <Link
                href={`/admin/projects/${project.id}`}
                className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                aria-label="Edit"
              >
                <Pencil className="size-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => remove(project.id)}
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
