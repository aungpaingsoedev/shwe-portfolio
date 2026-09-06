"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "sym-loader-done";

type PageLoaderProps = {
  onComplete?: () => void;
  className?: string;
};

export function PageLoader({ onComplete, className }: PageLoaderProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"name" | "role" | "exit" | "done">(
    "name",
  );
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setPhase("done");
        onComplete?.();
        return;
      }
    } catch {
      // sessionStorage may be unavailable
    }
    setVisible(true);
    // intentionally run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!visible || phase === "done") return;

    if (reducedMotion) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      setPhase("done");
      setVisible(false);
      onComplete?.();
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    if (phase === "name") {
      timers.push(setTimeout(() => setPhase("role"), 900));
    } else if (phase === "role") {
      timers.push(setTimeout(() => setPhase("exit"), 1100));
    } else if (phase === "exit") {
      timers.push(
        setTimeout(() => {
          try {
            sessionStorage.setItem(STORAGE_KEY, "1");
          } catch {
            // ignore
          }
          setVisible(false);
          setPhase("done");
          onComplete?.();
        }, 520),
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [visible, phase, reducedMotion, onComplete]);

  if (!mounted || phase === "done") return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className={cn(
            "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--background)]",
            className,
          )}
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "exit" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden={phase === "exit"}
          role="status"
          aria-live="polite"
        >
          <div className="relative flex min-h-[5.5rem] flex-col items-center justify-center px-6 text-center">
            <AnimatePresence mode="wait">
              {phase === "name" ? (
                <motion.p
                  key="name"
                  className="font-hand text-4xl text-[var(--foreground)] sm:text-6xl"
                  initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  SHWE YI MON
                </motion.p>
              ) : null}

              {phase === "role" || phase === "exit" ? (
                <motion.p
                  key="role"
                  className="eyebrow text-[0.78rem] tracking-[0.22em] text-[var(--muted)] sm:text-xs"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  PROJECT MANAGER • PRODUCT OWNER
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>

          <motion.div
            className="absolute bottom-10 h-px w-24 origin-left bg-[var(--accent)]"
            initial={{ scaleX: 0, opacity: 0.4 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
