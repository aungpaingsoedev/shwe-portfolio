import { ExperienceAdmin } from "@/components/admin/experience-admin";
import { getExperiences } from "@/lib/data/content";

export default async function AdminExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-3xl tracking-tight">Experience</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Manage career timeline entries.
        </p>
      </div>
      <ExperienceAdmin experiences={experiences} />
    </div>
  );
}
