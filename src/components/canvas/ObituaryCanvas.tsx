"use client"

// إطار A4 ثابت المقاس + auto-fit + حقن توكنات القالب كمتغيّرات CSS.
// هذا العنصر نفسه هو ما يُصدَّر عبر html-to-image (id="obituary-canvas").

import { useEffect } from "react"
import { ObituaryContent } from "@/components/canvas/blocks/ObituaryBlocks"
import { SOFT_MIN_SCALE, useAutoFit } from "@/components/canvas/useAutoFit"
import { getTemplate } from "@/lib/templates/registry"
import type { ObituaryData } from "@/lib/obituary/types"
import { useEditorStore } from "@/store/editorStore"

export function ObituaryCanvas({
  data, id = "obituary-canvas", nameHeadingLevel = "h1", ignoreFontPreview = false, reportFit = false,
}: {
  data: ObituaryData
  id?: string
  /** يُمرَّر حرفياً إلى ObituaryContent — راجع تعليقها هناك. "h1" افتراضياً (صحيح
   * دائماً داخل /create). مرِّر "div" فقط حين يُستهلَك هذا الكانفاس ضمن صفحة لها
   * h1 خاص بها فعلاً (مثال: LivePreview.tsx على الصفحة الرئيسية). */
  nameHeadingLevel?: "h1" | "div"
  /** معاينات القوالب تتجاهل معاينة الخط العابرة، فهي تخص نعوة المستخدم وحدها. */
  ignoreFontPreview?: boolean
  /** نسختا المحرر فقط تبلّغان حالة الملاءمة، لا معاينات القوالب. */
  reportFit?: boolean
}) {
  const template = getTemplate(data.templateId)
  const { tokens, Frame } = template
  const { containerRef, contentRef, scale, tightness } = useAutoFit([data], data.funeral.autoFillPage ?? true)
  const setFitStatus = useEditorStore((s) => s.setFitStatus)

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    // النسخة المخفية (سطح المكتب/الجوال) بلا أبعاد، فقياسها لا يعني شيئاً.
    if (!reportFit || !container || !content || container.clientHeight === 0) return
    if (content.scrollHeight > container.clientHeight) setFitStatus("overflow")
    else setFitStatus(scale < SOFT_MIN_SCALE ? "small" : "ok")
  }, [reportFit, data, scale, tightness, containerRef, contentRef, setFitStatus])

  return (
    <div
      ref={containerRef}
      id={id}
      style={{
        width: "var(--a4-width)",
        height: "var(--a4-height)",
        background: tokens.bg,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        // @ts-expect-error -- متغيّرات CSS مخصّصة للقالب، تُقرأ عبر var() في الإطارات والكتل
        "--tpl-bg": tokens.bg,
        "--tpl-ink": tokens.ink,
        "--tpl-accent": tokens.accent,
        "--tpl-muted": tokens.muted,
      }}
    >
      <Frame className="absolute inset-0 h-full w-full" />
      <div ref={contentRef} style={{ position: "relative" }}>
        <ObituaryContent data={data} template={template} scale={scale} nameHeadingLevel={nameHeadingLevel} ignoreFontPreview={ignoreFontPreview} />
      </div>
    </div>
  )
}
