"use client"

// يقلّص حجم الخط تلقائياً (بحث ثنائي) حتى يبقى المحتوى داخل صفحة A4 واحدة.
// يعالج تفاوت كثافة البيانات بين النعوات (من ~١٢ اسماً إلى ~٣٠).

import { useLayoutEffect, useRef, useState } from "react"

const MIN_SCALE = 0.55
const MAX_SCALE = 1.0
const BASE_FONT_PX = 16
// ٨ تكرارات على مدى [0.55, 1.0] تعطي دقة ~0.0035 — أدق من أي فرق مرئي في حجم
// الخط، فلا حاجة لتكرارات إضافية تُكلّف reflow دون أي أثر بصري.
const ITERATIONS = 8

export function useAutoFit(deps: unknown[]) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // يُستهلَك من عناصر لها حد أدنى خاص للتصغير يختلف عن حد النص (مثال: صورة الفقيد
  // تتقلّص مع النص لكن بحد أقصى ٣٠٪، لا حتى MIN_SCALE الكامل). راجع ObituaryBlocks.tsx.
  const [scale, setScale] = useState(MAX_SCALE)

  useLayoutEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const fits = (s: number) => {
      content.style.fontSize = `${BASE_FONT_PX * s}px`
      return content.scrollHeight <= container.clientHeight
    }

    if (fits(MAX_SCALE)) {
      setScale(MAX_SCALE)
      return
    }

    let lo = MIN_SCALE
    let hi = MAX_SCALE
    for (let i = 0; i < ITERATIONS; i++) {
      const mid = (lo + hi) / 2
      if (fits(mid)) {
        lo = mid
      } else {
        hi = mid
      }
    }
    // آخر تكرار قد يكون اختبر `hi` (حجم لا يناسب) — يجب تثبيت `lo` (آخر حجم مؤكَّد مناسب)
    // فعلياً في الـ DOM، وإلا يبقى المحتوى بحجم فائض عن الصفحة عند التصدير.
    fits(lo)
    setScale(lo)
    // نعيد الحساب فقط عند تغيّر البيانات المُمرَّرة صراحةً عبر deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { containerRef, contentRef, scale }
}
