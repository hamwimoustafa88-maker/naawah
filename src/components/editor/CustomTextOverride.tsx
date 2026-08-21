"use client"

// عنصر تحكم عام لأي نص ثابت قابل للتخصيص (customTexts) — يعرض القيمة المحسوبة
// افتراضياً كمعاينة، ويسمح بتفعيل نص حرّ بدلاً منها عبر مفتاح واحد.

import { useState } from "react"
import { Checkbox, Label, Textarea } from "@/components/ui/Field"

export function CustomTextOverride({
  label, computedDefault, value, onChange,
}: {
  label: string
  computedDefault: string
  value?: string
  onChange: (v: string | undefined) => void
}) {
  const [isCustom, setIsCustom] = useState(Boolean(value))

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <Label className="mb-0">{label}</Label>
        <Checkbox
          label="تخصيص"
          checked={isCustom}
          onChange={(e) => {
            setIsCustom(e.target.checked)
            if (!e.target.checked) {
              onChange(undefined)
            } else if (!value) {
              // نملأ النص الحقيقي المحسوب فور التفعيل بدل ترك مربع فارغ برمادي
              // placeholder فقط — كان هذا يوحي بأن الحقل غير قابل للتحرير فعلياً.
              onChange(computedDefault)
            }
          }}
        />
      </div>
      {isCustom ? (
        <Textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={computedDefault} />
      ) : (
        <p className="rounded-lg border border-dashed border-black/15 bg-black/2 px-3 py-2 text-sm text-black/50">
          {computedDefault}
        </p>
      )}
    </div>
  )
}
