import type { MetadataRoute } from "next"

const SITE_URL = "https://enaawah.scouthub.dev"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // نقاط API إحصائية داخلية فقط — لا فائدة SEO من فهرستها.
        disallow: "/api/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
