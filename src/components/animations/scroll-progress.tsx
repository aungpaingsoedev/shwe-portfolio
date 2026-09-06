"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

type ScrollProgressProps = {
  className?: string;
};

export function ScrollProgress({ className }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  if (!mounted || reducedMotion) {
    if (!mounted) return null;
    return (
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-[color-mix(in_oklab,var(--accent)_25%,transparent)]",
          className,
        )}
        aria-hidden
      >
        <div
          className="h-full origin-left bg-[var(--accent)]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-[color-mix(in_oklab,var(--accent)_20%,transparent)]",
        className,
      )}
      aria-hidden
    >
      <motion.div
        className="h-full origin-left bg-[var(--accent)]"
        style={{ scaleX }}
      />
    </div>
  );
}
