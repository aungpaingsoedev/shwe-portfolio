import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import {
  getProfile,
  getProjectBySlug,
  getPublishedProjects,
  getSiteCopy,
} from "@/lib/data/content";
import { absoluteUrl, formatDate } from "@/lib/utils";
import { SiteShell } from "@/components/layout/site-shell";
import { Reveal, StaggerChildren } from "@/components/animations/reveal";
import { CaseStudySections } from "@/components/projects/case-study-sections";
import { ProjectLifecycle } from "@/components/projects/project-lifecycle";
import { InkArrow } from "@/components/ui/ink-arrow";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project" };

  return {
    title: project.title,
    description: project.short_description,
    openGraph: {
      title: project.title,
      description: project.short_description,
      images: project.cover_image ? [{ url: project.cover_image }] : undefined,
      url: absoluteUrl(`/projects/${project.slug}`),
    },
  };
}

export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, profile, allProjects, copy] = await Promise.all([
    getProjectBySlug(slug),
    getProfile(),
    getPublishedProjects(),
    getSiteCopy(),
  ]);

  if (!project) notFound();

  const index = allProjects.findIndex((p) => p.id === project.id);
  const prev = index > 0 ? allProjects[index - 1] : null;
  const next =
    index >= 0 && index < allProjects.length - 1
      ? allProjects[index + 1]
      : null;

  return (
    <SiteShell
      name={profile.full_name}
      tagline={profile.tagline}
      resumeUrl={profile.resume_url}
      footerStickyNote={copy.footer_sticky_note}
      showLoader={false}
    >
      <article className="pb-24 pt-28 md:pt-32">
        <div className="container-page">
          <Reveal>
            <Link
              href="/projects"
              className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            >
              <InkArrow direction="left" className="size-4" />
              All projects
            </Link>
          </Reveal>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <Reveal>
              <div className="space-y-5">
                <p className="eyebrow">
                  {project.role} · {project.industry}
                </p>
                <h1 className="font-hand text-[2.5rem] leading-[1.1] text-[var(--foreground)] md:text-[3.35rem] lg:text-[3.75rem]">
                  {project.title}
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-[var(--muted)]">
                  {project.short_description}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="border-b border-dashed border-[var(--ink-faint)] pb-0.5 text-xs text-[var(--muted)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.external_url ? (
                  <a
                    href={project.external_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]"
                  >
                    Visit project <ExternalLink className="size-4" />
                  </a>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
                {project.cover_image ? (
                  <Image
                    src={project.cover_image}
                    alt={project.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[var(--accent-soft)] text-[var(--accent)]">
                    Case Study
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                label: "Responsibilities",
                items: project.responsibilities,
              },
              { label: "Impact", items: project.achievements },
              {
                label: "Categories",
                items: project.categories,
              },
            ].map((block) => (
              <Reveal key={block.label}>
                <div className="paper-panel h-full p-5 sm:p-6">
                  <p className="eyebrow mb-4">{block.label}</p>
                  <ul className="space-y-2">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm leading-relaxed text-[var(--foreground)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <ProjectLifecycle
            stages={
              project.case_study?.lifecycle_stages || [
                "Idea",
                "Strategy",
                "Requirements",
                "Delivery",
                "Impact",
              ]
            }
          />

          {project.case_study ? (
            <CaseStudySections caseStudy={project.case_study} />
          ) : null}

          {project.images && project.images.length > 0 ? (
            <section className="mt-20">
              <h2 className="font-hand mb-8 text-[2rem] sm:text-3xl">
                Gallery
              </h2>
              <StaggerChildren className="grid gap-4 md:grid-cols-2">
                {project.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-[16/10] overflow-hidden border border-[var(--border)]"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </StaggerChildren>
            </section>
          ) : null}

          <nav className="mt-20 flex flex-col gap-4 border-t border-[var(--border)] pt-10 sm:flex-row sm:justify-between">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group flex max-w-sm flex-col gap-1"
              >
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  Previous
                </span>
                <span className="inline-flex items-center gap-2 font-medium text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                  <InkArrow direction="left" className="size-4" />
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group flex max-w-sm flex-col gap-1 sm:items-end sm:text-right"
              >
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  Next
                </span>
                <span className="inline-flex items-center gap-2 font-medium text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                  {next.title}
                  <InkArrow direction="up-right" tone="accent" className="size-4" />
                </span>
              </Link>
            ) : null}
          </nav>

          <p className="mt-8 text-xs text-[var(--muted-foreground)]">
            Published {formatDate(project.published_at)}
          </p>
        </div>
      </article>
    </SiteShell>
  );
}
