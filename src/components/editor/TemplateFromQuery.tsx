"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useEditorStore } from "@/store/editorStore"
import { VISIBLE_TEMPLATES } from "@/lib/templates/registry"

/**
 * يقرأ ?template=<id> من رابط "صمّم نعوتك بهذا القالب" في صفحة القالب
 * (`/templates/[slug]`) ويُطبّقه على المتجر عند أول تحميل لـ/create فقط —
 * بلا ذلك، النقر على الزر كان يفتح المحرر بالقالب الافتراضي (modern-minimal)
 * دائماً بصرف النظر عن القالب المعروض فعلاً في تلك الصفحة.
 * لا يُعاد تطبيقه بعد التركيب الأول (مثال: مستخدم يغيّر القالب يدوياً من
 * (٤. القالب) لاحقاً — لا يجب أن يُفرض قالب الرابط فوق اختياره).
 * مُغلَّف بـ<Suspense> في create/page.tsx لأن useSearchParams يتطلّب ذلك
 * صراحة في App Router.
 */
export function TemplateFromQuery() {
  const searchParams = useSearchParams()
  const setTemplate = useEditorStore((s) => s.setTemplate)

  useEffect(() => {
    const templateId = searchParams.get("template")
    if (templateId && VISIBLE_TEMPLATES.some((t) => t.id === templateId)) {
      setTemplate(templateId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- مرة واحدة عند التركيب فقط
  }, [])

  return null
}
