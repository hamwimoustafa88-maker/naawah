import type { Metadata } from "next"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { TemplateShowcaseProvider } from "@/components/landing/TemplateShowcaseProvider"
import { JsonLd } from "@/components/common/JsonLd"
import { TemplatePreviewCard } from "@/components/templates/TemplatePreviewCard"
import { VISIBLE_TEMPLATES } from "@/lib/templates/registry"
import { breadcrumbNode, itemListNode } from "@/lib/seo/schema"

export const metadata: Metadata = {
  title: "قوالب النعوة الإلكترونية",
  description:
    "٧ قوالب نعوة إسلامية جاهزة — كلاسيكي ذهبي، ملكي، صحفي تقليدي، وحديث بلا إطار. اختر التصميم المناسب وعدّل النصوص مباشرة، جاهز للطباعة أو المشاركة.",
  alternates: { canonical: "/templates" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    itemListNode({
      name: "قوالب النعوة الإلكترونية",
      items: VISIBLE_TEMPLATES.map((t) => ({ name: t.name, path: `/templates/${t.id}` })),
    }),
    breadcrumbNode([
      { name: "الرئيسية", path: "/" },
      { name: "القوالب", path: "/templates" },
    ]),
  ],
}

export default function TemplatesIndexPage() {
  return (
    <div className="home-scope min-h-screen bg-(--home-bg) text-(--home-fg)">
      <JsonLd data={jsonLd} />
      <TemplateShowcaseProvider>
        <LandingHeader />
      </TemplateShowcaseProvider>

      <main className="mx-auto w-full max-w-5xl px-6 py-16">
        <nav aria-label="مسار التنقّل" className="mb-6 text-xs text-(--home-muted)">
          <Link href="/" className="hover:text-(--home-fg)">الرئيسية</Link>
          <span className="mx-2">/</span>
          <span className="text-(--home-fg)">القوالب</span>
        </nav>

        <h1 className="text-3xl font-bold sm:text-4xl">قوالب النعوة الإلكترونية</h1>
        <p className="mt-3 max-w-2xl text-(--home-muted)">
          {VISIBLE_TEMPLATES.length} تصاميم إسلامية وقورة، من الكلاسيكي الذهبي إلى
          الحديث بلا إطار — اختر ما يناسب مقام الفقيد وابدأ التصميم مباشرة، ويمكنك
          تبديل القالب في أي وقت دون فقدان ما كتبته.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {VISIBLE_TEMPLATES.map((t) => (
            <Link
              key={t.id}
              href={`/templates/${t.id}`}
              className="group flex flex-col gap-3 rounded-xl border border-(--home-border) p-4 transition-colors hover:bg-(--home-surface)"
            >
              <TemplatePreviewCard template={t} />
              <div>
                <h2 className="text-base font-bold group-hover:text-(--home-accent)">{t.name}</h2>
                <p className="mt-1 text-xs text-(--home-muted)">{t.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
