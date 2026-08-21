"use client"

// إطار A4 ثابت المقاس + auto-fit + حقن توكنات القالب كمتغيّرات CSS.
// هذا العنصر نفسه هو ما يُصدَّر عبر html-to-image (id="obituary-canvas").

import { ObituaryContent } from "@/components/canvas/blocks/ObituaryBlocks"
import { useAutoFit } from "@/components/canvas/useAutoFit"
import { getTemplate } from "@/lib/templates/registry"
import type { ObituaryData } from "@/lib/obituary/types"

export function ObituaryCanvas({ data, id = "obituary-canvas" }: { data: ObituaryData; id?: string }) {
  const template = getTemplate(data.templateId)
  const { tokens, Frame } = template
  const { containerRef, contentRef, scale } = useAutoFit([data])

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
        <ObituaryContent data={data} template={template} scale={scale} />
      </div>
    </div>
  )
}
