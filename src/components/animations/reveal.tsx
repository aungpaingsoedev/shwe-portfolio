"use client";

import {
  Children,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

type RevealProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
  ...props
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  const mounted = useHasMounted();
  const animate = mounted && !reducedMotion;

  return (
    <motion.div
      className={className}
      initial={animate ? { opacity: 0, y } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once, amount: 0.25 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerChildrenProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  once?: boolean;
};

const staggerContainer = (stagger: number, delay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function StaggerChildren({
  children,
  className,
  stagger = 0.08,
  delay = 0.05,
  once = true,
}: StaggerChildrenProps) {
  const reducedMotion = useReducedMotion();
  const mounted = useHasMounted();
  const animate = mounted && !reducedMotion;

  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
    >
      {Children.map(children, (child) => (
        <motion.div variants={staggerItem}>{child}</motion.div>
      ))}
    </motion.div>
  );
}

type FadeInProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
};

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.55,
  once = true,
  ...props
}: FadeInProps) {
  const reducedMotion = useReducedMotion();
  const mounted = useHasMounted();
  const animate = mounted && !reducedMotion;

  return (
    <motion.div
      className={cn(className)}
      initial={animate ? { opacity: 0 } : false}
      whileInView={animate ? { opacity: 1 } : undefined}
      viewport={{ once, amount: 0.3 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
