// مصدر وحيد فعلي لهوية الموقع في كل روابط/بيانات السيو (metadataBase، sitemap.ts،
// robots.ts، JSON-LD، صفحات المحتوى الجديدة). عدّل هنا فقط إن تغيّر النطاق أو الاسم
// أو الكلمات المفتاحية مستقبلاً — لا تُكرِّر هذه القيم حرفياً في ملف آخر.
//
// (كان `SITE_URL` مكرَّراً حرفياً في ٤ ملفات رغم تعليق قديم في layout.tsx يدّعي أنه
// "مصدر وحيد" — هذا الملف يجعل الادّعاء صحيحاً فعلاً.)

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://enaawah.scouthub.dev"

export const SITE_NAME = "النعوة الإلكترونية"

export const SITE_DESCRIPTION =
  "أنشئ نعوة إلكترونية عربية إسلامية وقورة تليق بمقام الفقيد خلال دقائق — اختر من ٧ قوالب احترافية، ودع محرك الصياغة يكتب نص النعي والأقارب تلقائياً بالتصريف الصحيح، ثم صدّرها PNG أو PDF جاهزة للطباعة والمشاركة. مجاناً وبلا تسجيل."

export const SITE_TITLE_DEFAULT = `${SITE_NAME} | مولّد نعوات إسلامية احترافية مجاناً`

export const GITHUB_URL = "https://github.com/hamwimoustafa88-maker/naawah"

export const LICENSE_URL = "https://www.gnu.org/licenses/gpl-3.0.html"

/** كلمات مفتاحية عامة للموقع ككل (تُستعمل في layout.tsx). لكل صفحة محتوى جديدة
 * (قالب/دليل/آية) كلماتها الخاصة الأضيق عبر `generateMetadata` الخاص بها. */
export const SITE_KEYWORDS = [
  "نعوة إلكترونية", "نعي إلكتروني", "تصميم نعوة", "مولد نعوات",
  "نعوة إسلامية", "إنشاء نعوة أونلاين", "نعوة PDF", "نعي عربي",
  "قوالب نعوة", "نعوة مجانية",
  "نعوة مفتوحة المصدر", "برنامج نعوة مجاني", "صدقة جارية",
]

/** رابط مطلق من مسار نسبي — يُبنى على SITE_URL دائماً (بلا شرطة مائلة زائدة). */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString()
}
