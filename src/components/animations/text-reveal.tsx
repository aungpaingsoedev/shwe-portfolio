"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  mode?: "words" | "lines";
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
};

const ease = [0.16, 1, 0.3, 1] as const;

export function TextReveal({
  text,
  as: Tag = "p",
  mode = "words",
  className,
  delay = 0.08,
  stagger = 0.038,
}: TextRevealProps) {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const segments = useMemo(() => {
    if (mode === "lines") {
      return text.split(/\n+/).filter(Boolean);
    }
    return text.split(/(\s+)/).filter((part) => part.length > 0);
  }, [text, mode]);

  if (reducedMotion || !ready) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={cn(className)}>
      <motion.span
        className="inline"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: stagger,
              delayChildren: delay,
            },
          },
        }}
        aria-label={text}
      >
        {segments.map((segment, index) => {
          const isSpace = /^\s+$/.test(segment);

          if (isSpace) {
            return <span key={`space-${index}`}>{segment}</span>;
          }

          if (mode === "lines") {
            return (
              <span key={`line-${index}`} className="block overflow-hidden pb-1">
                <motion.span
                  className="block will-change-transform"
                  variants={{
                    hidden: { y: "115%", opacity: 0, filter: "blur(6px)" },
                    visible: {
                      y: "0%",
                      opacity: 1,
                      filter: "blur(0px)",
                      transition: { duration: 0.7, ease },
                    },
                  }}
                >
                  {segment}
                </motion.span>
              </span>
            );
          }

          return (
            <span
              key={`word-${index}`}
              className="inline-block overflow-hidden align-bottom py-[0.12em]"
            >
              <motion.span
                className="inline-block will-change-transform"
                variants={{
                  hidden: { y: "108%", opacity: 0, filter: "blur(4px)" },
                  visible: {
                    y: "0%",
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: { duration: 0.62, ease },
                  },
                }}
              >
                {segment}
              </motion.span>
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}
