import { SITE_DESCRIPTION, SITE_NAME, GITHUB_URL, absoluteUrl } from "@/lib/seo/site"
import { VISIBLE_TEMPLATES } from "@/lib/templates/registry"
import { GUIDES } from "@/lib/seo/guides"

// فهرس llms.txt للأنظمة الآلية — القوالب والأدلّة مشتقّة من نفس سجلّات sitemap.ts
// فلا تنحرف القائمة عن صفحات الموقع الفعلية.
export const dynamic = "force-static"

function link(label: string, path: string, note?: string): string {
  return `- [${label}](${absoluteUrl(path)})${note ? `: ${note}` : ""}`
}

export function GET() {
  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## الصفحات الأساسية",
    "",
    link("إنشاء نعوة", "/create", "المحرر"),
    link("القوالب", "/templates"),
    link("آيات قرآنية", "/ayat"),
    link("الأدلّة", "/guides"),
    link("الأسئلة الشائعة", "/faq"),
    link("مفتوح المصدر", "/open-source", `الكود على ${GITHUB_URL}`),
    "",
    "## القوالب",
    "",
    ...VISIBLE_TEMPLATES.map((t) => link(t.name, `/templates/${t.id}`, t.description)),
    "",
    "## الأدلّة",
    "",
    ...GUIDES.map((g) => link(g.title, `/guides/${g.slug}`, g.description)),
    "",
    "## معلومات",
    "",
    link("من نحن", "/about"),
    link("اتصل بنا", "/contact"),
    link("سياسة الخصوصية", "/privacy"),
    link("الشروط والأحكام", "/terms"),
    "",
  ].join("\n")

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
