import Link from "next/link";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
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
          New project
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Add a portfolio case study with delivery narrative.
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}
