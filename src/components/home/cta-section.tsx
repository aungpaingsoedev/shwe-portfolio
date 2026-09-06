import { Reveal } from "@/components/animations/reveal";
import { MagneticButton } from "@/components/ui/button";
import { InkArrowLong } from "@/components/ui/ink-arrow";
import { StickyNote } from "@/components/ui/sticky-note";

type CtaSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  label?: string;
  stickyNote?: string;
};

export function CtaSection({
  eyebrow = "Contact",
  title = "Let’s shape the next product milestone",
  description = "Open to conversations about project leadership, product ownership, and digital transformation in complex environments.",
  href = "/contact",
  label = "Get in touch",
  stickyNote = "drop a line — I’ll reply in ink",
}: CtaSectionProps) {
  return (
    <section className="pb-[var(--section-y)]">
      <div className="container-page">
        <Reveal>
          <div className="relative px-1 py-10 text-center sm:py-12">
            <div className="ink-rule mb-10" aria-hidden />
            <div className="relative mx-auto max-w-xl space-y-5">
              <p className="eyebrow">{eyebrow}</p>
              <h2 className="font-hand text-[2.05rem] text-[var(--ink)] sm:text-[2.65rem]">
                {title}
              </h2>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                {description}
              </p>
              <div className="flex justify-center pt-1">
                <MagneticButton
                  href={href}
                  variant="ink"
                  size="lg"
                  className="gap-2.5 px-0"
                >
                  {label}
                  <InkArrowLong className="h-3.5 w-12" />
                </MagneticButton>
              </div>
              {stickyNote ? (
                <div className="flex justify-center pt-1">
                  <StickyNote size="sm" rotate="right">
                    {stickyNote}
                  </StickyNote>
                </div>
              ) : null}
            </div>
            <div className="ink-rule mt-10" aria-hidden />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
