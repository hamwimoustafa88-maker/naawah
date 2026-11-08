import Link from "next/link"
import {
  FacebookIcon, GitHubIcon, InstagramIcon, LinkedInIcon, TelegramIcon, ThreadsIcon, YouTubeIcon,
} from "@/components/landing/BrandIcons"
import { GITHUB_URL, LICENSE_URL, SCOUTHUB_URL, SITE_NAME, SOCIAL_URLS } from "@/lib/seo/site"
import { VISIBLE_TEMPLATES } from "@/lib/templates/registry"
import { GUIDES } from "@/lib/seo/guides"

// فوتر حقيقي بأعمدة روابط داخلية بدل تنويه + حقوق فقط — أقوى أداة ربط داخلي في
// موقع صغير: يمرّر إشارة لكل صفحة محتوى جديدة (قوالب/أدلّة/آيات) من الصفحة
// الأقوى (الرئيسية)، ويظهر في كل صفحة أخرى تحت نفس المكوّن.
const LINK_COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "المنتج",
    links: [
      { href: "/create", label: "إنشاء نعوة" },
      { href: "/templates", label: "القوالب" },
      { href: "/ayat", label: "آيات قرآنية" },
      { href: "/faq", label: "الأسئلة الشائعة" },
    ],
  },
  {
    title: "أشهر القوالب",
    links: VISIBLE_TEMPLATES.slice(0, 4).map((t) => ({ href: `/templates/${t.id}`, label: t.name })),
  },
  {
    title: "أدلّة مفيدة",
    links: GUIDES.slice(0, 4).map((g) => ({ href: `/guides/${g.slug}`, label: g.shortTitle })),
  },
]

const INFO_LINKS = [
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "اتصل بنا" },
  { href: "/privacy", label: "سياسة الخصوصية" },
  { href: "/terms", label: "الشروط والأحكام" },
]

const SOCIAL_LINKS = [
  { href: SOCIAL_URLS.linkedin, label: "لينكدإن", Icon: LinkedInIcon },
  { href: SOCIAL_URLS.youtube, label: "يوتيوب", Icon: YouTubeIcon },
  { href: SOCIAL_URLS.facebook, label: "فيسبوك", Icon: FacebookIcon },
  { href: SOCIAL_URLS.instagram, label: "إنستغرام", Icon: InstagramIcon },
  { href: SOCIAL_URLS.telegram, label: "تيليغرام", Icon: TelegramIcon },
  { href: SOCIAL_URLS.threads, label: "ثريدز", Icon: ThreadsIcon },
]

export function LandingFooter() {
  return (
    <footer className="w-full border-t border-(--home-border) bg-(--home-bg) px-6 py-12">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-8 text-sm sm:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
          <span className="font-bold text-(--home-fg)">{SITE_NAME}</span>
          <p className="max-w-[16rem] text-sm leading-relaxed text-(--home-muted)">
            مشروع مفتوح المصدر، مجاني بالكامل، صدقة جارية عن أرواح المسلمين.
          </p>
          <div className="mt-1 flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="المشروع مفتوح المصدر على GitHub"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-(--home-border) text-(--home-fg) transition-colors hover:bg-(--home-surface) sm:h-8 sm:w-8"
            >
              <GitHubIcon className="h-4 w-4" />
            </a>
            <a
              href={LICENSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-full border border-(--home-border) px-3 py-1 text-sm font-bold text-(--home-muted) transition-colors hover:bg-(--home-surface) sm:min-h-0 sm:px-2.5"
            >
              GPL-3.0
            </a>
          </div>
        </div>

        {LINK_COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col sm:gap-2.5">
            <span className="text-sm font-bold text-(--home-fg)">{col.title}</span>
            {col.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                prefetch={l.href === "/create" ? false : undefined}
                className="inline-flex min-h-11 items-center text-sm text-(--home-muted) transition-colors hover:text-(--home-fg) sm:min-h-0"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-5xl flex-col gap-4 border-t border-(--home-border) pt-6 text-center text-sm text-(--home-muted)">
        <nav aria-label="حساباتنا على الشبكات الاجتماعية" className="flex flex-wrap items-center justify-center gap-2">
          {SOCIAL_LINKS.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-(--home-border) text-(--home-fg) transition-colors hover:bg-(--home-surface) sm:h-8 sm:w-8"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </nav>
        <nav aria-label="صفحات تعريفية" className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-y-2">
          {INFO_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center transition-colors hover:text-(--home-fg) sm:min-h-0">
              {l.label}
            </Link>
          ))}
        </nav>
        <p>باستخدامك لهذا التطبيق فإنك تتعهد بصحة المعلومات والبيانات الواردة في تصميم النعوة.</p>
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. جميع الحقوق محفوظة.
          </p>
          <p className="flex items-center gap-2">
            <span>إحدى مبادرات منصة</span>
            <a
              href={SCOUTHUB_URL}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center gap-1.5 font-bold text-(--home-fg) transition-opacity hover:opacity-80 sm:min-h-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- شعار SVG ثابت صغير، next/image لا يعالج SVG افتراضياً */}
              <img src="/scouthub-logo.svg" alt="" width={20} height={20} className="h-5 w-5" />
              ScoutHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
