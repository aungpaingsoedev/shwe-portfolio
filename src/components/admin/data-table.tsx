import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Column = {
  key: string;
  header: string;
  className?: string;
};

type DataTableProps = {
  columns: Column[];
  children: ReactNode;
  className?: string;
  empty?: ReactNode;
};

export function DataTable({
  columns,
  children,
  className,
  empty,
}: DataTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,var(--accent-soft))]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">{children}</tbody>
        </table>
      </div>
      {empty ? (
        <div className="border-t border-[var(--border)] px-4 py-10 text-center text-sm text-[var(--muted)]">
          {empty}
        </div>
      ) : null}
    </div>
  );
}

export function DataTableRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-[color-mix(in_oklab,var(--accent-soft)_35%,transparent)]",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function DataTableCell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-4 py-3.5 align-middle text-[var(--foreground)]", className)}>
      {children}
    </td>
  );
}
