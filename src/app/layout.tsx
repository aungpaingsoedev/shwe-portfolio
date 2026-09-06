import type { Metadata } from "next";
import { Caveat, Plus_Jakarta_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const hand = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Shwe Yi Mon — IT Project Manager & Product Owner",
    template: "%s · Shwe Yi Mon",
  },
  description:
    "Bridging business strategy, technology, and product delivery. Portfolio of Shwe Yi Mon — IT Project Manager & Product Owner.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Shwe Yi Mon",
    title: "Shwe Yi Mon — IT Project Manager & Product Owner",
    description:
      "Bridging business strategy, technology, and product delivery.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shwe Yi Mon — IT Project Manager & Product Owner",
    description:
      "Bridging business strategy, technology, and product delivery.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${hand.variable} ${sans.variable} min-h-full font-sans antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
