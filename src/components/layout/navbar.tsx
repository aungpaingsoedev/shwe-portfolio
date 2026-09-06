"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FileText, Menu, Moon, Sun, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/animations/magnetic";
import { PencilUnderline } from "@/components/ui/pencil-underline";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

type NavbarProps = {
  resumeUrl?: string | null;
  name?: string;
};

export function Navbar({
  resumeUrl = "/resume.pdf",
  name = "Shwe Yi Mon",
}: NavbarProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const resumeHref = resumeUrl || "/resume.pdf";
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[padding,background-color,border-color] duration-300",
          scrolled
            ? "border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] py-0 backdrop-blur-md"
            : "border-b border-transparent py-1",
        )}
        initial={reducedMotion ? false : { y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-page flex h-14 items-center justify-between gap-4 sm:h-[3.75rem]">
          <Link
            href="/"
            className="font-hand text-[1.45rem] leading-none text-[var(--foreground)] transition-colors hover:text-[var(--accent)] sm:text-[1.6rem]"
          >
            {name}
          </Link>

          <nav
            className="hidden items-center gap-5 lg:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative pb-1 text-[0.8125rem] tracking-wide transition-colors",
                    active
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]",
                  )}
                >
                  {link.label}
                  {active ? (
                    <PencilUnderline
                      weight="thin"
                      animate={false}
                      className="bottom-0 h-[5px]"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[5px] opacity-0 transition-opacity duration-200 group-hover:opacity-55"
                    >
                      <svg
                        className="h-full w-full overflow-visible"
                        viewBox="0 0 120 8"
                        fill="none"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M2 5.2c18-.9 36 .6 54-.2 16-.7 28.5.5 42-.1 7-.3 14 .2 20 .5"
                          stroke="var(--accent)"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <Magnetic strength={8}>
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-1.5 px-2 py-1.5 text-[0.8125rem] text-[var(--muted)] transition-colors hover:text-[var(--accent)] sm:inline-flex"
              >
                <FileText className="size-3.5" aria-hidden />
                Resume
              </a>
            </Magnetic>

            <button
              type="button"
              aria-label={
                isDark ? "Switch to light theme" : "Switch to dark theme"
              }
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="inline-flex size-9 items-center justify-center text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              {mounted ? (
                isDark ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )
              ) : (
                <Sun className="size-4 opacity-0" />
              )}
            </button>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-9 items-center justify-center text-[var(--foreground)] lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close menu overlay"
              className="absolute inset-0 bg-[color-mix(in_oklab,var(--background)_78%,transparent)] backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              aria-label="Mobile"
              className="paper-panel absolute inset-x-4 top-[4.25rem] overflow-hidden p-5"
              initial={reducedMotion ? false : { y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="flex flex-col divide-y divide-[var(--border)]">
                {NAV_LINKS.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * index }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-3.5 text-base text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-2 border-t border-[var(--border)] pt-3">
                <a
                  href={resumeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-2 text-[var(--muted)] hover:text-[var(--accent)]"
                >
                  <FileText className="size-4" />
                  Resume
                </a>
              </div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
