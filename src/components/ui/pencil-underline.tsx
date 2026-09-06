"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type PencilUnderlineProps = {
  className?: string;
  /** Animate stroke drawing when visible */
  animate?: boolean;
  delay?: number;
  tone?: "accent" | "ink";
  /** thinner stroke for nav links */
  weight?: "thin" | "md";
};

/** Hand-drawn pencil underline — slightly uneven stroke */
export function PencilUnderline({
  className,
  animate = true,
  delay = 0.15,
  tone = "accent",
  weight = "md",
}: PencilUnderlineProps) {
  const reducedMotion = useReducedMotion();
  const stroke = tone === "accent" ? "var(--accent)" : "var(--ink)";
  const strokeWidth = weight === "thin" ? 1.4 : 2;

  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-[0.35em] w-full overflow-visible",
        className,
      )}
      viewBox="0 0 120 8"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
    >
      <motion.path
        d="M2 5.2c18-.9 36 .6 54-.2 16-.7 28.5.5 42-.1 7-.3 14 .2 20 .5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.85}
        initial={
          !animate || reducedMotion
            ? { pathLength: 1, opacity: 0.85 }
            : { pathLength: 0, opacity: 0 }
        }
        whileInView={
          !animate || reducedMotion
            ? undefined
            : { pathLength: 1, opacity: 0.85 }
        }
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          pathLength: {
            duration: 0.7,
            delay,
            ease: [0.22, 1, 0.36, 1],
          },
          opacity: { duration: 0.15, delay },
        }}
      />
      {/* faint second pass — graphite grain */}
      <motion.path
        d="M3 5.8c20-.4 38 .3 56-.15 14-.4 27 .35 41 0 6-.15 12 .25 18 .4"
        stroke={stroke}
        strokeWidth={strokeWidth * 0.55}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.35}
        initial={
          !animate || reducedMotion
            ? { pathLength: 1 }
            : { pathLength: 0 }
        }
        whileInView={
          !animate || reducedMotion ? undefined : { pathLength: 1 }
        }
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          duration: 0.55,
          delay: delay + 0.12,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </svg>
  );
}
