import type { Metadata } from "next"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { TemplateShowcaseProvider } from "@/components/landing/TemplateShowcaseProvider"
import { JsonLd } from "@/components/common/JsonLd"
import { Calligraphy } from "@/components/canvas/Calligraphy"
import { CALLIGRAPHY_DEFAULT_WIDTH_PX } from "@/lib/obituary/defaults"
import { breadcrumbNode, itemListNode } from "@/lib/seo/schema"

export const metadata: Metadata = {
  title: "آيات قرآنية تُكتب في النعوة والتعزية",
  description:
    "مجموعة آيات قرآنية شائعة في نعوات الوفاة والتعزية — إنّا لله وإنّا إليه راجعون، يا أيتها النفس المطمئنة، وبشّر الصابرين — بخط عربي حقيقي مع بيان مصدر كل آية ومناسبتها.",
  alternates: { canonical: "/ayat" },
}

interface AyahEntry {
  id: string
  handmadeFile?: string
  title: string
  reference: string
  note: string
  isQuran: boolean
}

// نفس القيم الدلالية الموجودة في src/lib/obituary/defaults.ts (QURAN_VERSES) —
// معروضة هنا كمحتوى مرجعي مستقل مع مصدر كل آية ومناسبتها، بدل تكرارها داخل
// المحرر فقط. "وبشّر الصابرين" لها رسمتان مختلفتان بنفس النص في المحرر
// (handmadeFile: "2" و"6") — تُعرَض هنا مرّة واحدة تفادياً لتكرار نفس الفقرة.
const AYAT: AyahEntry[] = [
  {
    id: "inna-lillah",
    title: "إنّا لله وإنّا إليه راجعون",
    reference: "سورة البقرة، الآية ١٥٦",
    note: "الآية الأكثر ورداً في النعوات كافة — تُذكر عادة بعد اسم الفقيد مباشرة أو في ختام النعوة، وتُستعمل أيضاً شفهياً كأول ما يُقال عند سماع خبر الوفاة.",
    isQuran: true,
  },
  {
    id: "wa-bashir-sabireen-1",
    title: "وبشّر الصابرين",
    reference: "سورة البقرة، الآيتان ١٥٥-١٥٦",
    note: "تأتي في سياق آيات الابتلاء والصبر، وتُستعمل غالباً في مقدّمة النعوة أو كعنوان لها. متوفّرة بخط عربي حقيقي وبرسمتين مختلفتين للاختيار من بينهما داخل المحرر.",
    isQuran: true,
  },
  {
    id: "fajr-27-30",
    title: "يا أيتها النفس المطمئنة",
    reference: "سورة الفجر، الآيات ٢٧-٣٠",
    note: "من أكثر الآيات مناسبةً للختام — تخاطب النفس المؤمنة الراضية بقضاء الله، وتُستعمل عادة في نهاية النعوة قبل الدعاء للفقيد.",
    isQuran: true,
  },
  {
    id: "kullu-nafs",
    title: "كل نفس ذائقة الموت",
    reference: "سورة آل عمران، الآية ١٨٥",
    note: "تذكير عام بحتمية الموت لكل نفس، تُستعمل كافتتاحية للنعوة أو كعبارة مستقلة أعلى الصفحة.",
    isQuran: true,
  },
  {
    id: "nafs-mutmainna",
    title: "نفس مطمئنة انتقلت إلى دار البقاء",
    reference: "عبارة مأثورة مستوحاة من سورة الفجر (وليست نصاً قرآنياً حرفياً)",
    note: "صياغة شائعة في النعوات العربية تحمل نفس معنى الرضا والطمأنينة الواردة في آيات الفجر، دون أن تكون اقتباساً حرفياً — تُستعمل حين يُفضَّل عبارة مألوفة على الاقتباس المباشر.",
    isQuran: false,
  },
]

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    itemListNode({
      name: "آيات قرآنية تُكتب في النعوة والتعزية",
      items: AYAT.map((a) => ({ name: a.title, path: "/ayat" })),
    }),
    breadcrumbNode([
      { name: "الرئيسية", path: "/" },
      { name: "آيات قرآنية", path: "/ayat" },
    ]),
  ],
}

export default function AyatPage() {
  return (
    <div className="home-scope min-h-screen bg-(--home-bg) text-(--home-fg)">
      <JsonLd data={jsonLd} />
      <TemplateShowcaseProvider>
        <LandingHeader />
      </TemplateShowcaseProvider>

      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <nav aria-label="مسار التنقّل" className="mb-6 text-xs text-(--home-muted)">
          <Link href="/" className="hover:text-(--home-fg)">الرئيسية</Link>
          <span className="mx-2">/</span>
          <span className="text-(--home-fg)">آيات قرآنية</span>
        </nav>

        <h1 className="text-3xl font-bold sm:text-4xl">آيات قرآنية تُكتب في النعوة والتعزية</h1>
        <p className="mt-3 max-w-2xl text-(--home-muted)">
          مجموعة الآيات والعبارات المتاحة في محرّر النعوة الإلكترونية، معروضة هنا
          بخط عربي حقيقي حيّ (لا صورة مقصوصة) مع بيان مصدر كل آية والمناسبة
          الشائعة لاستعمالها.
        </p>

        <div className="mt-10 flex flex-col gap-12">
          {AYAT.map((a) => (
            <article key={a.id} className="flex flex-col items-center gap-4 border-b border-(--home-border) pb-10 text-center last:border-0">
              <Calligraphy
                id={a.id}
                handmadeFile={a.handmadeFile}
                widthPx={CALLIGRAPHY_DEFAULT_WIDTH_PX}
                fontFamily="var(--font-amiri-quran)"
              />
              <h2 className="text-xl font-bold">{a.title}</h2>
              <span className="text-xs font-bold text-(--home-accent)">{a.reference}</span>
              <p className="max-w-xl text-sm leading-relaxed text-(--home-muted)">{a.note}</p>
            </article>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/create"
            className="inline-flex items-center rounded-xl bg-(--home-accent) px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
          >
            استعملها في نعوتك الآن
          </Link>
          <Link
            href="/guides/duaa-lil-mayyit"
            className="inline-flex items-center rounded-xl border border-(--home-border) px-5 py-2.5 text-sm font-bold text-(--home-fg) transition-colors hover:bg-(--home-surface)"
          >
            أدعية للميت
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
