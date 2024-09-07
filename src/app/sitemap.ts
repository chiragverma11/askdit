import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.url}`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/popular`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/answer`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/communities`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/sign-in`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/sign-up`,
      lastModified: new Date(),
      priority: 0.7,
    },
  ];
}
