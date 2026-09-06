import type { Metadata } from "next";
import { getProfile, getSettings, getSiteCopy } from "@/lib/data/content";
import { SiteShell } from "@/components/layout/site-shell";
import { ContactForm } from "@/components/contact/contact-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/animations/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Shwe Yi Mon for project leadership, product ownership, and digital transformation conversations.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [profile, settings, copy] = await Promise.all([
    getProfile(),
    getSettings(),
    getSiteCopy(),
  ]);

  return (
    <SiteShell
      name={profile.full_name}
      tagline={profile.tagline}
      resumeUrl={profile.resume_url}
      footerStickyNote={copy.footer_sticky_note}
      showLoader={false}
    >
      <section className="pb-20 pt-28 md:pb-28 md:pt-32">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <div className="space-y-6">
              <SectionHeading
                as="h1"
                eyebrow={copy.contact.eyebrow}
                title={copy.contact.title}
                description={copy.contact.description}
                align="left"
                marginNote={copy.contact.margin_note || undefined}
              />
              <div className="space-y-3 text-sm text-[var(--muted)]">
                <p>
                  Email:{" "}
                  <a
                    className="text-[var(--accent)]"
                    href={`mailto:${settings.contact_email || profile.email}`}
                  >
                    {settings.contact_email || profile.email}
                  </a>
                </p>
                <p>Based in {profile.location}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
