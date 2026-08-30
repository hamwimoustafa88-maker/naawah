import Link from "next/link"
import { Reveal } from "@/components/landing/Reveal"
import { GitHubIcon } from "@/components/landing/BrandIcons"
import { GITHUB_URL, LICENSE_URL } from "@/lib/seo/site"

// قسم مرئي جديد — القصة الأقوى لدى هذا المشروع (مفتوح المصدر + صدقة جارية) كانت
// غائبة كنص مرئي على الموقع نفسه (موجودة فقط في README.md، وكلمة "مفتوح المصدر"
// كانت ترد حصراً داخل aria-label لأيقونة GitHub في LandingHeader.tsx). هذا القسم
// يجعلها نصاً حقيقياً قابلاً للقراءة والفهرسة، ويربط لصفحة /open-source الأوسع.
export function OpenSourceSection() {
  return (
    <section id="open-source" className="w-full scroll-mt-20 bg-(--home-bg) py-16">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 text-center">
        <span className="rounded-full bg-(--home-accent)/10 px-4 py-1.5 text-sm font-bold text-(--home-accent)">
          مفتوح المصدر
        </span>
        <h2 className="text-2xl font-bold sm:text-3xl">مشروع مفتوح المصدر، صدقة جارية</h2>
        <p className="max-w-xl leading-relaxed text-(--home-muted)">
          الكود المصدري لهذا التطبيق كامل ومنشور علناً على GitHub برخصة GPL-3.0 — لأي
          مطوّر أن يفحصه، أو ينسخه، أو يشغّله على خادمه الخاص، أو يبني عليه مشروعاً
          جديداً بحرّية تامّة. الشفافية هنا ليست شعاراً: بما أن التطبيق يَعِد
          بأن بيانات النعوة لا تغادر متصفح المستخدم إطلاقاً، فإن الكود نفسه هو
          الدليل على ذلك — يمكن لأي أحد التحقّق بنفسه بقراءته مباشرة بدل الثقة
          بوعد وحده. طُوِّر هذا التطبيق ونُشر مجاناً للناس كافة، صدقةً جارية عن
          أرواح المسلمين، نسأل الله أن يتقبّلها خالصةً لوجهه.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-(--home-border) px-5 py-2.5 text-sm font-bold text-(--home-fg) transition-colors hover:bg-(--home-surface)"
          >
            <GitHubIcon className="h-4 w-4" />
            الكود على GitHub
          </a>
          <a
            href={LICENSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-xl border border-(--home-border) px-5 py-2.5 text-sm font-bold text-(--home-fg) transition-colors hover:bg-(--home-surface)"
          >
            الرخصة GPL-3.0
          </a>
          <Link
            href="/open-source"
            className="inline-flex items-center rounded-xl bg-(--home-accent) px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
          >
            تفاصيل أكثر
          </Link>
        </div>
      </Reveal>
    </section>
  )
}
