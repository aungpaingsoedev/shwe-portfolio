"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

type CounterProps = {
  value: number;
  suffix?: string;
  label: string;
  className?: string;
};

export function Counter({
  value,
  suffix = "",
  label,
  className,
}: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;

    if (reducedMotion) {
      setDisplay(value);
      setDone(true);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.35,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
      onComplete: () => setDone(true),
    });

    return () => controls.stop();
  }, [inView, value, reducedMotion]);

  return (
    <motion.div
      ref={ref}
      className={cn("bg-[var(--surface)] px-5 py-6", className)}
      whileHover={reducedMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.22 }}
    >
      <motion.p
        className="font-hand text-2xl tracking-tight text-[var(--foreground)] sm:text-3xl"
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>{display}</span>
        {suffix ? (
          <motion.span
            className="inline-block text-[var(--accent)]"
            animate={
              done && !reducedMotion ? { scale: [1, 1.08, 1] } : { scale: 1 }
            }
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {suffix}
          </motion.span>
        ) : null}
      </motion.p>
      <p className="mt-1.5 text-sm text-[var(--muted)]">{label}</p>
    </motion.div>
  );
}

export { Counter as AnimatedCounter };
