import type { Metadata } from "next"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { TemplateShowcaseProvider } from "@/components/landing/TemplateShowcaseProvider"
import { JsonLd } from "@/components/common/JsonLd"
import { FAQ_ITEMS } from "@/lib/seo/faq"
import { breadcrumbNode, faqPageNode } from "@/lib/seo/schema"

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "إجابات عن أكثر الأسئلة تكراراً حول تطبيق النعوة الإلكترونية: الخصوصية، القوالب، الطباعة، والمصدر المفتوح.",
  alternates: { canonical: "/faq" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    faqPageNode(FAQ_ITEMS),
    breadcrumbNode([
      { name: "الرئيسية", path: "/" },
      { name: "الأسئلة الشائعة", path: "/faq" },
    ]),
  ],
}

export default function FaqPage() {
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
          <span className="text-(--home-fg)">الأسئلة الشائعة</span>
        </nav>

        <h1 className="text-3xl font-bold sm:text-4xl">الأسئلة الشائعة</h1>
        <p className="mt-3 text-(--home-muted)">
          كل ما تحتاج معرفته عن تطبيق النعوة الإلكترونية قبل أن تبدأ.
        </p>

        <div className="mt-8 flex flex-col divide-y divide-(--home-border) border-y border-(--home-border)">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group py-4">
              <summary className="cursor-pointer list-none text-base font-bold text-(--home-fg) marker:content-none">
                <span className="flex items-center justify-between gap-3">
                  {item.question}
                  <span className="shrink-0 text-(--home-accent) transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-(--home-muted)">{item.answer}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/create"
            className="inline-flex items-center rounded-xl bg-(--home-accent) px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
          >
            إنشاء نعوة الآن
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center rounded-xl border border-(--home-border) px-5 py-2.5 text-sm font-bold text-(--home-fg) transition-colors hover:bg-(--home-surface)"
          >
            الأدلّة الإرشادية
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
