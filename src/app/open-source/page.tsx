import type { Metadata } from "next"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { TemplateShowcaseProvider } from "@/components/landing/TemplateShowcaseProvider"
import { JsonLd } from "@/components/common/JsonLd"
import { GitHubIcon } from "@/components/landing/BrandIcons"
import { GITHUB_URL, LICENSE_URL, SITE_NAME } from "@/lib/seo/site"
import { breadcrumbNode, softwareSourceCodeNode } from "@/lib/seo/schema"

export const metadata: Metadata = {
  title: "مفتوح المصدر وصدقة جارية",
  description:
    "النعوة الإلكترونية مشروع مفتوح المصدر بالكامل برخصة GPL-3.0، مجاني بلا رسوم أو تسجيل، وُضع صدقة جارية عن أرواح المسلمين. تعرّف على الكود، الترخيص، وكيف تساهم أو تشغّله بنفسك.",
  alternates: { canonical: "/open-source" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    softwareSourceCodeNode(),
    breadcrumbNode([
      { name: "الرئيسية", path: "/" },
      { name: "مفتوح المصدر", path: "/open-source" },
    ]),
  ],
}

export default function OpenSourcePage() {
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
          <span className="text-(--home-fg)">مفتوح المصدر</span>
        </nav>

        <span className="rounded-full bg-(--home-accent)/10 px-4 py-1.5 text-sm font-bold text-(--home-accent)">
          مفتوح المصدر
        </span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
          {SITE_NAME} مشروع مفتوح المصدر، صدقة جارية
        </h1>

        <div className="prose mt-8 leading-relaxed text-(--home-fg)/90">
          <p className="mb-4">
            {SITE_NAME} ليس مجرّد أداة مجانية — الكود المصدري الكامل الذي يشغّلها منشور
            علناً على GitHub تحت رخصة{" "}
            <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer" className="text-(--home-accent) underline underline-offset-2">
              GNU GPL-3.0
            </a>
            ، وهي رخصة برمجيات حرّة تضمن لأي مستخدم الحق في تشغيل الكود، ودراسته،
            وتعديله، وإعادة توزيعه — بشرط أن تبقى أي نسخة مُعدَّلة حرّة بالمثل.
          </p>

          <h2 className="mt-10 mb-3 text-2xl font-bold">لماذا الشفافية تهمّ هنا تحديداً</h2>
          <p className="mb-4">
            أهمّ وعد يقدّمه هذا التطبيق هو أن بيانات النعوة — اسم الفقيد، الصورة،
            أسماء الأقارب — لا تغادر متصفح المستخدم إطلاقاً، ولا تُرسَل أو تُخزَّن على
            أي خادم. هذا وعد يسهل قوله وصعب إثباته في أي منتج مغلق المصدر. لأن الكود
            هنا مفتوح بالكامل، فإن أي مطوّر — أو أي مستخدم فضولي — يستطيع فتح المستودع
            والتحقّق بنفسه من صحة هذا الوعد سطراً بسطر، بدل الاضطرار للثقة بشعار
            تسويقي وحده.
          </p>

          <h2 className="mt-10 mb-3 text-2xl font-bold">صدقة جارية</h2>
          <p className="mb-4">
            طُوِّر هذا التطبيق ونُشر مجاناً للناس كافة، صدقةً جارية عن أرواح المسلمين،
            عملاً بقول النبي ﷺ: «إذا ماتَ ابنُ آدمَ انقطعَ عملُه إلا من ثلاثٍ: صدقةٍ
            جاريةٍ، أو علمٍ يُنتفَعُ به، أو ولدٍ صالحٍ يدعو له» (رواه مسلم). نيّة
            الصدقة موثّقة في ملف <code>NOTICE.md</code> ضمن المستودع نفسه، وهي غير
            ملزِمة قانونياً فوق رخصة GPL-3.0 — لكنها الروح التي بُني بها المشروع،
            ونرجو من أي من ينسخه أو يبني عليه أن يحافظ على ذكر هذا الأصل الخيري.
          </p>

          <h2 className="mt-10 mb-3 text-2xl font-bold">التقنيات المستعملة</h2>
          <p className="mb-4">
            Next.js وReact وTypeScript وTailwind CSS للواجهة، وPostgres عبر Prisma
            للتخزين الإحصائي المجهول الهوية فقط (لا بيانات نعوات). محرك صياغة عربي
            مبني خصيصاً للمشروع يتولّى تصريف الجنس وتجميع الأقارب تلقائياً. كل هذا
            مفصَّل في ملفات التوثيق داخل المستودع.
          </p>

          <h2 className="mt-10 mb-3 text-2xl font-bold">كيف تساهم أو تشغّله بنفسك</h2>
          <p className="mb-4">
            المستودع مفتوح للمساهمة عبر Pull Requests — إبلاغ عن عطل، اقتراح ميزة،
            أو حتى تعريب/تحسين نص. يمكنك أيضاً استنساخ المشروع كاملاً وتشغيله على
            خادمك الخاص إن أردت نسخة مستقلّة، أو البناء فوقه لمشروع مختلف كلياً —
            الرخصة تسمح بذلك صراحة.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-(--home-accent) px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              <GitHubIcon className="h-4 w-4" />
              زيارة المستودع على GitHub
            </a>
            <Link
              href="/create"
              className="inline-flex items-center rounded-xl border border-(--home-border) px-5 py-2.5 text-sm font-bold text-(--home-fg) transition-colors hover:bg-(--home-surface)"
            >
              جرّب التطبيق الآن
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
