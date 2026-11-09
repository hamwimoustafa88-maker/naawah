"use client"

import { useEffect, useState } from "react"
import { TemplatePreviewCard } from "@/components/templates/TemplatePreviewCard"
import { VISIBLE_TEMPLATES } from "@/lib/templates/registry"
import { useEditorStore } from "@/store/editorStore"

// ست نعوات كاملة تُعاد قياساتها مع كل تحديث، فلا تتبع كل ضغطة مفتاح.
const PREVIEW_DELAY_MS = 500

/** القوالب الأخرى معروضة بنعوة المستخدم نفسها، والقالب الحالي ظاهر أصلاً في المعاينة الرئيسية. */
export function Step4Template() {
  const data = useEditorStore((s) => s.data)
  const setTemplate = useEditorStore((s) => s.setTemplate)
  const [previewData, setPreviewData] = useState(data)

  useEffect(() => {
    const timer = setTimeout(() => setPreviewData(data), PREVIEW_DELAY_MS)
    return () => clearTimeout(timer)
  }, [data])

  const current = VISIBLE_TEMPLATES.find((t) => t.id === data.templateId)
  // نعوة بلا اسم تكاد تكون فارغة، فتُعرض معها النماذج التجريبية لكل قالب.
  const realData = previewData.deceased.name.trim() ? previewData : undefined

  return (
    <div className="flex flex-col gap-2.5">
      {current && (
        <p className="text-xs text-black/55">
          القالب الحالي: <span className="font-bold text-black/75">{current.name}</span>
        </p>
      )}
      <div className="grid grid-cols-3 gap-2.5">
        {VISIBLE_TEMPLATES.filter((t) => t.id !== data.templateId).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTemplate(t.id)}
            title={t.description}
            className="flex min-w-0 flex-col gap-1.5 rounded-lg border border-black/10 bg-white p-1.5 text-center transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <TemplatePreviewCard templateId={t.id} data={realData} />
            <span className="text-[11px] font-bold leading-tight">{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
