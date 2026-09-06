"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";
import { Reveal } from "@/components/animations/reveal";
import { InkArrow } from "@/components/ui/ink-arrow";
import { PencilUnderline } from "@/components/ui/pencil-underline";

type BlogCardProps = {
  post: BlogPost;
  index?: number;
};

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const reducedMotion = useReducedMotion();
  const cover =
    post.cover_image ||
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80";
  const categoryName = post.category?.name ?? "Insight";
  const tilt = index % 2 === 0 ? 0.6 : -0.6;

  return (
    <Reveal delay={Math.min(index * 0.06, 0.28)}>
      <motion.article
        initial={reducedMotion ? false : { rotate: tilt }}
        animate={{ rotate: tilt }}
        whileHover={reducedMotion ? undefined : { y: -3, rotate: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href={`/blog/${post.slug}`} className="journal-entry group block">
          <div className="journal-entry__photo relative aspect-[16/9]">
            <Image
              src={cover}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>

          <div className="journal-entry__body space-y-2.5">
            <div className="journal-entry__meta flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-[var(--accent)]">{categoryName}</span>
              <span aria-hidden>·</span>
              <span>{formatDate(post.published_at ?? post.created_at)}</span>
              <span aria-hidden>·</span>
              <span>{post.reading_time} min</span>
            </div>

            <h3 className="journal-entry__title relative inline-block text-[1.25rem] sm:text-[1.45rem]">
              {post.title}
              <PencilUnderline
                className="bottom-[-0.12em] h-[0.28em] opacity-0 transition-opacity group-hover:opacity-100"
                animate={false}
                weight="thin"
              />
            </h3>

            <p className="journal-entry__copy line-clamp-2 text-sm leading-relaxed">
              {post.excerpt}
            </p>

            <span className="inline-flex items-center gap-1.5 pt-1 font-hand text-sm text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
              read entry
              <InkArrow direction="right" tone="accent" className="size-3" />
            </span>
          </div>
        </Link>
      </motion.article>
    </Reveal>
  );
}
