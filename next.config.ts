import type { NextConfig } from "next"
import createMDX from "@next/mdx"

const nextConfig: NextConfig = {
  // يسمح بملفات .mdx كصفحات (مركز الأدلّة src/content/guides/*.mdx تحت
  // src/app/guides/[slug]) إضافة إلى .ts/.tsx المعتادة.
  pageExtensions: ["ts", "tsx", "mdx"],

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
        ],
      },
    ]
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
