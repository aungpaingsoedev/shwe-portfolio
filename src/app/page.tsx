import {
  getEducations,
  getExperiences,
  getProfile,
  getPublishedPosts,
  getPublishedProjects,
  getSiteCopy,
  getSkills,
} from "@/lib/data/content";
import { SiteShell } from "@/components/layout/site-shell";
import { Hero } from "@/components/home/hero";
import { AboutSection } from "@/components/home/about-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { SkillsSection } from "@/components/home/skills-section";
import { CtaSection } from "@/components/home/cta-section";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { BlogCard } from "@/components/blog/blog-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/animations/reveal";
import Link from "next/link";
import { InkArrow } from "@/components/ui/ink-arrow";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Sequential fetches keep Prisma connection_limit=1 from timing out on Vercel.
  const profile = await getProfile();
  const experiences = await getExperiences();
  const educations = await getEducations();
  const projects = await getPublishedProjects();
  const skillsData = await getSkills();
  const posts = await getPublishedPosts();
  const copy = await getSiteCopy();

  const featuredProjects = projects.slice(0, 4);
  const latestPosts = posts.slice(0, 3);

  return (
    <SiteShell
      name={profile.full_name}
      tagline={profile.tagline}
      resumeUrl={profile.resume_url}
      footerStickyNote={copy.footer_sticky_note}
    >
      <Hero profile={profile} copy={copy} />
      <AboutSection profile={profile} educations={educations} copy={copy} />
      <ExperienceSection experiences={experiences} section={copy.experience} />

      <section id="projects" className="section-y scroll-mt-28">
        <div className="container-page">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow={copy.projects.eyebrow}
              title={copy.projects.title}
              description={copy.projects.description}
              align="left"
              className="max-w-2xl"
              marginNote={copy.projects.margin_note}
            />
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            >
              {copy.projects.view_all_label || "View all"}
              <InkArrow direction="up-right" tone="accent" className="size-3.5" />
            </Link>
          </div>
          <ProjectsGrid projects={featuredProjects} />
        </div>
      </section>

      <SkillsSection
        categories={skillsData.categories}
        skills={skillsData.skills}
        section={copy.skills}
      />

      <section className="section-y">
        <div className="container-page">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow={copy.blog.eyebrow}
              title={copy.blog.title}
              description={copy.blog.description || undefined}
              align="left"
              className="max-w-2xl"
              marginNote={copy.blog.margin_note}
            />
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            >
              {copy.blog.view_all_label || "Read all"}
              <InkArrow direction="up-right" tone="accent" className="size-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {latestPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Reveal>
        <CtaSection
          eyebrow={copy.cta_eyebrow}
          title={copy.cta_title}
          description={copy.cta_description}
          label={copy.cta_button_label}
          stickyNote={copy.cta_sticky_note}
        />
      </Reveal>
    </SiteShell>
  );
}
