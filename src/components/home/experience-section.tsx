"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import type { Experience, SectionCopy } from "@/types";
import { cn, formatMonthYear } from "@/lib/utils";
import { Reveal } from "@/components/animations/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { InkArrow, InkChevron } from "@/components/ui/ink-arrow";

type ExperienceSectionProps = {
  experiences: Experience[];
  section: SectionCopy;
};

function isMetricAchievement(text: string): boolean {
  return /\d+%|\d+\s*%|reduced|improved|achieved|savings|satisfaction|delays/i.test(
    text,
  );
}

function ExperienceCard({
  experience,
  index,
  open,
  onToggle,
}: {
  experience: Experience;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const dateRange = `${formatMonthYear(experience.start_date)} — ${
    experience.is_current || !experience.end_date
      ? "Present"
      : formatMonthYear(experience.end_date)
  }`;
  const isKbz = /kbz/i.test(experience.company);

  return (
    <Reveal
      delay={Math.min(index * 0.06, 0.3)}
      className="relative pl-9 sm:pl-11"
    >
      <span
        className={cn(
          "absolute left-0 top-5 z-10 -translate-x-1/2",
          experience.is_current ? "text-[var(--accent)]" : "text-[var(--muted)]",
        )}
        aria-hidden
      >
        <InkArrow
          direction="right"
          tone={experience.is_current ? "accent" : "ink"}
          className="size-4"
        />
      </span>

      <article className="overflow-hidden">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-start justify-between gap-4 border-b border-[var(--border)] py-4 text-left transition-colors hover:border-[var(--accent)]/40 sm:py-5"
        >
          <div className="min-w-0 space-y-1">
            <p className="font-hand text-sm text-[var(--accent)]">{dateRange}</p>
            <h3 className="text-lg font-semibold tracking-tight text-[var(--foreground)] sm:text-xl">
              {experience.position}
            </h3>
            <p className="text-sm text-[var(--muted)]">
              {experience.company}
              {experience.location ? (
                <span>
                  {" "}
                  · {experience.location}
                </span>
              ) : null}
            </p>
          </div>
          <motion.span
            className="mt-0.5 flex size-8 shrink-0 items-center justify-center text-[var(--muted)]"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <InkChevron className="size-4" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              initial={reducedMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-5 border-b border-dashed border-[var(--border)] pb-5 pt-4">
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {experience.summary}
                </p>

                {experience.responsibilities.length > 0 ? (
                  <div>
                    <p className="eyebrow mb-2.5">Responsibilities</p>
                    <ul className="space-y-1.5">
                      {experience.responsibilities.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-sm leading-relaxed text-[var(--foreground)]"
                        >
                          <span
                            className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--accent)]"
                            aria-hidden
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {experience.achievements.length > 0 ? (
                  <div>
                    <p className="eyebrow mb-2.5">Achievements</p>
                    <div
                      className={cn(
                        "grid gap-2",
                        isKbz ? "sm:grid-cols-3" : "sm:grid-cols-2",
                      )}
                    >
                      {experience.achievements.map((item) => {
                        const highlight = isKbz || isMetricAchievement(item);
                        return (
                          <div
                            key={item}
                            className={cn(
                              "border-l-2 px-3 py-2 text-sm leading-snug",
                              highlight
                                ? "border-[var(--accent)] bg-[var(--accent-soft)]/50 text-[var(--accent)]"
                                : "border-[var(--ink-faint)] text-[var(--foreground)]",
                            )}
                          >
                            {highlight ? (
                              <p className="font-semibold text-[0.95rem] tracking-tight sm:text-base">
                                {item}
                              </p>
                            ) : (
                              item
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {experience.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {experience.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs text-[var(--muted-foreground)]"
                      >
                        {tech}
                        <span className="mx-1.5 text-[var(--border-strong)]">
                          ·
                        </span>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </article>
    </Reveal>
  );
}

export function ExperienceSection({
  experiences,
  section,
}: ExperienceSectionProps) {
  const reducedMotion = useReducedMotion();
  const sorted = [...experiences].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const [openId, setOpenId] = useState<string | null>(
    sorted[0]?.id ?? null,
  );

  return (
    <section id="experience" className="section-y scroll-mt-28">
      <div className="container-page">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          marginNote={section.margin_note}
        />

        <div className="relative mt-12 sm:mt-14">
          <motion.div
            aria-hidden
            className="absolute left-0 top-0 bottom-0 w-px origin-top bg-[var(--ink-faint)]"
            initial={reducedMotion ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="space-y-1">
            {sorted.map((experience, index) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                index={index}
                open={openId === experience.id}
                onToggle={() =>
                  setOpenId((current) =>
                    current === experience.id ? null : experience.id,
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
