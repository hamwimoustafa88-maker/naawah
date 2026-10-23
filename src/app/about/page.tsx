import type { Metadata } from "next"
import Link from "next/link"
import { InfoPageShell } from "@/components/landing/InfoPageShell"
import { GITHUB_URL, SCOUTHUB_URL, SITE_NAME } from "@/lib/seo/site"

export const metadata: Metadata = {
  title: "من نحن",
  description: `تعرّف على ${SITE_NAME}: مبادرة مجانية مفتوحة المصدر لتصميم النعوات الإسلامية بجودة الطباعة، إحدى مبادرات منصة ScoutHub.`,
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <InfoPageShell title={`من نحن — ${SITE_NAME}`} crumb="من نحن">
      <p>
        {SITE_NAME} أداة مجانية تساعدك على كتابة نعوة عربية إسلامية وقورة وتصميمها
        خلال دقائق، ثم تصديرها صورة أو ملف PDF جاهزاً للطباعة والمشاركة. يتولّى
        محرك الصياغة تصريف الجنس وترتيب الأقارب تلقائياً، فلا تنشغل بالتفاصيل في
        لحظة صعبة.
      </p>

      <h2>لماذا بُنيت؟</h2>
      <p>
        كثيراً ما تُكتب النعوات على عجل وبأخطاء في الصياغة أو الترتيب. أردنا أن
        تكون الصياغة السليمة والتصميم اللائق في متناول الجميع بلا رسوم ولا تسجيل،
        صدقةً جارية عن أرواح المسلمين.
      </p>

      <h2>من يقف وراءها؟</h2>
      <p>
        المشروع إحدى مبادرات منصة <a href={SCOUTHUB_URL} target="_blank" rel="noopener">ScoutHub</a>،
        وهو مفتوح المصدر بالكامل برخصة GPL-3.0؛ يمكنك الاطلاع على الكود
        والمساهمة فيه عبر <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>.
        للمزيد عن روح المشروع وترخيصه راجع صفحة <Link href="/open-source">مفتوح المصدر</Link>.
      </p>

      <h2>تواصل معنا</h2>
      <p>
        للاقتراحات أو الإبلاغ عن مشكلة، زر صفحة <Link href="/contact">اتصل بنا</Link>.
      </p>
    </InfoPageShell>
  )
}
