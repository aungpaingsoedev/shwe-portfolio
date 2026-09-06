"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";

export function AdminLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname?.includes("/admin/login");

  if (isLogin) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
