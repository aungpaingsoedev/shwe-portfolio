"use client";

import { useCallback, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageLoader } from "@/components/animations/page-loader";
import { PageTransition } from "@/components/animations/page-transition";
import { ScrollProgress } from "@/components/animations/scroll-progress";
import { CustomCursor } from "@/components/animations/custom-cursor";
import { BackToTop } from "@/components/animations/back-to-top";

type SiteShellProps = {
  children: React.ReactNode;
  name?: string;
  tagline?: string;
  footerStickyNote?: string;
  resumeUrl?: string | null;
  showLoader?: boolean;
};

export function SiteShell({
  children,
  name = "Shwe Yi Mon",
  tagline = "Bridging Business Strategy, Technology & Product Delivery.",
  footerStickyNote = "written in ink · shipped in code",
  resumeUrl = "/resume.pdf",
  showLoader = true,
}: SiteShellProps) {
  const [loaderDone, setLoaderDone] = useState(!showLoader);
  const handleLoaderComplete = useCallback(() => setLoaderDone(true), []);

  return (
    <>
      {showLoader && !loaderDone ? (
        <PageLoader onComplete={handleLoaderComplete} />
      ) : null}
      <ScrollProgress />
      <CustomCursor />
      <div className="paper-site flex min-h-screen flex-col">
        <Navbar name={name} resumeUrl={resumeUrl} />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer name={name} tagline={tagline} stickyNote={footerStickyNote} />
      </div>
      <BackToTop />
    </>
  );
}
