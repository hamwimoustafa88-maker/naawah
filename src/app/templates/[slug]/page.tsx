import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { TemplateShowcaseProvider } from "@/components/landing/TemplateShowcaseProvider"
import { JsonLd } from "@/components/common/JsonLd"
import { TemplatePreviewCard } from "@/components/templates/TemplatePreviewCard"
import { VISIBLE_TEMPLATES } from "@/lib/templates/registry"
import { TEMPLATE_SEO_CONTENT } from "@/lib/seo/templateContent"
import { breadcrumbNode } from "@/lib/seo/schema"

// صفحة ثابتة لكل قالب — dynamicParams: false يعني ٤٠٤ حقيقية (لا تصيير عند
// الطلب) لأي slug خارج VISIBLE_TEMPLATES السبعة، مطابقاً للنمط الموثّق رسمياً
// لصفحات MDX/ديناميكية ثابتة في Next.js App Router.
export const dynamicParams = false

export function generateStaticParams() {
  return VISIBLE_TEMPLATES.map((t) => ({ slug: t.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const template = VISIBLE_TEMPLATES.find((t) => t.id === slug)
  if (!template) return {}
  return {
    title: `قالب ${template.name}`,
    description: `${template.description} اختر قالب "${template.name}" وصمّم نعوتك الآن مجاناً — تصدير PNG أو PDF جاهز للطباعة.`,
    alternates: { canonical: `/templates/${template.id}` },
  }
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const template = VISIBLE_TEMPLATES.find((t) => t.id === slug)
  if (!template) notFound()

  const seo = TEMPLATE_SEO_CONTENT[template.id]
  const related = VISIBLE_TEMPLATES.filter((t) => t.id !== template.id).slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbNode([
        { name: "الرئيسية", path: "/" },
        { name: "القوالب", path: "/templates" },
        { name: template.name, path: `/templates/${template.id}` },
      ]),
    ],
  }

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
          <Link href="/templates" className="hover:text-(--home-fg)">القوالب</Link>
          <span className="mx-2">/</span>
          <span className="text-(--home-fg)">{template.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[280px_1fr] sm:items-start">
          <TemplatePreviewCard template={template} />

          <div>
            <span className="rounded-full bg-(--home-accent)/10 px-3 py-1 text-xs font-bold text-(--home-accent)">
              {template.category}
            </span>
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">قالب {template.name}</h1>
            <p className="mt-3 text-(--home-muted)">{template.description}</p>

            <Link
              href="/create"
              className="mt-6 inline-flex items-center rounded-xl bg-(--home-accent) px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              صمّم نعوتك بهذا القالب
            </Link>
          </div>
        </div>

        {seo && (
          <div className="mt-12 flex flex-col gap-6 border-t border-(--home-border) pt-10">
            <div>
              <h2 className="mb-2 text-lg font-bold">متى يناسبك هذا القالب؟</h2>
              <p className="leading-relaxed text-(--home-fg)/90">{seo.bestFor}</p>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-bold">الخط المستعمل</h2>
              <p className="leading-relaxed text-(--home-fg)/90">{seo.fontNote}</p>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-bold">هل يصلح للطباعة؟</h2>
              <p className="leading-relaxed text-(--home-fg)/90">{seo.printNote}</p>
            </div>
          </div>
        )}

        <div className="mt-12 border-t border-(--home-border) pt-10">
          <h2 className="mb-4 text-lg font-bold">قوالب أخرى</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((t) => (
              <Link key={t.id} href={`/templates/${t.id}`} className="group flex flex-col gap-2">
                <TemplatePreviewCard template={t} />
                <span className="text-sm font-bold group-hover:text-(--home-accent)">{t.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
