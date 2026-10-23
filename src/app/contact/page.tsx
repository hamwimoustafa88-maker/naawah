import type { Metadata } from "next"
import { InfoPageShell } from "@/components/landing/InfoPageShell"
import { GITHUB_URL, SCOUTHUB_URL, SITE_NAME } from "@/lib/seo/site"

export const metadata: Metadata = {
  title: "اتصل بنا",
  description: `طرق التواصل مع فريق ${SITE_NAME}: الإبلاغ عن مشكلة، اقتراح ميزة، أو الإبلاغ عن ثغرة أمنية.`,
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <InfoPageShell title="اتصل بنا" crumb="اتصل بنا">
      <p>
        يسعدنا سماع ملاحظاتك. المشروع مفتوح المصدر، وأسرع طريقة للوصول إلينا هي
        عبر صفحة المشكلات (Issues) في المستودع.
      </p>

      <h2>اقتراح أو إبلاغ عن مشكلة</h2>
      <ul>
        <li>
          <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer">
            فتح بلاغ جديد على GitHub
          </a>
          {" "}— لخطأ في الصياغة، أو عطل في التصدير، أو اقتراح ميزة أو قالب.
        </li>
      </ul>

      <h2>الإبلاغ عن ثغرة أمنية</h2>
      <p>
        إن وجدت ثغرة أمنية فيرجى عدم نشرها علناً، وإبلاغنا بسرّية عبر{" "}
        <a href={`${GITHUB_URL}/security/advisories/new`} target="_blank" rel="noopener noreferrer">
          نموذج الإبلاغ الأمني الخاص
        </a>
        . تفاصيل سياسة الإفصاح في ملف{" "}
        <a href="/.well-known/security.txt">security.txt</a>.
      </p>

      <h2>منصة ScoutHub</h2>
      <p>
        {SITE_NAME} إحدى مبادرات منصة{" "}
        <a href={SCOUTHUB_URL} target="_blank" rel="noopener">ScoutHub</a>،
        ويمكنك التعرّف على بقية المبادرات من موقع المنصة.
      </p>
    </InfoPageShell>
  )
}
