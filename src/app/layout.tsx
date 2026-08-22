import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { GoogleAnalytics } from "@next/third-parties/google"
import {
  Alexandria, Almarai, Amiri, Amiri_Quran, Aref_Ruqaa_Ink, Cairo, El_Messiri,
  IBM_Plex_Sans_Arabic, Lalezar, Markazi_Text, Noto_Naskh_Arabic, Reem_Kufi, Reem_Kufi_Ink,
  Scheherazade_New, Tajawal,
} from "next/font/google"
import { THEME_INIT_SCRIPT } from "@/lib/theme/initScript"
import "./globals.css"

const amiri = Amiri({ variable: "--font-amiri", subsets: ["arabic"], weight: ["400", "700"] })
const amiriQuran = Amiri_Quran({ variable: "--font-amiri-quran", subsets: ["arabic"], weight: "400" })
const arefRuqaa = Aref_Ruqaa_Ink({ variable: "--font-aref-ruqaa", subsets: ["arabic"], weight: "400" })
const reemKufiInk = Reem_Kufi_Ink({ variable: "--font-reem-kufi", subsets: ["arabic"], weight: "400" })
const scheherazade = Scheherazade_New({ variable: "--font-scheherazade", subsets: ["arabic"], weight: ["400", "700"] })
const tajawal = Tajawal({ variable: "--font-tajawal", subsets: ["arabic"], weight: ["400", "500", "700"] })
const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic", "latin"] })
// أربعة خطوط إضافية — تصل بخطوط اسم الفقيد القابلة للاختيار من الإعدادات إلى ١٠،
// كلها مستضافة ذاتياً عبر next/font/google (تُحمَّل مع التطبيق، لا من شبكة خارجية وقت التشغيل).
const almarai = Almarai({ variable: "--font-almarai", subsets: ["arabic"], weight: ["400", "700"] })
const elMessiri = El_Messiri({ variable: "--font-el-messiri", subsets: ["arabic"], weight: ["400", "700"] })
const lalezar = Lalezar({ variable: "--font-lalezar", subsets: ["arabic"], weight: "400" })
const markaziText = Markazi_Text({ variable: "--font-markazi", subsets: ["arabic"], weight: ["400", "700"] })
// أربعة أخرى لإعدادات النصوص العامة (خط جميع النصوص) — كلها تدعم subset "arabic"
// رسمياً في next/font/google (تحقّقنا من ملف تعريف الأنواع قبل إضافتها)، فلا مشاكل
// تشكيل متوقَّعة (النص يُعرض حيّاً بمحرك المتصفح دائماً، لا مسارات مولَّدة — نفس مبدأ
// المخطوطات القرآنية). Reem_Kufi هنا هو العائلة العادية القابلة للقراءة، منفصلة عمداً
// عن Reem_Kufi_Ink الزخرفي أعلاه (يُستعمل لخط "royal-monogram" calligraphyFont تحديداً).
const alexandria = Alexandria({ variable: "--font-alexandria", subsets: ["arabic"], weight: ["400", "700"] })
const ibmPlexArabic = IBM_Plex_Sans_Arabic({ variable: "--font-ibm-plex-arabic", subsets: ["arabic"], weight: ["400", "700"] })
const notoNaskh = Noto_Naskh_Arabic({ variable: "--font-noto-naskh", subsets: ["arabic"], weight: ["400", "700"] })
const reemKufi = Reem_Kufi({ variable: "--font-reem-kufi-plain", subsets: ["arabic"], weight: ["400", "700"] })

// نطاق الإنتاج — مصدر وحيد لكل روابط SEO المطلقة (metadataBase، sitemap.ts،
// robots.ts، JSON-LD). عدّله هنا فقط إن تغيّر النطاق مستقبلاً.
const SITE_URL = "https://enaawah.scouthub.dev"
const SITE_NAME = "النعوة الإلكترونية"
const SITE_DESCRIPTION =
  "أنشئ نعوة إلكترونية عربية إسلامية وقورة تليق بمقام الفقيد خلال دقائق — اختر من ٧ قوالب احترافية، ودع محرك الصياغة يكتب نص النعي والأقارب تلقائياً بالتصريف الصحيح، ثم صدّرها PNG أو PDF جاهزة للطباعة والمشاركة. مجاناً وبلا تسجيل."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | مولّد نعوات إسلامية احترافية مجاناً`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "نعوة إلكترونية", "نعي إلكتروني", "تصميم نعوة", "مولد نعوات",
    "نعوة إسلامية", "إنشاء نعوة أونلاين", "نعوة PDF", "نعي عربي",
    "قوالب نعوة", "نعوة مجانية",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  category: "lifestyle",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: `${SITE_NAME} | مولّد نعوات إسلامية احترافية مجاناً`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | مولّد نعوات إسلامية احترافية مجاناً`,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.webmanifest",
  // ضع رمز تحقّق Google Search Console هنا بعد إنشائه (Property من نوع "URL prefix"):
  // verification: { google: "xxxxxxxxxxxxxxxxxxxx" },
}

// معرّف قياس GA4 (يبدأ بـG-) — من env var لا مكتوباً حرفياً، حتى لا يُرسِل
// التطوير المحلي بيانات لنفس الخاصية، ولتفادي تسجيله في الكود المصدري. يبقى
// التتبّع مطفأً بأمان (بلا أي خطأ) ما لم يُضبَط NEXT_PUBLIC_GA_ID في الإنتاج.
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#12100e" },
  ],
  colorScheme: "light dark",
}

const fontVariables = [
  amiri.variable, amiriQuran.variable, arefRuqaa.variable, reemKufiInk.variable,
  scheherazade.variable, tajawal.variable, cairo.variable,
  almarai.variable, elMessiri.variable, lalezar.variable, markaziText.variable,
  alexandria.variable, ibmPlexArabic.variable, notoNaskh.variable, reemKufi.variable,
].join(" ")

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${fontVariables} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans">
        {/* beforeInteractive عبر next/script (لا <script> خام في JSX) — يُدرَج في
            HTML المبدئي ويُنفَّذ قبل الترطيب فعلياً، بلا تحذير React "Encountered a
            script tag while rendering". مكانه هنا (لا في page.tsx/create/page.tsx)
            مقصود: التخطيط الجذري لا يُعاد رسمه أبداً أثناء تنقّل Next.js من جانب
            العميل بين المسارات، فهذا يعمل صحيحاً لكل من "/" و"/create" معاً بنسخة
            واحدة، بعكس تكراره داخل كل صفحة على حدة سابقاً.
            هذا السكربت يعدّل data-theme على <html> قبل الترطيب مباشرة — لذا
            suppressHydrationWarning إلزامي على <html> (أعلاه): بدونه يقارن React
            سمات <html> المُرسَلة من الخادم (بلا data-theme) بما ينتجه الترطيب، فيظهر
            تحذير "hydration mismatch" حقيقي رغم أن السلوك صحيح تماماً ومقصود. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        {children}
      </body>
      {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  )
}
