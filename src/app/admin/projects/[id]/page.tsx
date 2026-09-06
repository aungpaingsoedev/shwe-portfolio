import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { getProjectById } from "@/lib/data/content";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/projects"
          className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ← Projects
        </Link>
        <h1 className="mt-2 font-semibold text-3xl tracking-tight">
          Edit project
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{project.title}</p>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}
