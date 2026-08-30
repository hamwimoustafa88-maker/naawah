import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo/site"
import { VISIBLE_TEMPLATES } from "@/lib/templates/registry"
import { GUIDES } from "@/lib/seo/guides"

// كل تاريخ هنا ثابت لكل عنصر (لا `new Date()` عامّ يتغيّر مع كل بناء) — تقلّب
// lastModified بلا تغيّر محتوى فعلي إشارة سلبية ضعيفة لمحرّكات البحث. حدِّث
// التاريخ يدوياً فقط حين يتغيّر محتوى الصفحة فعلياً.
const STATIC_LAST_MODIFIED = "2026-08-30"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/create`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/templates`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/ayat`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/guides`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/open-source`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.5 },
  ]

  const templatePages: MetadataRoute.Sitemap = VISIBLE_TEMPLATES.map((t) => ({
    url: `${SITE_URL}/templates/${t.id}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const guidePages: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    lastModified: g.updatedISO,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticPages, ...templatePages, ...guidePages]
}
