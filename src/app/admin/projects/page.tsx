import { Plus } from "lucide-react";
import { ProjectsAdminList } from "@/components/admin/projects-admin-list";
import { Button } from "@/components/ui/button";
import { getAllProjects } from "@/lib/data/content";

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-semibold text-3xl tracking-tight">Projects</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Create, publish, and refine case studies.
          </p>
        </div>
        <Button href="/admin/projects/new" size="sm">
          <Plus className="size-4" />
          New project
        </Button>
      </div>
      <ProjectsAdminList projects={projects} />
    </div>
  );
}
