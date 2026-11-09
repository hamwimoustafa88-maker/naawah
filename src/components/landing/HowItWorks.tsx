import { Reveal } from "@/components/landing/Reveal"
import { StepsTrack } from "@/components/landing/SectionMotion"

// مُصدَّرة لاستهلاك src/app/page.tsx إياها في بناء عقدة HowTo المهيكلة (JSON-LD)
// — نفس النص المرئي هنا يُعاد استعماله حرفياً هناك، بلا تكرار الكتابة.
export const STEPS = [
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
          <span className="text-sm font-bold tracking-widest text-(--home-accent)">ثلاث خطوات فقط</span>
          <h2 className="text-2xl font-bold sm:text-3xl">كيف يعمل التطبيق؟</h2>
        </Reveal>

        <StepsTrack steps={STEPS} />
      </div>
    </section>
  )
}
