"use client";

import { projectFilters } from "@/lib/data/seed";
import { cn } from "@/lib/utils";
import { PencilUnderline } from "@/components/ui/pencil-underline";

export type ProjectFilter = (typeof projectFilters)[number];

type ProjectFiltersProps = {
  value: ProjectFilter;
  onChange: (value: ProjectFilter) => void;
  className?: string;
};

export function ProjectFilters({
  value,
  onChange,
  className,
}: ProjectFiltersProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter projects"
      className={cn(
        "flex flex-wrap items-end gap-x-5 gap-y-2 border-b border-dashed border-[var(--border)] pb-4",
        className,
      )}
    >
      {projectFilters.map((filter) => {
        const active = value === filter;
        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(filter)}
            className={cn(
              "journal-filter relative pb-1 transition-colors",
              active
                ? "text-[var(--accent)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]",
            )}
          >
            {filter}
            {active ? (
              <PencilUnderline
                weight="thin"
                animate={false}
                className="bottom-0 h-[5px]"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
