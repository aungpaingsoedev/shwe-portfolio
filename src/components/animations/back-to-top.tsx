"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { InkArrow } from "@/components/ui/ink-arrow";
import { cn } from "@/lib/utils";

type BackToTopProps = {
  threshold?: number;
  className?: string;
};

export function BackToTop({ threshold = 420, className }: BackToTopProps) {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={scrollTop}
          className={cn(
            "sticky-note sticky-note-btn fixed right-5 bottom-5 z-50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
            "md:right-8 md:bottom-8",
            className,
          )}
          initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <InkArrow direction="up" className="size-5 text-[var(--sticky-ink,#1a5c4c)]" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
