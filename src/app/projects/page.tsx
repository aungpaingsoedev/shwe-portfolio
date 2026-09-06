import type { Metadata } from "next";
import { getProfile, getPublishedProjects, getSiteCopy } from "@/lib/data/content";
import { SiteShell } from "@/components/layout/site-shell";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected projects spanning project management, product ownership, banking transformation, data, and software delivery.",
};

export default async function ProjectsPage() {
  const [projects, profile, copy] = await Promise.all([
    getPublishedProjects(),
    getProfile(),
    getSiteCopy(),
  ]);

  return (
    <SiteShell
      name={profile.full_name}
      tagline={profile.tagline}
      resumeUrl={profile.resume_url}
      footerStickyNote={copy.footer_sticky_note}
      showLoader={false}
    >
      <section className="pb-20 pt-28 md:pb-28 md:pt-32">
        <div className="container-page mb-12">
          <SectionHeading
            eyebrow={copy.projects_page.eyebrow}
            title={copy.projects_page.title}
            description={copy.projects_page.description}
            align="left"
            className="max-w-3xl"
            marginNote={copy.projects_page.margin_note}
          />
        </div>
        <div className="container-page">
          <ProjectsGrid projects={projects} />
        </div>
      </section>
    </SiteShell>
  );
}
