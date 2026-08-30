import type { Metadata } from "next"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { TemplateShowcaseProvider } from "@/components/landing/TemplateShowcaseProvider"
import { JsonLd } from "@/components/common/JsonLd"
import { GUIDES } from "@/lib/seo/guides"
import { breadcrumbNode, itemListNode } from "@/lib/seo/schema"

export const metadata: Metadata = {
  title: "أدلّة كتابة النعوة والتعزية",
  description: "أدلّة عملية لكتابة النعوة وصيغ التعزية والأدعية وآداب العزاء في الإسلام — أمثلة جاهزة يمكنك استعمالها مباشرة.",
  alternates: { canonical: "/guides" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    itemListNode({ name: "أدلّة كتابة النعوة والتعزية", items: GUIDES.map((g) => ({ name: g.shortTitle, path: `/guides/${g.slug}` })) }),
    breadcrumbNode([
      { name: "الرئيسية", path: "/" },
      { name: "الأدلّة", path: "/guides" },
    ]),
  ],
}

export default function GuidesIndexPage() {
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
          <span className="text-(--home-fg)">الأدلّة</span>
        </nav>

        <h1 className="text-3xl font-bold sm:text-4xl">أدلّة كتابة النعوة والتعزية</h1>
        <p className="mt-3 max-w-2xl text-(--home-muted)">
          أدلّة عملية بلغة عربية واضحة، تساعدك في اللحظة الصعبة على كتابة نعوة
          صحيحة الصياغة أو اختيار كلمات التعزية المناسبة.
        </p>

        <div className="mt-10 flex flex-col divide-y divide-(--home-border) border-y border-(--home-border)">
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="group flex flex-col gap-1.5 py-5">
              <h2 className="text-base font-bold group-hover:text-(--home-accent)">{g.title}</h2>
              <p className="text-sm text-(--home-muted)">{g.description}</p>
            </Link>
          ))}
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
