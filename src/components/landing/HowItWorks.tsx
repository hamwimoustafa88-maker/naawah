import { Reveal } from "@/components/landing/Reveal"

const STEPS = [
  {
    n: "٠١",
    title: "أدخل البيانات والألقاب",
    desc: "محرّك ذكي يصرّف الجنس ويجمع «المرحومين» ويرتّب الأقارب والألقاب الرسمية تلقائياً.",
  },
  {
    n: "٠٢",
    title: "اختر القالب",
    desc: "اختر من بين ٧ قوالب إسلامية وقورة، وعدّل النصوص كما تشاء.",
  },
  {
    n: "٠٣",
    title: "حمّل وشارك",
    desc: "تحميل بضغطة زر بصيغة PDF بمقاس A4 أو صورة عالية الدقة للواتساب.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full scroll-mt-20 bg-(--home-bg)">
      <div className="mx-auto w-full max-w-5xl px-6 py-16">
        <Reveal className="mb-10 flex flex-col gap-2">
          <span className="text-xs font-bold tracking-widest text-(--home-accent)">ثلاث خطوات فقط</span>
          <h2 className="text-2xl font-bold sm:text-3xl">كيف يعمل التطبيق؟</h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal
              key={s.n}
              delayMs={i * 80}
              className="flex flex-col gap-2 border-(--home-border) py-6 not-first:border-t sm:py-0 sm:ps-8 sm:pe-8 sm:first:ps-0 sm:last:pe-0 sm:not-first:border-t-0 sm:not-first:border-s"
            >
              <span className="text-4xl font-bold text-(--home-accent)">{s.n}</span>
              <h3 className="text-base font-bold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-(--home-muted)">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
