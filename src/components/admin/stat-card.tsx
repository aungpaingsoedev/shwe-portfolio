"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: number | string;
  icon: ReactNode;
  hint?: string;
  className?: string;
  index?: number;
};

export function StatCard({
  label,
  value,
  icon,
  hint,
  className,
  index = 0,
}: StatCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: reducedMotion ? 0 : Math.min(index * 0.05, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={reducedMotion ? undefined : { y: -2 }}
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
            {label}
          </p>
          <p className="font-semibold text-3xl tracking-tight text-[var(--foreground)]">
            {value}
          </p>
          {hint ? (
            <p className="text-xs text-[var(--muted-foreground)]">{hint}</p>
          ) : null}
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
