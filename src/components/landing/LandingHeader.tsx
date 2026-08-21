import Link from "next/link"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { BrandLogo } from "@/components/common/BrandLogo"

// روابط الأقسام — نفس القائمة تُستعمل لقائمة سطح المكتب الأفقية ولقائمة الجوال
// المنسدلة معاً، حتى لا تتفرّق. كل رابط يستهدف id موجود على العنصر <section>
// الخارجي كامل العرض لقسمه (لا الحاوية الداخلية المقيّدة العرض)، مع scroll-mt-20
// على كل هدف يعادل ارتفاع هذه الترويسة اللاصقة فلا يُخفي القسمَ عند القفز إليه.
const NAV_LINKS = [
  { href: "#how-it-works", label: "كيف يعمل" },
  { href: "#features", label: "المزايا" },
  { href: "#sadaqah", label: "صدقة جارية" },
  { href: "#developer", label: "المطوّر" },
]

const CTA_CLASS =
  "inline-flex items-center justify-center rounded-lg bg-(--home-accent) px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-(--home-accent)/25 transition-transform hover:scale-[1.03] sm:px-5 sm:py-2.5 sm:text-sm"

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-(--home-border) bg-(--home-surface)/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-6 py-4">
        <BrandLogo wordmarkClassName="hidden sm:inline-block" />

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-(--home-muted) transition-colors hover:text-(--home-fg)"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/create" className={CTA_CLASS}>
            إنشاء نعوة الآن
          </Link>

          <ThemeToggle />

          <details className="group relative md:hidden">
            <summary
              aria-label="قائمة الأقسام"
              className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-(--home-border) text-(--home-fg) [&::-webkit-details-marker]:hidden"
            >
              <Menu size={18} className="group-open:hidden" />
              <X size={18} className="hidden group-open:block" />
            </summary>

            <nav className="absolute inset-e-0 top-12 flex w-44 flex-col gap-1 rounded-xl border border-(--home-border) bg-(--home-surface) p-2 shadow-lg">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-sm text-(--home-fg) transition-colors hover:bg-(--home-bg)"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
