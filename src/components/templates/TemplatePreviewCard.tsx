"use client"

// معاينة قالب كنعوة كاملة: نفس الكانفاس الحقيقي الذي يُصدَّر، ببيانات المستخدم إن مُرِّرت،
// وإلا ببيانات تجريبية خاصة بكل قالب (showcaseData.ts). memo إلزامي: في المحرر تُعاد
// تصيير الخطوات مع كل ضغطة مفتاح، ولا داعي لإعادة رسم النعوات كلها معها.

import { memo, useId, useMemo } from "react"
import { ObituaryCanvas } from "@/components/canvas/ObituaryCanvas"
import { ResponsiveCanvasFrame } from "@/components/canvas/ResponsiveCanvasFrame"
import type { ObituaryData } from "@/lib/obituary/types"
import { templateShowcaseData } from "@/lib/templates/showcaseData"

// templateId لا كائن القالب: صفحات /templates مكوّنات خادم، وكائن القالب يحمل Frame
// (دالة مكوّن) لا يمكن تمريرها إلى مكوّن عميل.
export const TemplatePreviewCard = memo(function TemplatePreviewCard({
  templateId, className, data,
}: {
  templateId: string
  className?: string
  data?: ObituaryData
}) {
  const id = useId()
  const previewData = useMemo(
    () => (data ? { ...data, templateId } : templateShowcaseData(templateId)),
    [data, templateId]
  )
  return (
    // aria-hidden: نص كامل لا يفيد قارئ الشاشة؛ اسم القالب ووصفه بجانب المعاينة دائماً.
    <div
      className={className}
      aria-hidden
      style={{ width: "100%", overflow: "hidden", borderRadius: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.1)", pointerEvents: "none" }}
    >
      <ResponsiveCanvasFrame>
        <ObituaryCanvas
          data={previewData}
          id={`template-preview-${id}`}
          nameHeadingLevel="div"
          ignoreFontPreview
        />
      </ResponsiveCanvasFrame>
    </div>
  )
})
