import type { MetadataRoute } from "next"

const SITE_URL = "https://enaawah.scouthub.dev"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/create`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ]
}
