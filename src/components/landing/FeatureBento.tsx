// إعادة تصميم بأسلوب سويسري بسيط وقوي: ثلاث بطاقات رئيسية متساوية الوزن بفواصل
// شعرة واحدة (تقنية gap-px + bg الحد، بلا ظلال ولا حواف مزخرفة)، وشريط سفلي
// مضغوط للمزايا الثانوية كعناصر نصية بلا بطاقات — كثافة معلومات عالية بلا فوضى
// بصرية (وفق توصية Minimalism & Swiss Style: شبكة، تباين عالٍ، بلا زخرفة زائدة).

import { BookOpen, Leaf, Lock, Palette, Sparkles, Zap } from "lucide-react"
import { Reveal } from "@/components/landing/Reveal"

const PILLARS = [
  {
    icon: BookOpen,
    title: "احترام القرآن الكريم",
    desc: "لا تُطبع آيات قرآنية تُرمى لاحقاً — النعوة الرقمية تصون قداسة النص.",
  },
  {
    icon: Lock,
    title: "خصوصية مطلقة",
    desc: "بيانات النعوة لا تغادر متصفحك — لا تُحفظ في أي خادم.",
  },
  {
    icon: Zap,
    title: "مجاني وبلا حدود",
    desc: "يعمل من المتصفح مباشرة، بلا اشتراك وبلا حدود استخدام.",
  },
]

const EXTRAS = [
  { icon: Sparkles, label: "بدون تسجيل" },
  { icon: Leaf, label: "صديق للبيئة" },
  { icon: Palette, label: "٧ قوالب وقورة" },
]

export function FeatureBento() {
  return (
    <section id="features" className="w-full scroll-mt-20 bg-(--home-surface)">
      <div className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-(--home-border) bg-(--home-border) sm:grid-cols-3">
          {PILLARS.map((f, i) => (
            <Reveal key={f.title} delayMs={i * 80} className="bg-(--home-bg) p-8">
              <f.icon className="mb-4 text-(--home-accent)" size={26} />
              <h3 className="mb-1.5 text-base font-bold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-(--home-muted)">{f.desc}</p>
            </Reveal>
          ))}

          <Reveal
            delayMs={240}
            className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 bg-(--home-bg) px-8 py-5 sm:col-span-3 sm:justify-between"
          >
            {EXTRAS.map((e) => (
              <div key={e.label} className="flex items-center gap-2 text-sm text-(--home-muted)">
                <e.icon size={16} className="text-(--home-accent)" />
                <span>{e.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
