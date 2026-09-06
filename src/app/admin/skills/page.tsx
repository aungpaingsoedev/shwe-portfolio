import { SkillsAdmin } from "@/components/admin/skills-admin";
import { getSkills } from "@/lib/data/content";

export default async function AdminSkillsPage() {
  const { categories, skills } = await getSkills();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-3xl tracking-tight">Skills</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Organize skills by category and proficiency.
        </p>
      </div>
      <SkillsAdmin categories={categories} skills={skills} />
    </div>
  );
}
