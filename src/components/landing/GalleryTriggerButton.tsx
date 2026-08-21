"use client"

// زر "استعراض القوالب المتاحة" في الهيرو — يفتح بوب أب معرض القوالب بدل التمرير
// إلى قسم مضمّن (أُلغي القسم المضمّن؛ راجع TemplateGallery.tsx). مستخرج كمكوّن
// عميل صغير مستقل حتى يبقى Hero.tsx نفسه Server Component.

import { useTemplateShowcase } from "@/components/landing/TemplateShowcaseProvider"

export function GalleryTriggerButton() {
  const { openGallery } = useTemplateShowcase()

  return (
    <button
      type="button"
      onClick={openGallery}
      className="rounded-xl border border-(--home-accent) px-8 py-3.5 text-lg font-bold text-(--home-accent) transition-colors hover:bg-(--home-accent)/10"
    >
      استعراض القوالب المتاحة
    </button>
  )
}
