"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  FileText,
  FolderKanban,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  PenLine,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}> = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/content", label: "Content", icon: PenLine },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export function AdminSidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[var(--border)] bg-[var(--surface-elevated)] backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-5">
          <Link href="/admin" className="group block" onClick={onClose}>
            <p className="font-semibold text-lg tracking-tight text-[var(--foreground)]">
              Shwe Yi Mon
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              Admin Portal
            </p>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "text-[var(--muted)] hover:bg-[color-mix(in_oklab,var(--foreground)_5%,transparent)] hover:text-[var(--foreground)]",
                )}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--border)] p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[color-mix(in_oklab,var(--danger)_10%,transparent)] hover:text-[var(--danger)]"
          >
            <LogOut className="size-4" strokeWidth={1.75} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
