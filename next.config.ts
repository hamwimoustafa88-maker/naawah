import type { NextConfig } from "next"
import createMDX from "@next/mdx"

const nextConfig: NextConfig = {
  // يسمح بملفات .mdx كصفحات (مركز الأدلّة src/content/guides/*.mdx تحت
  // src/app/guides/[slug]) إضافة إلى .ts/.tsx المعتادة.
  pageExtensions: ["ts", "tsx", "mdx"],

  // لا نكشف التقنية للزائر (فحص كاشف: headers.disclosure).
  poweredByHeader: false,

  // رؤوس أمان أساسية غائبة سابقاً (next.config.ts كان فارغاً بالكامل) — لا تؤثر
  // على السيو مباشرة، لكنها إشارة ثقة تقنية وتُغلق ثغرات شائعة رخيصة الإصلاح.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // سياسة CSP صغيرة مفروضة فعلاً (لا تقيّد السكربتات عمداً حتى لا تكسر
          // Next.js/GA) — توصية كاشف لبدء تدريجي بلا مخاطرة كسر الصفحات.
          { key: "Content-Security-Policy", value: "object-src 'none'; base-uri 'self'; frame-ancestors 'self'" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          // same-origin-allow-popups: لا نفتح نوافذ دفع/دخول لكنه الخيار الأكثر أماناً مع المشاركة.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
      {
        // CORP بصرامة same-site على كل المسارات عدا صور المعاينة الاجتماعية
        // (OG/Twitter) التي يجب أن تُحمَّل من مواقع أخرى عمداً.
        source: "/((?!opengraph-image|twitter-image).*)",
        headers: [{ key: "Cross-Origin-Resource-Policy", value: "same-site" }],
      },
    ]
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
