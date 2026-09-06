"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StickyNote } from "@/components/ui/sticky-note";
import { PencilUnderline } from "@/components/ui/pencil-underline";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  marginNote?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
};

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  marginNote,
  align = "left",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const animate = mounted && !reducedMotion;

  return (
    <motion.div
      className={cn(
        "relative max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
      variants={animate ? container : undefined}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "visible" : undefined}
      viewport={{ once: true, amount: 0.4 }}
    >
      {marginNote ? (
        <motion.div
          className="absolute -top-2 right-0 z-10 hidden lg:block xl:-right-32"
          variants={animate ? item : undefined}
          aria-hidden
        >
          <StickyNote size="sm" rotate="right">
            {marginNote}
          </StickyNote>
        </motion.div>
      ) : null}

      {eyebrow ? (
        <motion.p
          className="eyebrow mb-3"
          variants={animate ? item : undefined}
        >
          {eyebrow}
        </motion.p>
      ) : null}

      <motion.div variants={animate ? item : undefined}>
        <Tag className="relative inline-block max-w-full font-hand text-[2rem] text-[var(--ink)] sm:text-[2.6rem] md:text-[3rem] md:leading-[1.08]">
          <span className="relative z-[1]">{title}</span>
          <PencilUnderline className="bottom-[-0.08em] h-[0.28em]" delay={0.28} />
        </Tag>
      </motion.div>

      {description ? (
        <motion.p
          className={cn(
            "mt-3 max-w-xl text-[0.95rem] leading-relaxed text-[var(--muted)] sm:mt-4 sm:text-base",
            align === "center" && "mx-auto",
          )}
          variants={animate ? item : undefined}
        >
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
