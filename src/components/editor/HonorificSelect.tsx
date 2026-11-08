"use client"

import { useState } from "react"
import { honorificsFor } from "@/lib/obituary/defaults"
import type { Gender } from "@/lib/obituary/types"
import { Input, Select } from "@/components/ui/Field"

const OTHER_VALUE = "__other__"

/**
 * قائمة ألقاب منسدلة تتبع جنس صاحب اللقب، وآخر خيار فيها "أخرى" يفتح حقلاً حراً.
 * تُعيد Fragment (لا حاوية) ليقرّر المكوّن الأب ترتيب القائمة والحقل الحرّ.
 * لقب محفوظ خارج القائمة (بيانات مستوردة مثلاً) يُعرض تلقائياً كـ"أخرى" بلا فقدان قيمته.
 */
export function HonorificSelect({
  value, gender, onChange, emptyLabel, className, customClassName,
}: {
  value: string | undefined
  gender: Gender
  onChange: (value: string) => void
  emptyLabel: string
  className?: string
  customClassName?: string
}) {
  const options = honorificsFor(gender)
  // حالة منفصلة لأن "أخرى" تُختار والقيمة لا تزال فارغة، فلا يمكن اشتقاقها من القيمة وحدها.
  const [customOpen, setCustomOpen] = useState(false)
  const isCustom = customOpen || (Boolean(value) && !options.includes(value ?? ""))

  return (
    <>
      <Select
        className={className}
        value={isCustom ? OTHER_VALUE : (value ?? "")}
        onChange={(e) => {
          const next = e.target.value
          setCustomOpen(next === OTHER_VALUE)
          onChange(next === OTHER_VALUE ? "" : next)
        }}
      >
        <option value="">{emptyLabel}</option>
        {options.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
        <option value={OTHER_VALUE}>أخرى</option>
      </Select>
      {isCustom && (
        <Input
          autoFocus={customOpen}
          className={customClassName}
          placeholder="اكتب اللقب"
          value={value ?? ""}
          onChange={(e) => {
            // يُبقي الحقل مفتوحاً حتى لو مسح المستخدم كل النص أثناء الكتابة.
            setCustomOpen(true)
            onChange(e.target.value)
          }}
        />
      )}
    </>
  )
}
