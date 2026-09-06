"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

type CustomCursorProps = {
  className?: string;
};

function isCoarsePointer() {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    !window.matchMedia("(hover: hover)").matches
  );
}

export function CustomCursor({ className }: CustomCursorProps) {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 380, damping: 28, mass: 0.35 });
  const ringY = useSpring(cursorY, { stiffness: 380, damping: 28, mass: 0.35 });

  useEffect(() => {
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || reducedMotion || isCoarsePointer()) {
      setEnabled(false);
      return;
    }

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      setVisible(true);
    };

    const hide = () => setVisible(false);

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select, label, [data-cursor='hover']",
      );
      setHovering(Boolean(interactive));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, [cursorX, cursorY, reducedMotion]);

  if (!enabled) return null;

  return (
    <div
      className={cn(
        "custom-cursor pointer-events-none fixed inset-0 z-[200] hidden md:block",
        className,
      )}
      aria-hidden
    >
      <motion.div
        className="pointer-events-none absolute top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]"
        style={{ x: cursorX, y: cursorY, opacity: visible ? 1 : 0 }}
      />
      <motion.div
        className="pointer-events-none absolute top-0 left-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent)]"
        style={{
          x: ringX,
          y: ringY,
          opacity: visible ? 0.7 : 0,
          scale: hovering ? 1.55 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      />
    </div>
  );
}
