"use client"

// لوحة "إعدادات النصوص" — قسمان: (١) خط جميع نصوص النعوة (bodyFontFamily، يشمل كل
// شيء عدا اسم الفقيد)، و(٢) إعدادات اسم الفقيد تحديداً (الخط الأبرز في الصفحة):
// خطه المستقل، حجمه، ووزنه. كل الخطوط من كتالوج TEXT_FONT_OPTIONS المستضاف ذاتياً.
//
// TextSettingsFields مُصدَّرة مستقلة (بلا زر تشغيل ولا بوب-أوفر) لإعادة استعمالها
// كقسم كامل داخل بوتوم-شيت الجوال (mobile/sectionRegistry.tsx) — التصميم الصغير
// المُعلَّق بموضع مطلق (TextSettingsPanel أدناه) هش على الجوال أصلاً (راجع تعليق
// z-index في CreateHeader.tsx)، فالجوال يستعمل هذا القسم مباشرة داخل البوتوم-شيت
// بدل الزر المنبثق الصغير.

import { useEffect, useRef, useState } from "react"
import { Settings, X } from "lucide-react"
import { TEXT_FONT_OPTIONS } from "@/lib/textFonts"
import { useEditorStore } from "@/store/editorStore"
import { cn } from "@/lib/utils/cn"
import { Checkbox, Label, Select } from "@/components/ui/Field"
import { Button } from "@/components/ui/Button"

export function TextSettingsFields() {
  const bodyFontFamily = useEditorStore((s) => s.data.bodyFontFamily)
  const setBodyFontFamily = useEditorStore((s) => s.setBodyFontFamily)
  const nameStyle = useEditorStore((s) => s.data.nameStyle)
  const updateNameStyle = useEditorStore((s) => s.updateNameStyle)

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label>خط جميع النصوص</Label>
        <Select value={bodyFontFamily ?? ""} onChange={(e) => setBodyFontFamily(e.target.value || undefined)}>
          <option value="">افتراضي القالب</option>
          {TEXT_FONT_OPTIONS.map((f) => (
            <option key={f.id} value={f.cssVar}>{f.label}</option>
          ))}
        </Select>
      </div>

      <div className="mt-1 flex flex-col gap-3 border-t border-black/10 pt-4">
        <p className="text-xs font-bold text-black/60">إعدادات اسم الفقيد</p>

        <div>
          <Label>خط الاسم</Label>
          <Select
            value={nameStyle?.fontFamily ?? ""}
            onChange={(e) => updateNameStyle({ fontFamily: e.target.value || undefined })}
          >
            <option value="">افتراضي القالب</option>
            {TEXT_FONT_OPTIONS.map((f) => (
              <option key={f.id} value={f.cssVar}>{f.label}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label>حجم الاسم</Label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0.7}
              max={1.6}
              step={0.05}
              value={nameStyle?.sizeMultiplier ?? 1}
              onChange={(e) => updateNameStyle({ sizeMultiplier: Number(e.target.value) })}
              className="flex-1 accent-accent"
            />
            <span className="w-10 text-center text-xs tabular-nums text-black/60">
              {Math.round((nameStyle?.sizeMultiplier ?? 1) * 100)}%
            </span>
          </div>
        </div>

        <Checkbox
          label="خط عريض (تسميك الاسم)"
          checked={nameStyle?.bold ?? true}
          onChange={(e) => updateNameStyle({ bold: e.target.checked })}
        />
      </div>
    </div>
  )
}

export function TextSettingsPanel({
  placement = "up",
  triggerSize = "md",
  triggerClassName,
}: {
  placement?: "up" | "down"
  triggerSize?: "sm" | "md"
  /** إن مُرِّرت، يُستبدل زر Button المشترك (المصبوغ دائماً بألوان ثابتة) بزر خام
   * بهذه الأصناف — يسمح بمطابقة الزر لسياق بصري مختلف (مثال: ترويسة CreateHeader
   * الداكنة/الفاتحة القابلة للتبديل عبر .home-scope). */
  triggerClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // إغلاق اللوحة عند النقر خارجها أو عند الضغط على Esc
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div className="relative" ref={panelRef}>
      {triggerClassName ? (
        <button type="button" onClick={() => setOpen((v) => !v)} aria-label="إعدادات النصوص" className={triggerClassName}>
          <Settings size={16} />
        </button>
      ) : (
        <Button variant="outline" size={triggerSize} onClick={() => setOpen((v) => !v)} aria-label="إعدادات النصوص">
          <Settings size={16} />
        </Button>
      )}

      {open && (
        <div
          className={cn(
            // left-0 إلزامي: بلا مرساة أفقية صريحة، تنزلق اللوحة إلى الموضع الساكن
            // الافتراضي فتفيض خارج حافة الصفحة عند اقتراب الزر من حافتها (عطل حقيقي
            // صادفناه في ترويسة CreateHeader القريبة من الحافة اليسرى).
            "absolute left-0 z-10 w-72 rounded-xl border border-black/10 bg-white p-4 shadow-lg",
            placement === "up" ? "bottom-full mb-2" : "top-full mt-2"
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold">إعدادات النصوص</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="إغلاق"
              className="text-black/40 hover:text-black/70"
            >
              <X size={16} />
            </button>
          </div>

          <TextSettingsFields />
        </div>
      )}
    </div>
  )
}
