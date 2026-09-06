"use client";

import NextImage from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Education, Profile, SiteCopy } from "@/types";
import { Reveal, StaggerChildren } from "@/components/animations/reveal";
import { AnimatedCounter } from "@/components/animations/counter";
import { SectionHeading } from "@/components/ui/section-heading";

type AboutSectionProps = {
  profile: Profile;
  educations?: Education[];
  copy: SiteCopy;
};

export function AboutSection({
  profile,
  educations = [],
  copy,
}: AboutSectionProps) {
  const reducedMotion = useReducedMotion();
  const lines =
    profile.about_title_lines?.length > 0
      ? profile.about_title_lines
      : ["Business mindset.", "Technical foundation.", "Product thinking."];

  const portrait = profile.avatar_url || "/images/shwe-yi-mon.jpg";
  const sortedEducation = [...educations].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const bridge = copy.about_bridge_labels.length
    ? copy.about_bridge_labels
    : ["Business", "Product", "Technology"];

  return (
    <section id="about" className="section-y scroll-mt-28">
      <div className="container-page">
        <SectionHeading
          eyebrow={copy.about.eyebrow}
          title={copy.about.title}
          description={copy.about.description}
          marginNote={copy.about.margin_note}
        />

        <div className="mt-12 grid items-start gap-10 lg:mt-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div className="relative mx-auto w-full max-w-[18.5rem] lg:mx-0 lg:max-w-[22rem]">
              <motion.figure
                className="photo-on-paper"
                initial={
                  reducedMotion ? false : { opacity: 0, y: 18, rotate: -4 }
                }
                whileInView={{ opacity: 1, y: 0, rotate: -1.6 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="photo-on-paper__frame">
                  <motion.div
                    className="absolute inset-0"
                    initial={reducedMotion ? false : { scale: 1.05 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <NextImage
                      src={portrait}
                      alt={profile.full_name}
                      fill
                      priority
                      className="object-cover object-[center_12%]"
                      sizes="(max-width: 1024px) 80vw, 360px"
                    />
                  </motion.div>
                </div>
                <figcaption className="photo-on-paper__caption">
                  <p className="font-hand text-[1.45rem] leading-none sm:text-[1.6rem]">
                    {profile.full_name}
                  </p>
                  <p className="mt-1 text-[0.7rem] tracking-wide text-[color-mix(in_oklab,var(--photo-caption)_70%,transparent)] sm:text-xs">
                    {profile.role}
                  </p>
                </figcaption>
              </motion.figure>
            </div>
          </Reveal>

          <div className="flex flex-col justify-center space-y-7 lg:pt-2">
            <Reveal delay={0.06}>
              <div className="space-y-1">
                {lines.map((line) => (
                  <p
                    key={line}
                    className="font-hand text-[1.85rem] text-[var(--ink)] sm:text-[2.4rem] lg:text-[2.75rem]"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="space-y-4">
                <div className="ink-rule max-w-md" aria-hidden />
                <p className="max-w-lg text-[0.95rem] leading-relaxed text-[var(--muted)] sm:text-base">
                  {profile.bio}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[0.8rem] text-[var(--muted)]">
                {bridge.map((label, index) => (
                  <span key={label} className="inline-flex items-center gap-2">
                    {index > 0 ? (
                      <span
                        aria-hidden
                        className="text-[var(--muted-foreground)]"
                      >
                        /
                      </span>
                    ) : null}
                    <span
                      className={
                        index === 1
                          ? "text-[var(--accent)]"
                          : "text-[var(--foreground)]"
                      }
                    >
                      {label}
                    </span>
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {sortedEducation.length > 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-12 sm:mt-14">
              <div className="mb-5 flex items-center gap-3">
                <p className="eyebrow">{copy.education_eyebrow}</p>
                <div className="ink-rule flex-1" aria-hidden />
              </div>

              <ul className="space-y-3">
                {sortedEducation.map((item) => {
                  const years =
                    item.start_year && item.end_year
                      ? `${item.start_year} — ${item.end_year}`
                      : item.start_year
                        ? `${item.start_year} — Present`
                        : null;

                  return (
                    <li
                      key={item.id}
                      className="flex gap-3 text-[0.95rem] leading-snug text-[var(--foreground)] sm:text-base"
                    >
                      <span
                        aria-hidden
                        className="mt-[0.45em] size-1.5 shrink-0 bg-[var(--ink)]"
                      />
                      <div className="min-w-0">
                        <p>
                          <span className="font-semibold tracking-tight">
                            {item.degree}
                          </span>
                          <span className="text-[var(--muted)]">, </span>
                          <span className="italic text-[var(--muted)]">
                            {item.school}
                          </span>
                          {years ? (
                            <span className="text-[var(--muted-foreground)]">
                              {" "}
                              ({years})
                            </span>
                          ) : null}
                        </p>
                        {item.note ? (
                          <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                            {item.note}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        ) : null}

        <StaggerChildren
          className="mt-12 grid gap-px border border-[var(--border)] bg-[var(--border)] sm:mt-16 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.08}
        >
          <AnimatedCounter
            value={profile.years_it}
            suffix="+"
            label={copy.stats_labels.years_it}
          />
          <AnimatedCounter
            value={profile.years_dev}
            suffix="+"
            label={copy.stats_labels.years_dev}
          />
          <AnimatedCounter
            value={profile.years_pm}
            suffix="+"
            label={copy.stats_labels.years_pm}
          />
          <div className="bg-[var(--surface)] px-5 py-6">
            <p className="font-hand text-2xl text-[var(--accent)] sm:text-3xl">
              {profile.industry_focus || "Banking"}
            </p>
            <p className="mt-1.5 text-sm text-[var(--muted)]">
              {copy.stats_labels.industry}
            </p>
          </div>
        </StaggerChildren>
      </div>
    </section>
  );
}
