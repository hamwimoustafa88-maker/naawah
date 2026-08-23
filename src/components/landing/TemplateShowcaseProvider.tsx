"use client"

// سياق مشترك بين الهيرو (LivePreview + زر فتح المعرض) ومعرض القوالب (TemplateGallery،
// بوب أب الآن لا قسماً مضمّناً) — كلاهما يبدّل نفس الكانفاس الحيّ الوحيد في الصفحة،
// فلا داعي لتشغيل نسخة useAutoFit منفصلة لكل قالب من القوالب السبعة. حالة فتح/إغلاق
// البوب أب أُضيفت هنا أيضاً كي يتمكّن أي عنصر (زر الهيرو، لاحقاً غيره) من فتحه دون
// تمرير props عبر شجرة الصفحة.

import { createContext, useContext, useState, type ReactNode } from "react"
import { VISIBLE_TEMPLATES as TEMPLATES } from "@/lib/templates/registry"

interface TemplateShowcaseContextValue {
  templateId: string
  setTemplateId: (id: string) => void
  isGalleryOpen: boolean
  openGallery: () => void
  closeGallery: () => void
}

const TemplateShowcaseContext = createContext<TemplateShowcaseContextValue | null>(null)

const DEFAULT_TEMPLATE_ID = "royal-monogram"

export function TemplateShowcaseProvider({ children }: { children: ReactNode }) {
  const [templateId, setTemplateId] = useState(
    TEMPLATES.some((t) => t.id === DEFAULT_TEMPLATE_ID) ? DEFAULT_TEMPLATE_ID : TEMPLATES[0].id
  )
  const [isGalleryOpen, setGalleryOpen] = useState(false)

  return (
    <TemplateShowcaseContext.Provider
      value={{
        templateId,
        setTemplateId,
        isGalleryOpen,
        openGallery: () => setGalleryOpen(true),
        closeGallery: () => setGalleryOpen(false),
      }}
    >
      {children}
    </TemplateShowcaseContext.Provider>
  )
}

export function useTemplateShowcase() {
  const ctx = useContext(TemplateShowcaseContext)
  if (!ctx) throw new Error("useTemplateShowcase يجب أن يُستعمل داخل TemplateShowcaseProvider")
  return ctx
}
