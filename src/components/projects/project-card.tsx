"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import { InkArrow } from "@/components/ui/ink-arrow";
import { PencilUnderline } from "@/components/ui/pencil-underline";

type ProjectCardProps = {
  project: Project;
  className?: string;
  index?: number;
};

export function ProjectCard({
  project,
  className,
  index = 0,
}: ProjectCardProps) {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [arrow, setArrow] = useState({ x: 0, y: 0, visible: false });

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 240, damping: 24, mass: 0.35 });
  const springY = useSpring(rotateY, { stiffness: 240, damping: 24, mass: 0.35 });
  const tilt = index % 2 === 0 ? -0.7 : 0.7;

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setEnabled(!coarse && !reducedMotion);
  }, [reducedMotion]);

  const cover =
    project.cover_image ||
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80";

  const onMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    setArrow({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      visible: true,
    });

    if (!enabled) return;
    rotateX.set((0.5 - py) * 4);
    rotateY.set((px - 0.5) * 5);
  };

  const onLeave = () => {
    setArrow((a) => ({ ...a, visible: false }));
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      style={
        enabled
          ? {
              rotateX: springX,
              rotateY: springY,
              transformPerspective: 1000,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
      whileHover={
        reducedMotion
          ? undefined
          : { y: -4, rotate: 0 }
      }
      initial={reducedMotion ? false : { rotate: tilt }}
      animate={{ rotate: tilt }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group", className)}
    >
      <Link
        ref={cardRef}
        href={`/projects/${project.slug}`}
        onMouseMove={onMove}
        onMouseEnter={() => setArrow((a) => ({ ...a, visible: true }))}
        onMouseLeave={onLeave}
        className="journal-entry relative block"
      >
        <div className="journal-entry__photo relative aspect-[16/10]">
          <Image
            src={cover}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />

          {enabled ? (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute z-20 flex size-9 items-center justify-center bg-[#faf7f0] text-[var(--accent)] shadow-[var(--shadow-sm)]"
              animate={{
                x: arrow.x - 18,
                y: arrow.y - 18,
                opacity: arrow.visible ? 1 : 0,
                scale: arrow.visible ? 1 : 0.7,
              }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
            >
              <InkArrow direction="up-right" tone="accent" className="size-4" />
            </motion.span>
          ) : (
            <span className="absolute right-3 top-3 z-20 flex size-8 items-center justify-center bg-[#faf7f0] text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
              <InkArrow direction="up-right" tone="accent" className="size-3.5" />
            </span>
          )}
        </div>

        <div className="journal-entry__body relative space-y-3">
          <div className="journal-entry__meta flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{project.role}</span>
            <span aria-hidden>·</span>
            <span>{project.industry}</span>
          </div>

          <div className="space-y-2">
            <h3 className="journal-entry__title relative inline-block text-[1.45rem] sm:text-[1.75rem]">
              {project.title}
              <PencilUnderline
                className="bottom-[-0.12em] h-[0.28em] opacity-0 transition-opacity group-hover:opacity-100"
                animate={false}
                weight="thin"
              />
            </h3>
            <p className="journal-entry__copy line-clamp-2 text-sm leading-relaxed">
              {project.short_description}
            </p>
          </div>

          <div className="journal-entry__rule" aria-hidden />

          <div className="journal-entry__tags flex flex-wrap gap-x-3 gap-y-1">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>

          <span className="inline-flex items-center gap-1.5 font-hand text-sm text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
            open case study
            <InkArrow direction="right" tone="accent" className="size-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
