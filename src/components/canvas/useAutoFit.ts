"use client"

// يقلّص حجم الخط تلقائياً (بحث ثنائي) حتى يبقى المحتوى داخل صفحة A4 واحدة.
// يعالج تفاوت كثافة البيانات بين النعوات (من ~١٢ اسماً إلى ~٣٠).
//
// ثلاث مراحل متتالية، كل واحدة أشد "ضرراً" بصرياً من سابقتها — لا تبدأ مرحلة
// إلا بعد فشل ما قبلها في حل الفيض:
// ١) تصغير حجم الخط فقط حتى SOFT_MIN_FONT_PX (١٢px) — الحد "المفضّل" المقروء.
// ٢) الخط مثبَّت على ١٢px، تضييق تباعد الأسطر/الفقرات (--fit-tightness) بدل
//    الاستمرار بتصغير الخط — يستهلكه lineHeight/gap في ObituaryBlocks.tsx.
// ٣) ملاذ أخير: التباعد مثبَّت على أضيق حالة، والخط يستمر بالتصغير متجاوزاً
//    الحد "المفضّل" حتى HARD_MIN_FONT_PX (١٠px) — طُلب صراحةً ألا يُترك المحتوى
//    فائضاً/مقصوصاً (يختفي القسم السفلي بالكامل) إن كان كسر الحد المفضّل قليلاً
//    كفيلاً بإنقاذ الصفحة كلها؛ أفضل من صفحة ناقصة.
// دمج الأسطر القصيرة (كـ"والده"/"شقيقته") في سطر واحد، وتصغير الصورة وهوامش
// الأعلى، معالَجة في ObituaryBlocks.tsx نفسه (خارج هذا الهوك) — انظر تعليقاته.

import { useLayoutEffect, useRef, useState } from "react"

const BASE_FONT_PX = 16
const MAX_SCALE = 1.0
const SOFT_MIN_FONT_PX = 12
const SOFT_MIN_SCALE = SOFT_MIN_FONT_PX / BASE_FONT_PX // 0.75 — الحد المفضّل
const HARD_MIN_FONT_PX = 10
const HARD_MIN_SCALE = HARD_MIN_FONT_PX / BASE_FONT_PX // 0.625 — أقصى كسر مقبول للحد المفضّل

const MAX_TIGHTNESS = 1.0
const MIN_TIGHTNESS = 0.7 // أقصى تضييق مقبول لتباعد الأسطر قبل اللجوء لكسر حد الخط

// ٨ تكرارات على أي من المديين تعطي دقة أدق من أي فرق مرئي، فلا حاجة لتكرارات
// إضافية تُكلّف reflow دون أي أثر بصري.
const ITERATIONS = 8

export function useAutoFit(deps: unknown[]) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // يُستهلَك من عناصر لها حد أدنى خاص للتصغير يختلف عن حد النص (مثال: صورة الفقيد
  // تتقلّص مع النص لكن بحد أدنى خاص بها. راجع ObituaryBlocks.tsx).
  const [scale, setScale] = useState(MAX_SCALE)
  // مقياس تضييق تباعد الأسطر (١ = طبيعي، ٠.٧ = أضيق ما يُقبل) — يُقرأ عبر
  // var(--fit-tightness) في ObituaryBlocks.tsx لتضييق lineHeight/gap/هوامش الأعلى.
  const [tightness, setTightness] = useState(MAX_TIGHTNESS)

  useLayoutEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const fits = (fontScale: number, spacingTightness: number) => {
      content.style.fontSize = `${BASE_FONT_PX * fontScale}px`
      content.style.setProperty("--fit-tightness", String(spacingTightness))
      return content.scrollHeight <= container.clientHeight
    }

    const settle = (fontScale: number, spacingTightness: number) => {
      // نُثبّت القيمة النهائية فعلياً في الـDOM (آخر تكرار بحث ثنائي قد يكون اختبر
      // قيمة لا تناسب)، وإلا يبقى المحتوى بحجم فائض عند التصدير.
      fits(fontScale, spacingTightness)
      setScale(fontScale)
      setTightness(spacingTightness)
    }

    if (fits(MAX_SCALE, MAX_TIGHTNESS)) {
      settle(MAX_SCALE, MAX_TIGHTNESS)
      return
    }

    // المرحلة ١: تصغير الخط فقط، بلا تضييق تباعد، حتى الحد المفضّل (١٢px)
    let lo = SOFT_MIN_SCALE
    let hi = MAX_SCALE
    for (let i = 0; i < ITERATIONS; i++) {
      const mid = (lo + hi) / 2
      if (fits(mid, MAX_TIGHTNESS)) {
        lo = mid
      } else {
        hi = mid
      }
    }

    if (fits(lo, MAX_TIGHTNESS)) {
      settle(lo, MAX_TIGHTNESS)
      return
    }

    // المرحلة ٢: الخط مثبَّت على الحد المفضّل (١٢px) وما زال المحتوى فائضاً —
    // نضيّق تباعد الأسطر تدريجياً بدل كسر الحد المفضّل مباشرة.
    let tlo = MIN_TIGHTNESS
    let thi = MAX_TIGHTNESS
    for (let i = 0; i < ITERATIONS; i++) {
      const tmid = (tlo + thi) / 2
      if (fits(SOFT_MIN_SCALE, tmid)) {
        tlo = tmid
      } else {
        thi = tmid
      }
    }

    if (fits(SOFT_MIN_SCALE, tlo)) {
      settle(SOFT_MIN_SCALE, tlo)
      return
    }

    // المرحلة ٣ (ملاذ أخير): التباعد مثبَّت على أضيق حالة، والخط يتابع التصغير
    // متجاوزاً الحد المفضّل حتى الحد الأقصى للكسر (١٠px) — أفضل من ترك القسم
    // السفلي كاملاً مقصوصاً/مخفياً كما في نعوة كثيفة البيانات.
    let flo = HARD_MIN_SCALE
    let fhi = SOFT_MIN_SCALE
    for (let i = 0; i < ITERATIONS; i++) {
      const fmid = (flo + fhi) / 2
      if (fits(fmid, MIN_TIGHTNESS)) {
        flo = fmid
      } else {
        fhi = fmid
      }
    }
    // إن لم يُفلح حتى الحد الأقصى للكسر (١٠px)، يبقى المحتوى فائضاً فعلياً —
    // أفضل من مخالفة كل الحدود الدنيا لمحاولة إخفاء الفيض بلا جدوى.
    settle(flo, MIN_TIGHTNESS)
    // نعيد الحساب فقط عند تغيّر البيانات المُمرَّرة صراحةً عبر deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { containerRef, contentRef, scale, tightness }
}
