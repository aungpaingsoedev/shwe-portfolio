"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/types";
import { FadeIn } from "@/components/animations/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import {
  ProjectFilters,
  type ProjectFilter,
} from "@/components/projects/project-filters";

type ProjectsGridProps = {
  projects: Project[];
};

function matchesFilter(project: Project, filter: ProjectFilter): boolean {
  if (filter === "All") return true;

  const haystack = [
    ...project.categories,
    project.industry,
    project.role,
    ...project.technologies,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(filter.toLowerCase());
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [filter, setFilter] = useState<ProjectFilter>("All");

  const filtered = useMemo(
    () =>
      [...projects]
        .filter((project) => project.status === "published")
        .filter((project) => matchesFilter(project, filter))
        .sort((a, b) => a.sort_order - b.sort_order),
    [projects, filter],
  );

  return (
    <div className="space-y-10">
      <ProjectFilters value={filter} onChange={setFilter} />

      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div
            key={filter}
            layout
            className="grid gap-6 md:grid-cols-2 md:gap-8"
          >
            {filtered.map((project, index) => (
              <FadeIn key={project.id} delay={Math.min(index * 0.05, 0.3)}>
                <ProjectCard project={project} index={index} />
              </FadeIn>
            ))}
          </motion.div>
        ) : (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="journal-entry px-6 py-16 text-center font-hand text-lg text-[var(--journal-muted,#6e675c)]"
          >
            No projects match this filter yet.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
