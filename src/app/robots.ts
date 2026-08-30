import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // نقاط API إحصائية داخلية فقط — لا فائدة SEO من فهرستها. /admin لوحة
        // إدارة داخلية محميّة بكلمة مرور، غير مرتبطة من أي مكان في الموقع.
        disallow: ["/api/", "/admin"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
