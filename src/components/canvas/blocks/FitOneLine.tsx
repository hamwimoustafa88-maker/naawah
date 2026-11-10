"use client"

// سطر واحد يملأ عرض حاويته بالضبط: يكبَّر النص القصير ليبلغ الحافتين، ويصغَّر الطويل
// حتى لا ينكسر إلى سطر ثانٍ. الحجم يُحسب بقياس النص الفعلي (لا بعدد الحروف) لأن عرض
// الحرف العربي يتغيّر مع الاتصال والخط. يُستعمل لفوتر المطبعة في ObituaryBlocks.tsx.

import { useLayoutEffect, useRef } from "react"

/** سقف التكبير بالبكسل لا بـem: خط النعوة نفسه يكبر حتى ٢٤px للنعوة القصيرة، فسقف نسبي
 * كان يُضخّم نصاً من كلمتين إلى ٥٧px. النص الافتراضي يبلغ العرض الكامل عند ~٢٠–٢٦px. */
const MAX_FONT_PX = 28
/** حدّ أدنى شكلي فقط: مهما طال النص يبقى السطر الواحد مضموناً بدل كسره إلى سطرين. */
const MIN_FONT_EM = 0.05
/** هامش أمان: عرض النص لا يتناسب تماماً مع الحجم بسبب تقريب الخط، فيُترك جزء صغير فارغ. */
const FIT_MARGIN = 0.99

export function FitOneLine({ text }: { text: string }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const box = boxRef.current
    const span = textRef.current
    if (!box || !span) return
    let cancelled = false

    const fit = () => {
      if (cancelled) return
      // نسخة الكانفاس المخفية بلا أبعاد: كل قياس فيها صفر، فتُترك كما هي.
      const available = box.clientWidth
      if (available === 0) return
      span.style.fontSize = "1em"
      const natural = span.offsetWidth
      if (natural === 0) return
      const maxEm = MAX_FONT_PX / parseFloat(getComputedStyle(span).fontSize)
      const em = Math.min(maxEm, Math.max(MIN_FONT_EM, (available / natural) * FIT_MARGIN))
      span.style.fontSize = `${em}em`
    }

    fit()
    // عرض الحاوية يتغيّر مع حجم خط النعوة (هوامش الصفحة بوحدة em)، فيُعاد الضبط.
    const observer = new ResizeObserver(fit)
    observer.observe(box)
    // قياس قبل اكتمال الخط العربي يعتمد على خط بديل بعرض مختلف.
    if (document.fonts && document.fonts.status !== "loaded") void document.fonts.ready.then(fit)

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [text])

  return (
    // overflow:hidden لأن HTML الخادم يُرسم قبل أول قياس.
    <div ref={boxRef} style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
      <span ref={textRef} data-fit-line style={{ display: "inline-block" }}>
        {text}
      </span>
    </div>
  )
}
