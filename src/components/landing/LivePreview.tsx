"use client"

// المعاينة الحيّة في الهيرو — كانفاس حقيقي واحد (لا صورة ثابتة) يعرض بيانات نموذجية
// (SAMPLE_OBITUARY_DATA)، مع تنقّل يدوي (زرّا تالي/سابق) وتقدّم تلقائي بين القوالب
// السبعة. سلسلة الرسم (ObituaryCanvas/ResponsiveCanvasFrame/ObituaryContent) خالية
// من المتجر أصلاً، فتُستعمل هنا بلا أي تعديل عدا مُعرّف مخصّص يتجنّب تعارضه مع
// محرر /create. عمداً صغيرة (~٢٤٠px) — عنصر مساند إلى جانب النص، لا بطل الهيرو.

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, useInView, useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { EASE_OUT } from "@/components/landing/MotionProvider"
import { ObituaryCanvas } from "@/components/canvas/ObituaryCanvas"
import { ResponsiveCanvasFrame } from "@/components/canvas/ResponsiveCanvasFrame"
import { SAMPLE_OBITUARY_DATA } from "@/lib/obituary/defaults"
import { VISIBLE_TEMPLATES as TEMPLATES } from "@/lib/templates/registry"
import { cn } from "@/lib/utils/cn"
import { useTemplateShowcase } from "@/components/landing/TemplateShowcaseProvider"

const AUTOPLAY_MS = 4500

// الدائرة المرئية ٣٢px داخل زر هدفه اللمسي ٤٤px.
const ARROW_FACE =
  "flex h-8 w-8 items-center justify-center rounded-full border border-(--home-border) bg-(--home-bg) text-(--home-fg) shadow-sm transition-colors group-hover:border-(--home-accent) group-hover:text-(--home-accent)"

export function LivePreview() {
  const { templateId, setTemplateId } = useTemplateShowcase()
  const [interacting, setInteracting] = useState(false)
  const [tabHidden, setTabHidden] = useState(false)
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)

  const currentIndex = Math.max(
    0,
    TEMPLATES.findIndex((t) => t.id === templateId)
  )

  function goTo(nextIndex: number) {
    const wrapped = (nextIndex + TEMPLATES.length) % TEMPLATES.length
    setTemplateId(TEMPLATES[wrapped].id)
  }

  // إيقاف مؤقّت لعلامة التبويب المخفية — لا داعي لتشغيل مؤقّت في الخلفية.
  useEffect(() => {
    function onVisibility() {
      setTabHidden(document.hidden)
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  // التقدّم التلقائي — يُعاد ضبط المؤقّت مع كل تغيّر في القالب الحالي (سواء من
  // التقدّم التلقائي نفسه أو من تدخّل يدوي)، ويتوقف كلياً عند التمرير فوق العنصر
  // أو التركيز عليه، أو خروجه من الشاشة، أو إخفاء التبويب، أو تفضيل المستخدم تقليل الحركة.
  useEffect(() => {
    if (interacting || tabHidden || !inView) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const timer = setTimeout(() => goTo(currentIndex + 1), AUTOPLAY_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, interacting, tabHidden, inView])

  return (
    <div ref={rootRef} id="live-preview" className="flex w-full flex-col items-center gap-3 scroll-mt-24">
      <m.div
        data-reveal
        role="group"
        aria-label="معاينة القوالب"
        className="relative w-full max-w-60"
        initial={{ opacity: 0, y: 28, rotate: -1.2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        onMouseEnter={() => setInteracting(true)}
        onMouseLeave={() => setInteracting(false)}
        onFocus={() => setInteracting(true)}
        onBlur={() => setInteracting(false)}
      >
        <div className="rounded-xl border border-(--home-border) bg-(--home-bg) p-2.5">
          <ResponsiveCanvasFrame>
            {/* nameHeadingLevel="div": هذا عرض حيّ زخرفي داخل الصفحة الرئيسية التي
                لها h1 خاص بها فعلاً (Hero.tsx) — بلا هذا التمرير كان اسم العيّنة
                العشوائي (SAMPLE_OBITUARY_DATA) يظهر كـh1 ثانٍ متنافس على الصفحة،
                عطل سيو حقيقي رصدناه أثناء التحقّق.
                mode="wait" إلزامي: نسختان معاً تكرّران id الكانفاس. كل نعوة تظهر من
                أعلاها إلى أسفلها، كورقة تخرج من الطابعة. */}
            <AnimatePresence mode="wait">
              <m.div
                key={templateId}
                data-reveal
                initial={reduced ? { opacity: 0 } : { opacity: 0.4, clipPath: "inset(0% 0% 100% 0%)" }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ opacity: 0, transition: { duration: 0.16 } }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
              >
                <ObituaryCanvas
                  data={{ ...SAMPLE_OBITUARY_DATA, templateId }}
                  id="landing-preview"
                  nameHeadingLevel="div"
                />
              </m.div>
            </AnimatePresence>
          </ResponsiveCanvasFrame>
        </div>

        <button
          type="button"
          onClick={() => goTo(currentIndex - 1)}
          aria-label="القالب السابق"
          className="group absolute -inset-s-4.5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center"
        >
          <span className={ARROW_FACE}>
            <ChevronRight size={16} />
          </span>
        </button>
        <button
          type="button"
          onClick={() => goTo(currentIndex + 1)}
          aria-label="القالب التالي"
          className="group absolute -inset-e-4.5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center"
        >
          <span className={ARROW_FACE}>
            <ChevronLeft size={16} />
          </span>
        </button>
      </m.div>

      <span className="sr-only" aria-live="polite">
        {TEMPLATES[currentIndex].name}
      </span>

      {/* هدف النقر أصغر عمداً لتبقى النقاط السبع متقاربة في سطر واحد؛ زرّا السهمين بديل بحجم لمسي كامل. */}
      <div className="flex justify-center">
        {TEMPLATES.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={t.name}
            title={t.name}
            className="group flex h-6 w-4 items-center justify-center"
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                templateId === t.id ? "bg-(--home-accent)" : "bg-(--home-border) group-hover:bg-(--home-accent)/50"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
