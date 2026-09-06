"use client";

import {
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

export function Magnetic({
  children,
  className,
  strength = 8,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.35 });

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    const max = Math.min(Math.abs(strength), 8);
    x.set(Math.max(-max, Math.min(max, offsetX * 0.25)));
    y.set(Math.max(-max, Math.min(max, offsetY * 0.25)));
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (reducedMotion) {
    return (
      <div ref={ref} className={cn("inline-flex", className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex will-change-transform", className)}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}
