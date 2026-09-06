import type { MetadataRoute } from "next";
import { getPublishedPosts, getPublishedProjects } from "@/lib/data/content";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/projects", "/blog", "/contact"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  try {
    const [projects, posts] = await Promise.all([
      getPublishedProjects(),
      getPublishedPosts(),
    ]);

    const projectRoutes = projects.map((p) => ({
      url: absoluteUrl(`/projects/${p.slug}`),
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const postRoutes = posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...projectRoutes, ...postRoutes];
  } catch {
    // Build/deploy should not fail if the pool is briefly unavailable
    return staticRoutes;
  }
}
