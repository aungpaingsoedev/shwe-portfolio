"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { Profile, SiteCopy } from "@/types";
import { cn } from "@/lib/utils";
import { FadeIn, Reveal } from "@/components/animations/reveal";
import { TextReveal } from "@/components/animations/text-reveal";
import { MagneticButton } from "@/components/ui/button";
import { InkArrow, InkArrowLong } from "@/components/ui/ink-arrow";
import { StickyNote } from "@/components/ui/sticky-note";
import { PencilUnderline } from "@/components/ui/pencil-underline";

type HeroProps = {
  profile: Profile;
  copy: SiteCopy;
};

export function Hero({ profile, copy }: HeroProps) {
  const stages = copy.lifecycle_stages.length
    ? copy.lifecycle_stages
    : ["IDEA", "STRATEGY", "REQUIREMENTS", "DELIVERY", "IMPACT"];
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const stageProgress = useTransform(scrollYProgress, [0, 0.55], [0, 1]);
  const cardY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reducedMotion ? 0 : 28],
  );
  const smoothY = useSpring(cardY, { stiffness: 140, damping: 30, mass: 0.4 });
  const [activeStage, setActiveStage] = useState(0);
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    setIsCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setActiveStage(stages.length - 1);
      return;
    }

    let lastScrollDriven = -1;

    const unsubscribe = stageProgress.on("change", (value) => {
      if (value <= 0.02) return;
      const index = Math.min(
        stages.length - 1,
        Math.floor(value * stages.length),
      );
      if (index !== lastScrollDriven) {
        lastScrollDriven = index;
        setActiveStage(index);
      }
    });

    const timer = window.setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 3000);

    return () => {
      unsubscribe();
      window.clearInterval(timer);
    };
  }, [reducedMotion, stageProgress, stages.length]);

  const headline =
    profile.headline || "Turning Complex Ideas Into Products That Work.";
  const subcopy = copy.hero_subcopy.replace(
    "{years_it}",
    String(profile.years_it),
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-[calc(var(--nav-height)+1.75rem)] pb-16 sm:pt-[calc(var(--nav-height)+2.5rem)] sm:pb-24"
    >
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div className="max-w-xl space-y-6 sm:space-y-7">
            <FadeIn>
              <p className="eyebrow">{copy.hero_eyebrow}</p>
            </FadeIn>

            <Reveal delay={0.08}>
              <h1 className="relative inline-block max-w-full font-hand-lg text-[2.35rem] text-[var(--ink)] sm:text-[3.2rem] lg:text-[3.85rem]">
                <TextReveal
                  as="span"
                  text={headline}
                  delay={0.1}
                  stagger={0.045}
                  className="relative z-[1]"
                />
                <PencilUnderline
                  className="bottom-[-0.06em] h-[0.26em]"
                  delay={0.75}
                />
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="max-w-md text-[0.95rem] leading-relaxed text-[var(--muted)] sm:text-base">
                {subcopy}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
                <MagneticButton
                  href="/projects"
                  variant="ink"
                  size="lg"
                  className="gap-2.5 px-0"
                >
                  {copy.hero_cta_primary}
                  <motion.span
                    aria-hidden
                    animate={reducedMotion ? undefined : { x: [0, 4, 0] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <InkArrowLong className="h-3.5 w-12" />
                  </motion.span>
                </MagneticButton>
                <MagneticButton
                  href="/blog"
                  variant="ghost"
                  size="lg"
                  className="gap-1.5 px-0"
                >
                  {copy.hero_cta_secondary}
                  <InkArrow
                    direction="up-right"
                    tone="accent"
                    className="size-3.5"
                  />
                </MagneticButton>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <StickyNote size="sm" rotate="left">
                {copy.hero_sticky_note}
              </StickyNote>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="relative">
            <motion.div
              style={reducedMotion || isCoarse ? undefined : { y: smoothY }}
              className="relative mx-auto w-full max-w-sm will-change-transform lg:ml-auto lg:mr-0"
            >
              <div className="sticky-note sticky-note-panel relative">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="font-hand text-[0.95rem] tracking-wide text-[var(--sticky-ink)]/70">
                    {copy.lifecycle_label}
                  </p>
                  <span className="font-hand text-sm text-[var(--sticky-ink)]">
                    {String(activeStage + 1).padStart(2, "0")} /{" "}
                    {String(stages.length).padStart(2, "0")}
                  </span>
                </div>

                <ol className="space-y-0">
                  {stages.map((stage, index) => {
                    const active = index === activeStage;
                    const passed = index < activeStage;

                    return (
                      <li
                        key={stage}
                        className="relative flex items-center gap-3 py-2"
                      >
                        {index < stages.length - 1 ? (
                          <span
                            aria-hidden
                            className="absolute left-[0.55rem] top-[1.7rem] h-[calc(100%-0.35rem)] w-px bg-[color-mix(in_oklab,var(--sticky-ink)_22%,transparent)]"
                          />
                        ) : null}
                        <span
                          className={cn(
                            "relative z-10 flex size-5 shrink-0 items-center justify-center transition-colors duration-300",
                            active || passed
                              ? "text-[var(--sticky-ink)]"
                              : "text-[color-mix(in_oklab,var(--sticky-ink)_45%,transparent)]",
                          )}
                        >
                          {active ? (
                            <InkArrow
                              direction="right"
                              className="size-3.5 text-[var(--sticky-ink)]"
                            />
                          ) : (
                            <span className="font-hand text-[0.95rem] leading-none">
                              {index + 1}
                            </span>
                          )}
                        </span>
                        <span
                          className={cn(
                            "font-hand text-[1.15rem] leading-none tracking-wide transition-colors duration-300 sm:text-[1.25rem]",
                            active
                              ? "text-[var(--sticky-ink)]"
                              : "text-[color-mix(in_oklab,var(--sticky-ink)_55%,transparent)]",
                          )}
                        >
                          {stage}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-4 flex items-center gap-2 border-t border-dashed border-[color-mix(in_oklab,var(--sticky-ink)_22%,transparent)] pt-3.5 font-hand text-[0.95rem] text-[color-mix(in_oklab,var(--sticky-ink)_72%,transparent)]">
                  <span className="relative flex size-1.5 shrink-0">
                    {!reducedMotion ? (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-[var(--sticky-ink)]/35"
                        animate={{
                          scale: [1, 2.2, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    ) : null}
                    <span className="relative size-1.5 rounded-full bg-[var(--sticky-ink)]" />
                  </span>
                  <span className="truncate">{profile.status_text}</span>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
