"use client"

// المعاينة الحيّة في الهيرو — كانفاس حقيقي واحد (لا صورة ثابتة) يعرض بيانات نموذجية
// (SAMPLE_OBITUARY_DATA)، مع تنقّل يدوي (زرّا تالي/سابق) وتقدّم تلقائي بين القوالب
// السبعة. سلسلة الرسم (ObituaryCanvas/ResponsiveCanvasFrame/ObituaryContent) خالية
// من المتجر أصلاً، فتُستعمل هنا بلا أي تعديل عدا مُعرّف مخصّص يتجنّب تعارضه مع
// محرر /create. عمداً صغيرة (~٢٤٠px) — عنصر مساند إلى جانب النص، لا بطل الهيرو.

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ObituaryCanvas } from "@/components/canvas/ObituaryCanvas"
import { ResponsiveCanvasFrame } from "@/components/canvas/ResponsiveCanvasFrame"
import { SAMPLE_OBITUARY_DATA } from "@/lib/obituary/defaults"
import { VISIBLE_TEMPLATES as TEMPLATES } from "@/lib/templates/registry"
import { cn } from "@/lib/utils/cn"
import { useTemplateShowcase } from "@/components/landing/TemplateShowcaseProvider"

const AUTOPLAY_MS = 4500

export function LivePreview() {
  const { templateId, setTemplateId } = useTemplateShowcase()
  const [interacting, setInteracting] = useState(false)
  const [tabHidden, setTabHidden] = useState(false)

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
  // أو التركيز عليه، أو إخفاء التبويب، أو تفضيل المستخدم تقليل الحركة.
  useEffect(() => {
    if (interacting || tabHidden) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const timer = setTimeout(() => goTo(currentIndex + 1), AUTOPLAY_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, interacting, tabHidden])

  return (
    <div id="live-preview" className="flex w-full flex-col items-center gap-3 scroll-mt-24">
      <div
        role="group"
        aria-label="معاينة القوالب"
        className="relative w-full max-w-60"
        onMouseEnter={() => setInteracting(true)}
        onMouseLeave={() => setInteracting(false)}
        onFocus={() => setInteracting(true)}
        onBlur={() => setInteracting(false)}
      >
        <div className="rounded-xl border border-(--home-border) bg-(--home-bg) p-2.5">
          <ResponsiveCanvasFrame>
            <ObituaryCanvas data={{ ...SAMPLE_OBITUARY_DATA, templateId }} id="landing-preview" />
          </ResponsiveCanvasFrame>
        </div>

        <button
          type="button"
          onClick={() => goTo(currentIndex - 1)}
          aria-label="القالب السابق"
          className="absolute -inset-s-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-(--home-border) bg-(--home-bg) text-(--home-fg) shadow-sm transition-colors hover:border-(--home-accent) hover:text-(--home-accent)"
        >
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => goTo(currentIndex + 1)}
          aria-label="القالب التالي"
          className="absolute -inset-e-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-(--home-border) bg-(--home-bg) text-(--home-fg) shadow-sm transition-colors hover:border-(--home-accent) hover:text-(--home-accent)"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      <span className="sr-only" aria-live="polite">
        {TEMPLATES[currentIndex].name}
      </span>

      <div className="flex max-w-60 flex-wrap justify-center gap-1.5">
        {TEMPLATES.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={t.name}
            title={t.name}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              templateId === t.id ? "bg-(--home-accent)" : "bg-(--home-border) hover:bg-(--home-accent)/50"
            )}
          />
        ))}
      </div>
    </div>
  )
}
