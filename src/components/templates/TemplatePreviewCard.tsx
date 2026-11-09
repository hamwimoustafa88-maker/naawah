"use client"

// معاينة قالب كنعوة كاملة: نفس الكانفاس الحقيقي الذي يُصدَّر، ببيانات تجريبية خاصة بكل
// قالب (showcaseData.ts). memo إلزامي: في المحرر تُعاد تصيير الخطوات مع كل ضغطة مفتاح،
// ولا داعي لإعادة رسم سبع نعوات كاملة معها.

import { memo, useId } from "react"
import { ObituaryCanvas } from "@/components/canvas/ObituaryCanvas"
import { ResponsiveCanvasFrame } from "@/components/canvas/ResponsiveCanvasFrame"
import { templateShowcaseData } from "@/lib/templates/showcaseData"

// templateId لا كائن القالب: صفحات /templates مكوّنات خادم، وكائن القالب يحمل Frame
// (دالة مكوّن) لا يمكن تمريرها إلى مكوّن عميل.
export const TemplatePreviewCard = memo(function TemplatePreviewCard({
  templateId, className,
}: {
  templateId: string
  className?: string
}) {
  const id = useId()
  return (
    // aria-hidden: نص تجريبي كامل لا يفيد قارئ الشاشة؛ اسم القالب ووصفه بجانب المعاينة دائماً.
    <div
      className={className}
      aria-hidden
      style={{ width: "100%", overflow: "hidden", borderRadius: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.1)", pointerEvents: "none" }}
    >
      <ResponsiveCanvasFrame>
        <ObituaryCanvas
          data={templateShowcaseData(templateId)}
          id={`template-preview-${id}`}
          nameHeadingLevel="div"
          ignoreFontPreview
        />
      </ResponsiveCanvasFrame>
    </div>
  )
})
