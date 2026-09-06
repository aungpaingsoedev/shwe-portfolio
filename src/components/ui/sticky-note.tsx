import { cn } from "@/lib/utils";

type StickyNoteProps = {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
  rotate?: "left" | "right" | "none";
  color?: "butter" | "mint" | "blush" | "sky";
};

const rotateClass = {
  left: "-rotate-2",
  right: "rotate-2",
  none: "rotate-0",
} as const;

const colorClass = {
  butter: "",
  mint: "sticky-note--mint",
  blush: "sticky-note--blush",
  sky: "sticky-note--sky",
} as const;

/** Paper sticky-note prompt / annotation for the notebook aesthetic */
export function StickyNote({
  children,
  className,
  size = "md",
  rotate = "left",
  color = "butter",
}: StickyNoteProps) {
  return (
    <span
      className={cn(
        "sticky-note",
        colorClass[color],
        size === "sm" && "sticky-note-sm",
        rotateClass[rotate],
        className,
      )}
    >
      {children}
    </span>
  );
}
