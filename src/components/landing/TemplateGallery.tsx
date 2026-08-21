"use client"

// معرض القوالب السبعة — بوب أب (لم يعد قسماً مضمّناً في تدفّق الصفحة، أُلغي زر
// "القوالب" من الترويسة العلوية تبعاً لذلك). يُفتح عبر GalleryTriggerButton في
// الهيرو، ويُغلق بالنقر خارج اللوحة، بمفتاح Escape، أو بزر الإغلاق. بطاقات زجاجية
// بعيّنة ألوان مبنية من t.tokens (على نمط Step4Template.tsx في المحرر)، بلا كانفاس
// مستقل لكل بطاقة. اختيار قالب يُغلق البوب أب ويُمرّر إلى المعاينة الحيّة المشتركة
// في الهيرو ليرى الزائر أثر اختياره فوراً.

import { useEffect } from "react"
import { X } from "lucide-react"
import { TEMPLATES } from "@/lib/templates/registry"
import { cn } from "@/lib/utils/cn"
import { useTemplateShowcase } from "@/components/landing/TemplateShowcaseProvider"

export function TemplateGallery() {
  const { templateId, setTemplateId, isGalleryOpen, closeGallery } = useTemplateShowcase()

  // قفل تمرير الخلفية + إغلاق بمفتاح Escape طالما البوب أب مفتوح.
  useEffect(() => {
    if (!isGalleryOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeGallery()
    }
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [isGalleryOpen, closeGallery])

  if (!isGalleryOpen) return null

  function select(id: string) {
    setTemplateId(id)
    closeGallery()
    setTimeout(() => {
      document.getElementById("live-preview")?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 50)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-title"
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="إغلاق معرض القوالب"
        onClick={closeGallery}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-(--home-bg) shadow-2xl">
        <div className="flex items-center justify-between border-b border-(--home-border) bg-(--home-surface) px-6 py-4">
          <div>
            <h2 id="gallery-title" className="text-lg font-bold">
              معرض القوالب
            </h2>
            <p className="text-xs text-(--home-muted)">٧ تصاميم إسلامية وقورة — اختر ما يليق بمقام الفقيد</p>
          </div>
          <button
            type="button"
            onClick={closeGallery}
            aria-label="إغلاق"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--home-border) text-(--home-fg) transition-colors hover:bg-(--home-bg)"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => select(t.id)}
                className={cn(
                  "flex w-full flex-col gap-3 rounded-2xl border-2 p-5 text-right transition-all",
                  templateId === t.id
                    ? "border-(--home-accent) bg-(--home-accent)/5 shadow-lg"
                    : "border-(--home-border) bg-(--home-surface) hover:-translate-y-0.5 hover:border-(--home-accent)/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{t.name}</span>
                  <span className="rounded-full bg-(--home-accent)/10 px-2 py-0.5 text-[10px] text-(--home-accent)">
                    {t.category}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-(--home-muted)">{t.description}</p>
                <div
                  className="flex h-14 items-center justify-center rounded-lg border text-sm"
                  style={{
                    background: t.tokens.bg,
                    borderColor: t.tokens.accent,
                    color: t.tokens.ink,
                    fontFamily: t.tokens.nameFont,
                  }}
                >
                  {t.divider} فلان الفلاني {t.divider}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
