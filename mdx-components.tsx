// إلزامي لعمل @next/mdx مع App Router (راجع next.config.ts) — المكان المركزي
// لتنسيق عناصر Markdown/MDX الأساسية بأنماط الموقع البصرية (RTL، خطوط العناوين،
// تباعد يطابق بقية الصفحات). يُستهلَك تلقائياً من next/mdx لكل ملف .mdx.
import type { MDXComponents } from "mdx/types"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => (
      <h2 className="mt-10 mb-3 text-2xl font-bold text-(--home-fg)" {...props} />
    ),
    h3: (props) => (
      <h3 className="mt-7 mb-2 text-lg font-bold text-(--home-fg)" {...props} />
    ),
    p: (props) => (
      <p className="mb-4 leading-relaxed text-(--home-fg)/90" {...props} />
    ),
    ul: (props) => (
      <ul className="mb-4 list-disc space-y-1.5 pe-5 leading-relaxed text-(--home-fg)/90" {...props} />
    ),
    ol: (props) => (
      <ol className="mb-4 list-decimal space-y-1.5 pe-5 leading-relaxed text-(--home-fg)/90" {...props} />
    ),
    blockquote: (props) => (
      <blockquote
        className="mb-4 border-e-4 border-(--home-accent) bg-(--home-surface) py-3 pe-4 ps-2 text-(--home-fg)/90"
        {...props}
      />
    ),
    a: (props) => (
      <a className="text-(--home-accent) underline underline-offset-2" {...props} />
    ),
    strong: (props) => <strong className="font-bold text-(--home-fg)" {...props} />,
    hr: (props) => <hr className="my-8 border-(--home-border)" {...props} />,
    ...components,
  }
}
