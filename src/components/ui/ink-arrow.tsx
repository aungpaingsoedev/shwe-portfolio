import { cn } from "@/lib/utils";

type InkArrowProps = {
  className?: string;
  direction?: "right" | "up" | "up-right" | "down" | "left";
  tone?: "ink" | "accent";
};

const paths = {
  right:
    "M3 12c6.5-.4 11.2.2 15.2 0M13.2 6.5c2.8 1.6 4.6 3.4 5.3 5.5-1.2 1.8-3.2 3.6-5.5 5",
  up: "M12 21c-.15-5.9.1-10.6 0-14.8M7.2 10.6c1.7-2.2 3.4-3.9 4.9-5.1 1.7 1.3 3.5 3 5.1 5.2",
  "up-right":
    "M5 17c4.8-4.2 8.6-7.4 12.5-11.2M11.5 5.2c2.4-.2 4.5.1 6.2.6.2 2 .4 4 .2 6.2",
  down: "M12 3c.2 5.8-.1 10.4 0 14.5M7 13.2c1.8 2.4 3.5 4 5 5.2 1.6-1.4 3.4-3.1 5-5.3",
  left: "M21 12c-6.5.4-11.2-.2-15.2 0M10.8 6.5C8 8.1 6.2 9.9 5.5 12c1.2 1.8 3.2 3.6 5.5 5",
} as const;

/** Hand-drawn stroke arrow for the paper/notebook aesthetic */
export function InkArrow({
  className,
  direction = "right",
  tone = "ink",
}: InkArrowProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn(
        "size-4 shrink-0",
        tone === "accent" ? "text-[var(--accent)]" : "text-[var(--ink)]",
        className,
      )}
    >
      <path
        d={paths[direction]}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function InkArrowLong({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 16"
      fill="none"
      aria-hidden
      className={cn("h-3.5 w-14 text-[var(--accent)]", className)}
    >
      <path
        d="M2 8.2c14-.8 28 .6 42-.2 5.2-.3 10.2.1 14 .4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M50 3.5c3.2 1.4 5.8 3 7.2 4.8-1.8 1.6-4.4 3.4-7.5 4.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InkChevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={cn("size-4 text-[var(--muted)]", className)}
    >
      <path
        d="M5 7.2c2.4 2 4.4 3.8 5.1 5 1-1.4 2.8-3.2 5-5.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
