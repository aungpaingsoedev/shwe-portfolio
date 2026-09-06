import Link from "next/link";
import { InkArrow } from "@/components/ui/ink-arrow";
import { StickyNote } from "@/components/ui/sticky-note";

const FOOTER_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

type FooterProps = {
  name?: string;
  tagline?: string;
  stickyNote?: string;
};

export function Footer({
  name = "Shwe Yi Mon",
  tagline = "Bridging Business Strategy, Technology & Product Delivery.",
  stickyNote = "written in ink · shipped in code",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      <div className="container-page py-12 md:py-14">
        <div className="ink-rule mb-10" aria-hidden />

        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm space-y-2">
            <p className="font-hand text-2xl text-[var(--foreground)] sm:text-[1.85rem]">
              {name}
            </p>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              {tagline}
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end"
          >
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                {link.label}
                <InkArrow
                  direction="up-right"
                  tone="accent"
                  className="size-3 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-4 text-[0.7rem] tracking-wide text-[var(--muted-foreground)]">
          <span>
            © {year} {name}
          </span>
          {stickyNote ? (
            <StickyNote
              size="sm"
              rotate="left"
              className="hidden sm:inline-block"
            >
              {stickyNote}
            </StickyNote>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
