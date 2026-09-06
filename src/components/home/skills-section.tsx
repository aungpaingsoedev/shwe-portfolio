import type { SectionCopy, Skill, SkillCategory } from "@/types";
import { Reveal, StaggerChildren } from "@/components/animations/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

type SkillsSectionProps = {
  categories: SkillCategory[];
  skills: Skill[];
  section: SectionCopy;
};

export function SkillsSection({
  categories,
  skills,
  section,
}: SkillsSectionProps) {
  const sortedCategories = [...categories].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return (
    <section id="skills" className="section-y scroll-mt-28">
      <div className="container-page">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          marginNote={section.margin_note}
        />

        <div className="mt-12 space-y-8 sm:mt-14">
          {sortedCategories.map((category, index) => {
            const categorySkills = skills
              .filter((skill) => skill.category_id === category.id)
              .sort((a, b) => a.sort_order - b.sort_order);

            if (categorySkills.length === 0) return null;

            return (
              <Reveal key={category.id} delay={Math.min(index * 0.04, 0.2)}>
                <div className="space-y-3 border-b border-[var(--border)] pb-8 last:border-b-0 last:pb-0">
                  <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                    {category.name}
                  </h3>
                  <StaggerChildren
                    className="flex flex-wrap gap-x-3 gap-y-2"
                    stagger={0.03}
                    delay={0.02}
                  >
                    {categorySkills.map((skill) => (
                      <span
                        key={skill.id}
                        className="border-b border-dashed border-[var(--ink-faint)] pb-0.5 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </StaggerChildren>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
