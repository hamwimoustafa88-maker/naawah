// تخطيط متداخل خاص بـ/create فقط — يحمل ٨ عائلات خط عربية إضافية (كتالوج "إعدادات
// النصوص" الكامل: خط عام + خط اسم الفقيد، راجع src/lib/textFonts.ts) كانت سابقاً في
// التخطيط الجذري وتُحمَّل على كل مسار رغم أن الصفحة الرئيسية لا تستهلك أياً منها
// (VISIBLE_TEMPLATES السبعة تستعمل فقط الخطوط السبعة الباقية في layout.tsx الجذري).
// نقلها هنا يخفّف حمل الخط على LCP للصفحة الرئيسية بلا أي أثر على /create نفسها.
//
// `--font-*` متغيّرات CSS مخصّصة تُورَث عبر شجرة الـDOM كأي متغيّر CSS آخر — وضعها
// كصنف على <div> غلاف هنا (بدل <html> في التخطيط الجذري) يكفي تماماً لأي عنصر
// نسل داخل /create يقرأها عبر var(--font-…)، بلا حاجة لتعديل <html>/<body>.
import {
  Alexandria, Almarai, El_Messiri, IBM_Plex_Sans_Arabic, Lalezar, Markazi_Text,
  Noto_Naskh_Arabic, Reem_Kufi,
} from "next/font/google"
// أعلام الدول لـCountryPicker.tsx (منتقي "بلد الأصل") — حزمة SVG محلّية مستضافة
// ذاتياً (لا CDN خارجي وقت التشغيل)، تُحمَّل هنا فقط (لا التخطيط الجذري) لأن
// /create هي المستهلك الوحيد، بنفس منطق فصل خطوط "إعدادات النصوص" أدناه تماماً.
// إيموجي العلم النصّي (كان الحل الأول) فشل عملياً: وندوز لا يرسم أعلام الإيموجي
// إطلاقاً بتصميم متعمَّد من مايكروسوفت (يعرض بدلاً منها حرفي رمز الدولة كنص عادي
// "LB" بدل 🇱🇧) — عطل حقيقي واجهناه على متصفح المستخدم الفعلي على ويندوز.
import "flag-icons/css/flag-icons.min.css"

const almarai = Almarai({ variable: "--font-almarai", subsets: ["arabic"], weight: ["400", "700"] })
const elMessiri = El_Messiri({ variable: "--font-el-messiri", subsets: ["arabic"], weight: ["400", "700"] })
const lalezar = Lalezar({ variable: "--font-lalezar", subsets: ["arabic"], weight: "400" })
const markaziText = Markazi_Text({ variable: "--font-markazi", subsets: ["arabic"], weight: ["400", "700"] })
// Reem_Kufi هنا هو العائلة العادية القابلة للقراءة، منفصلة عمداً عن Reem_Kufi_Ink
// الزخرفي (يبقى في التخطيط الجذري — يُستعمل لخط "royal-monogram" calligraphyFont).
const alexandria = Alexandria({ variable: "--font-alexandria", subsets: ["arabic"], weight: ["400", "700"] })
const ibmPlexArabic = IBM_Plex_Sans_Arabic({ variable: "--font-ibm-plex-arabic", subsets: ["arabic"], weight: ["400", "700"] })
// خط "طرابلس وشمال لبنان" (قالب hidden حالياً، لكن getTemplate() يحلّه لأي نعوة
// محفوظة سلفاً تستعمله) — يحتاجه محرر /create فقط، لا الصفحة الرئيسية أبداً.
const notoNaskh = Noto_Naskh_Arabic({ variable: "--font-noto-naskh", subsets: ["arabic"], weight: ["400", "700"] })
const reemKufi = Reem_Kufi({ variable: "--font-reem-kufi-plain", subsets: ["arabic"], weight: ["400", "700"] })

const fontVariables = [
  almarai.variable, elMessiri.variable, lalezar.variable, markaziText.variable,
  alexandria.variable, ibmPlexArabic.variable, notoNaskh.variable, reemKufi.variable,
].join(" ")

export default function CreateLayout({ children }: LayoutProps<"/create">) {
  return <div className={fontVariables}>{children}</div>
}
