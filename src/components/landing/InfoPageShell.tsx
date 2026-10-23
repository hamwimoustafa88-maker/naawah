import Link from "next/link"
import type { ReactNode } from "react"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { TemplateShowcaseProvider } from "@/components/landing/TemplateShowcaseProvider"

// غلاف مشترك للصفحات التعريفية النصّية (من نحن / اتصل بنا / الخصوصية / الشروط):
// ترويسة + مسار تنقّل + عنوان + محتوى نثري + فوتر، بنفس هيكل صفحة open-source.
export function InfoPageShell({
  title,
  crumb,
  children,
}: {
  title: string
  crumb: string
  children: ReactNode
}) {
  return (
    <div className="home-scope min-h-screen bg-(--home-bg) text-(--home-fg)">
      <TemplateShowcaseProvider>
        <LandingHeader />
      </TemplateShowcaseProvider>

      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <nav aria-label="مسار التنقّل" className="mb-6 text-sm text-(--home-muted)">
          <Link href="/" className="hover:text-(--home-fg)">الرئيسية</Link>
          <span className="mx-2">/</span>
          <span className="text-(--home-fg)">{crumb}</span>
        </nav>

        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>

        <div className="prose mt-8 leading-relaxed text-(--home-fg)/90 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pr-6 [&_li]:mb-2 [&_a]:text-(--home-accent) [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
