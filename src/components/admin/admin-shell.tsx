"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { AdminSidebar } from "@/components/admin/sidebar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-shell flex min-h-screen text-[var(--foreground)]">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] hover:text-[var(--foreground)] lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </button>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                Content Studio
              </p>
              <p className="text-sm text-[var(--foreground)]">
                Manage portfolio, blog, and messages
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            View site
          </Link>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
