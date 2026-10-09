import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { TemplateShowcaseProvider } from "@/components/landing/TemplateShowcaseProvider"
import { JsonLd } from "@/components/common/JsonLd"
import { GUIDES, getGuide } from "@/lib/seo/guides"
import { articleNode, howToNode, breadcrumbNode } from "@/lib/seo/schema"

// نمط استيراد MDX الديناميكي الموصى به رسمياً لـApp Router — راجع
// node_modules/next/dist/docs/01-app/02-guides/mdx.mdx. dynamicParams:false
// يعني ٤٠٤ حقيقية لأي slug خارج GUIDES (لا تصيير عند الطلب لمسار غير معروف).
export const dynamicParams = false

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return {}
  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: `/guides/${guide.slug}` },
  }
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const { default: Body } = await import(`@/content/guides/${slug}.mdx`)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      guide.kind === "howto"
        ? howToNode({ name: guide.title, description: guide.description, steps: guide.howToSteps ?? [] })
        : articleNode({
            headline: guide.title,
            description: guide.description,
            path: `/guides/${guide.slug}`,
            publishedISO: guide.publishedISO,
            updatedISO: guide.updatedISO,
          }),
      breadcrumbNode([
        { name: "الرئيسية", path: "/" },
        { name: "الأدلّة", path: "/guides" },
        { name: guide.shortTitle, path: `/guides/${guide.slug}` },
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
          <Link href="/guides" className="hover:text-(--home-fg)">الأدلّة</Link>
          <span className="mx-2">/</span>
          <span className="text-(--home-fg)">{guide.shortTitle}</span>
        </nav>

        <h1 className="text-3xl font-bold sm:text-4xl">{guide.title}</h1>

        <div className="mt-8">
          <Body />
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-(--home-border) pt-8">
          <Link
            href="/create"
            className="inline-flex items-center rounded-xl bg-(--home-accent) px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
          >
            أنشئ نعوتك الآن
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center rounded-xl border border-(--home-border) px-5 py-2.5 text-sm font-bold text-(--home-fg) transition-colors hover:bg-(--home-surface)"
          >
            كل الأدلّة
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
