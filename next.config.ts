import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone is for Docker/self-host. On Vercel + Next 16.3 it breaks the
  // build (ENOENT next-server.js.nft.json) — see vercel/next.js#96646.
  output: process.env.VERCEL ? undefined : "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "vpcwcfdzxwyuvyldgrxl.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
