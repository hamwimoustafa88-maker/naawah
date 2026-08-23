"use client"

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
          className={cn(
            "flex flex-col gap-2 rounded-xl border-2 p-4 text-right transition-colors",
            templateId === t.id ? "border-accent bg-accent/5" : "border-black/10 hover:border-black/25"
          )}
          style={{ background: templateId === t.id ? undefined : t.tokens.bg }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">
              {t.name}
              {t.id === DEFAULT_TEMPLATE_ID && <span className="mr-1 font-normal text-black/50">(افتراضي)</span>}
            </span>
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] text-black/60">{t.category}</span>
          </div>
          <p className="text-xs leading-relaxed text-black/55">
            {t.id === DEFAULT_TEMPLATE_ID ? "هذا الشكل هو المستعمل في الرزنامة الرسمية لبيروت وجبل لبنان." : t.description}
          </p>
          <div
            className="mt-1 h-10 rounded-md border"
            style={{ borderColor: t.tokens.accent, color: t.tokens.ink, fontFamily: t.tokens.nameFont }}
          >
            <div className="flex h-full items-center justify-center text-sm">{t.divider || "الاسم"} فلان الفلاني {t.divider}</div>
          </div>
        </button>
      ))}
    </div>
  )
}
