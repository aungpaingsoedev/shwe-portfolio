"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CaseStudy } from "@/types";
import { Reveal } from "@/components/animations/reveal";

const SECTIONS: { key: keyof CaseStudy; number: string; title: string }[] = [
  { key: "challenge", number: "01", title: "Challenge" },
  { key: "discovery", number: "02", title: "Discovery" },
  { key: "requirements", number: "03", title: "Requirements" },
  { key: "strategy", number: "04", title: "Strategy" },
  { key: "execution", number: "05", title: "Execution" },
  { key: "collaboration", number: "06", title: "Collaboration" },
  { key: "solution", number: "07", title: "Solution" },
  { key: "results", number: "08", title: "Results" },
  { key: "lessons_learned", number: "09", title: "Lessons Learned" },
];

export function CaseStudySections({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <section className="mt-20 space-y-6">
      <Reveal>
        <h2 className="font-hand text-[2rem] md:text-[2.5rem]">
          Case study narrative
        </h2>
      </Reveal>
      <div className="space-y-4">
        {SECTIONS.map((section, index) => {
          const content = caseStudy[section.key];
          if (typeof content !== "string" || !content) return null;
          return (
            <Reveal key={section.key} delay={index * 0.04}>
              <article className="glass grid gap-4 rounded-[1.5rem] p-6 md:grid-cols-[7rem_1fr] md:gap-8 md:p-8">
                <div>
                  <p className="font-mono text-sm text-[var(--accent)]">
                    {section.number}
                  </p>
                  <h3 className="mt-1 text-base font-semibold tracking-tight">
                    {section.title}
                  </h3>
                </div>
                <p className="text-[0.98rem] leading-relaxed text-[var(--muted)] md:pt-1">
                  {content}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function ProjectLifecycle({ stages }: { stages: string[] }) {
  const reduced = useReducedMotion();

  return (
    <section className="mt-20">
      <Reveal>
        <div className="mb-8">
          <p className="eyebrow">Lifecycle</p>
          <h2 className="font-hand mt-2 text-[2rem]">
            From idea to impact
          </h2>
        </div>
      </Reveal>
      <div className="relative">
        <div className="absolute left-0 right-0 top-5 hidden h-px bg-[var(--border)] md:block" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          {stages.map((stage, i) => (
            <motion.div
              key={stage}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--accent)] md:relative md:z-10">
                {String(i + 1).padStart(2, "0")}
              </div>
              <p className="text-sm font-medium tracking-wide text-[var(--foreground)]">
                {stage}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
