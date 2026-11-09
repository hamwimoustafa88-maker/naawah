"use client"

import { TemplatePreviewCard } from "@/components/templates/TemplatePreviewCard"
import { VISIBLE_TEMPLATES } from "@/lib/templates/registry"
import { useEditorStore } from "@/store/editorStore"
import { cn } from "@/lib/utils/cn"

// يطابق القيمة الافتراضية لـ templateId في createEmptyData() (src/store/editorStore.ts).
const DEFAULT_TEMPLATE_ID = "modern-minimal"

export function Step4Template() {
  const templateId = useEditorStore((s) => s.data.templateId)
  const setTemplate = useEditorStore((s) => s.setTemplate)

  return (
    <div className="grid grid-cols-2 gap-4">
      {VISIBLE_TEMPLATES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setTemplate(t.id)}
          aria-pressed={templateId === t.id}
          className={cn(
            "flex min-w-0 flex-col gap-2.5 rounded-xl border-2 p-2.5 text-right transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
            templateId === t.id ? "border-accent bg-accent/5" : "border-black/10 bg-white hover:border-black/25"
          )}
        >
          <TemplatePreviewCard templateId={t.id} />
          <div className="flex flex-col gap-1 px-1 pb-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold">
                {t.name}
                {t.id === DEFAULT_TEMPLATE_ID && <span className="mr-1 font-normal text-black/50">(افتراضي)</span>}
              </span>
              <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[10px] text-black/60">{t.category}</span>
            </div>
            <p className="text-xs leading-relaxed text-black/55">
              {t.id === DEFAULT_TEMPLATE_ID ? "هذا الشكل هو المستعمل في الرزنامة الرسمية لبيروت وجبل لبنان." : t.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
