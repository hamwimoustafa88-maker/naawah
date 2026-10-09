import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { GoogleAnalytics } from "@next/third-parties/google"
import {
  Amiri, Amiri_Quran, Aref_Ruqaa_Ink, Cairo, Reem_Kufi_Ink, Scheherazade_New, Tajawal,
} from "next/font/google"
import { THEME_INIT_SCRIPT } from "@/lib/theme/initScript"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_TITLE_DEFAULT, SITE_KEYWORDS } from "@/lib/seo/site"
import "./globals.css"

// ملاحظة: كانت هذه السبعة تشارك التخطيط الجذري مع ٨ خطوط أخرى مخصّصة لـ"إعدادات
// النصوص" (اختيار خط عام/اسم الفقيد داخل /create فقط) — تلك الثمانية انتقلت إلى
// src/app/create/layout.tsx (تخطيط متداخل مستقلّ) لأن الصفحة الرئيسية لا تستهلكها
// إطلاقاً (LivePreview/TemplateGallery تعرضان VISIBLE_TEMPLATES السبعة فقط، وكلها
// تستعمل هذه السبعة حصراً). ١٥ عائلة خط على كل مسار كانت عبئاً حقيقياً على LCP.
const amiri = Amiri({ variable: "--font-amiri", subsets: ["arabic"], weight: ["400", "700"] })
const amiriQuran = Amiri_Quran({ variable: "--font-amiri-quran", subsets: ["arabic"], weight: "400" })
const arefRuqaa = Aref_Ruqaa_Ink({ variable: "--font-aref-ruqaa", subsets: ["arabic"], weight: "400" })
const reemKufiInk = Reem_Kufi_Ink({ variable: "--font-reem-kufi", subsets: ["arabic"], weight: "400" })
const scheherazade = Scheherazade_New({ variable: "--font-scheherazade", subsets: ["arabic"], weight: ["400", "700"] })
const tajawal = Tajawal({ variable: "--font-tajawal", subsets: ["arabic"], weight: ["400", "500", "700"] })
const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic", "latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE_DEFAULT,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  category: "lifestyle",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
  },
  icons: {
    // icon.png الأصلي ٨٠٦×٩٨٢ (غير مربّع) — يبقى مصدراً للأيقونات الكبيرة عبر
    // icon-512/icon-192 المربّعتين، وapple-icon.png (١٨٠×١٨٠، مولَّدة عبر sharp
    // من icon-512 مع خلفية معتّمة #161311 بدل الشفافية — توصية آبل لأيقونات الشاشة
    // الرئيسية). favicon-32.png يضيف حجماً صغيراً صريحاً لشريط التبويب.
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon-192.png",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  // رمز تحقّق Google Search Console — يُملأ فور إنشاء الخاصية (Property من نوع
  // "URL prefix") في: https://search.google.com/search-console. حتى ذلك الحين
  // يمكن التحقّق بديلاً عبر ملف HTML أو سجلّ DNS (الطريقتان لا تحتاجان هذا الحقل).
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
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
  // ملاحظة: جُرِّب هنا سابقاً interactiveWidget:"resizes-content" لحل تغطية
  // الكيبورد لأسفل بوتوم-شيت الجوال — أُلغي فوراً: يُجبِر Chrome على إعادة تصيير
  // الصفحة *بأكملها* (layout viewport فعلي أصغر) عند كل ظهور/اختفاء كيبورد، ما
  // تسبّب بتعليق فعلي على الجهاز أثناء الكتابة (رصدناه في فئة "الوالدين" تحديداً،
  // على الأرجح انعكاس شاشة الكانفاس الحيّة الثقيلة أسفل الصفحة على هذا التغيّر).
  // الحل الصحيح محصور بمكوّن BottomSheet.tsx نفسه عبر VisualViewport API (يُحرّك
  // عنصر اللوحة وحده بلا أي أثر على بقية الصفحة) — راجع تعليقاته.
}

const fontVariables = [
  amiri.variable, amiriQuran.variable, arefRuqaa.variable, reemKufiInk.variable,
  scheherazade.variable, tajawal.variable, cairo.variable,
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
