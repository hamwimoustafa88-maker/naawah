"use client"

// يصغّر الكانفاس (٧٩٤×١١٢٣ ثابت) بصرياً ليملأ عرض حاويته بالضبط — بلا أي scroll أفقي،
// على كل من سطح المكتب والجوال. لا يُكبَّر أبداً فوق حجمه الطبيعي.
// ملاحظة مهمة: transform: scale() بصري بحت ولا يغيّر أبعاد العنصر الفعلية
// (offsetWidth/offsetHeight)، لذا يبقى تصدير html-to-image بدقة native كاملة.

import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { A4_HEIGHT_PX as A4_HEIGHT, A4_WIDTH_PX as A4_WIDTH } from "@/lib/obituary/pageSize"

export function ResponsiveCanvasFrame({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null)
  // null حتى أول قياس (HTML الخادم لا يعرف عرض الحاوية). ارتفاع الإطار لا يعتمد
  // على هذا القياس إطلاقاً، بل على aspect-ratio أدناه — حين كان يُحسب من scale
  // (الابتدائية 1) كان الخادم يرسم الإطار بارتفاع ١١٢٣px ثم ينهار عند الترطيب،
  // ما أنتج CLS = 0.46 على الصفحة الرئيسية (فحص كاشف/Lighthouse).
  const [scale, setScale] = useState<number | null>(null)

  useLayoutEffect(() => {
    const el = outerRef.current
    if (!el) return
    const update = () => setScale(Math.min(1, el.clientWidth / A4_WIDTH))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    // flex + justify-center إلزامي هنا: هذا العنصر أعرض (٧٩٤px) من حاويته دائماً تقريباً،
    // وتوسيط صندوق block عادي عبر margin:auto لا يعمل إطلاقاً عندما يكون الصندوق أعرض من
    // حاويته — المتصفح يحسم الهامش التلقائي إلى صفر بدل توزيعه (قاعدة CSS قياسية)، فيلتصق
    // الصندوق بحافة البداية المنطقية (اليمين في RTL) ويفيض بالكامل يساراً خارج نطاق الرؤية.
    // الفلكس وحده يوسّط عنصراً أكبر من حاويته بشكل صحيح ومتماثل.
    // minHeight: 0 إلزامي مع aspect-ratio: الحد الأدنى التلقائي لصندوق بنسبة أبعاد هو
    // ارتفاع محتواه، فبدونه يتمدّد الإطار إلى ١١٢٣px ويُبطل النسبة تماماً. maxHeight
    // يطابق Math.min(1, …): لا تكبير فوق الحجم الطبيعي على الحاويات الأعرض من A4.
    <div
      ref={outerRef}
      className="flex w-full justify-center"
      style={{
        aspectRatio: `${A4_WIDTH} / ${A4_HEIGHT}`,
        minHeight: 0,
        maxHeight: A4_HEIGHT,
        overflow: scale === null ? "hidden" : undefined,
      }}
    >
      <div
        style={{
          width: A4_WIDTH,
          flexShrink: 0,
          transform: `scale(${scale ?? 1})`,
          transformOrigin: "top center",
          visibility: scale === null ? "hidden" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  )
}
