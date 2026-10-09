import Link from "next/link"
import { GitHubIcon } from "@/components/landing/BrandIcons"
import { GITHUB_URL, LICENSE_URL, SITE_NAME } from "@/lib/seo/site"
import { VISIBLE_TEMPLATES } from "@/lib/templates/registry"
import { GUIDES } from "@/lib/seo/guides"

// فوتر حقيقي بأعمدة روابط داخلية بدل تنويه + حقوق فقط — أقوى أداة ربط داخلي في
// موقع صغير: يمرّر إشارة لكل صفحة محتوى جديدة (قوالب/أدلّة/آيات) من الصفحة
// الأقوى (الرئيسية)، ويظهر في كل صفحة أخرى تحت نفس المكوّن.
const LINK_COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "المنتج",
    links: [
      { href: "/create", label: "إنشاء نعوة" },
      { href: "/templates", label: "القوالب" },
      { href: "/ayat", label: "آيات قرآنية" },
      { href: "/faq", label: "الأسئلة الشائعة" },
    ],
  },
  {
    title: "أشهر القوالب",
    links: VISIBLE_TEMPLATES.slice(0, 4).map((t) => ({ href: `/templates/${t.id}`, label: t.name })),
  },
  {
    title: "أدلّة مفيدة",
    links: GUIDES.slice(0, 4).map((g) => ({ href: `/guides/${g.slug}`, label: g.shortTitle })),
  },
]

export function LandingFooter() {
  return (
    <footer className="w-full border-t border-(--home-border) bg-(--home-bg) px-6 py-12">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-8 text-sm sm:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
          <span className="font-bold text-(--home-fg)">{SITE_NAME}</span>
          <p className="max-w-[16rem] text-xs leading-relaxed text-(--home-muted)">
            مشروع مفتوح المصدر، مجاني بالكامل، صدقة جارية عن أرواح المسلمين.
          </p>
          <div className="mt-1 flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="المشروع مفتوح المصدر على GitHub"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-(--home-border) text-(--home-fg) transition-colors hover:bg-(--home-surface)"
            >
              <GitHubIcon className="h-4 w-4" />
            </a>
            <a
              href={LICENSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-(--home-border) px-2.5 py-1 text-[11px] font-bold text-(--home-muted) transition-colors hover:bg-(--home-surface)"
            >
              GPL-3.0
            </a>
          </div>
        </div>

        {LINK_COLUMNS.map((col) => (
          <nav key={col.title} className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-(--home-fg)">{col.title}</span>
            {col.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-(--home-muted) transition-colors hover:text-(--home-fg)"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-5xl flex-col gap-3 border-t border-(--home-border) pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-right">
        <p className="text-xs text-(--home-muted)">
          باستخدامك لهذا التطبيق فإنك تتعهد بصحة المعلومات والبيانات الواردة في تصميم النعوة.
        </p>
        <p className="text-xs text-(--home-muted)">© {new Date().getFullYear()} {SITE_NAME}</p>
      </div>
    </footer>
  )
}
