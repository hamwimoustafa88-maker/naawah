"use client"

// تعبئة صيغ النعي في الأدلّة من نعوات المستخدم المحفوظة في متصفحه: SavedObituaryPicker
// يختار النعوة (الأحدث افتراضياً) وكل <Fill> داخل ملف MDX يقرأ قيمته. HTML الخادم يبقى
// القالب العام، والتعبئة تجري في المتصفح فقط فلا تغادر البيانات الجهاز.

import { useEffect, useState, type ReactNode } from "react"
import { create } from "zustand"
import { listSavedObituaries, type SavedObituary } from "@/lib/drafts/savedObituaries"
import { guideFieldValues, type GuideField, type GuideFieldValues } from "@/lib/obituary/guideFill"
import { deceasedNameLine } from "@/lib/obituary/render"
import type { Gender } from "@/lib/obituary/types"

interface Selection {
  gender: Gender
  values: GuideFieldValues
}

const useGuideSelection = create<{ selection: Selection | null }>(() => ({ selection: null }))

function select(item: SavedObituary | undefined) {
  useGuideSelection.setState({
    selection: item ? { gender: item.data.deceased.gender, values: guideFieldValues(item.data) } : null,
  })
}

/** gender: الصيغ مكتوبة لجنس محدد، فلا تُعبَّأ ببيانات فقيد من الجنس الآخر. */
export function Fill({ field, gender, children }: { field: GuideField; gender: Gender; children: ReactNode }) {
  const value = useGuideSelection((state) =>
    state.selection?.gender === gender ? state.selection.values[field] : undefined
  )
  return value ? <span className="font-medium text-(--home-accent)">{value}</span> : <>{children}</>
}

const NONE = ""

export function SavedObituaryPicker() {
  const [items, setItems] = useState<SavedObituary[]>([])
  const [selectedId, setSelectedId] = useState(NONE)

  useEffect(() => {
    let cancelled = false
    listSavedObituaries()
      .then((saved) => {
        if (cancelled) return
        setItems(saved)
        setSelectedId(saved[0]?.id ?? NONE)
        select(saved[0])
      })
      .catch(console.error)
    return () => {
      cancelled = true
      select(undefined)
    }
  }, [])

  if (items.length === 0) return null

  return (
    <div className="mb-6 rounded-xl border border-(--home-border) bg-(--home-surface) p-4">
      <label htmlFor="guide-obituary" className="mb-1.5 block text-sm font-bold text-(--home-fg)">
        املأ الصيغ من نعواتك المحفوظة
      </label>
      <select
        id="guide-obituary"
        value={selectedId}
        onChange={(e) => {
          setSelectedId(e.target.value)
          select(items.find((item) => item.id === e.target.value))
        }}
        className="w-full rounded-lg border border-(--home-border) bg-(--home-bg) px-3 py-2 text-sm text-(--home-fg) focus:outline-none focus:ring-2 focus:ring-(--home-accent)/30"
      >
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {deceasedNameLine(item.data.deceased) || "نعوة بدون اسم"} — {new Date(item.lastUsedAt).toLocaleDateString("ar")}
          </option>
        ))}
        <option value={NONE}>عرض الصيغ بلا بيانات</option>
      </select>
      <p className="mt-2 text-xs leading-relaxed text-(--home-muted)">
        تُعبَّأ الصيغ المناسبة لجنس الفقيد من بيانات محفوظة في متصفحك فقط، وما لم تُدخله يبقى بين قوسين.
      </p>
    </div>
  )
}
