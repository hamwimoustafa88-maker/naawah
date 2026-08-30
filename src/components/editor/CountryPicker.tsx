"use client"

// منتقي "بلد الأصل" — قائمة بحث (لا <select> عادي) تعرض علم كل دولة لتسهيل
// التصفّح البصري + مربّع بحث فوري، وخيار "دولة أخرى" في آخر القائمة يفتح حقل
// نص حرّ لأي دولة غير مُدرَجة. الأعلام هنا للقائمة فقط — القيمة المخزَّنة
// (birthCountry) اسم الدولة نصّاً وحده بلا أي رمز/علم، فلا يظهر أي علم في
// النعوة المطبوعة إطلاقاً (طُلب صراحةً). راجع WORLD_COUNTRIES في lib/obituary/defaults.ts.
//
// الأعلام صور SVG حقيقية من حزمة flag-icons (مستضافة ذاتياً، لا CDN خارجي —
// راجع استيراد CSS في app/create/layout.tsx)، لا إيموجي علم نصّي — جُرِّب
// الإيموجي أولاً وفشل عملياً: وندوز لا يرسم أعلام الإيموجي إطلاقاً (تصميم
// متعمَّد من مايكروسوفت)، فيظهر حرفا رمز الدولة كنص عادي ("LB") بدل 🇱🇧 —
// عطل حقيقي واجهناه على متصفح مستخدم فعلي على ويندوز. لا تُعِد تجربة الإيموجي.

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import { WORLD_COUNTRIES } from "@/lib/obituary/defaults"
import { cn } from "@/lib/utils/cn"
import { FIELD_BASE, Input } from "@/components/ui/Field"

/** علم دولة واحد — حجم ثابت صغير مناسب لسطر قائمة، بحدّ خفيف وزوايا مدوَّرة. */
function FlagIcon({ code }: { code: string }) {
  return (
    <span
      className={cn(`fi fi-${code.toLowerCase()}`, "shrink-0 rounded-xs shadow-[0_0_0_1px_rgba(0,0,0,0.1)]")}
      aria-hidden="true"
    />
  )
}

export function CountryPicker({
  value, onChange,
}: {
  /** اسم الدولة المُخزَّن، أو "" إن لم تُختَر دولة بعد. */
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const rootRef = useRef<HTMLDivElement>(null)

  const matchedCountry = WORLD_COUNTRIES.find((c) => c.name === value)
  // "وضع الكتابة الحرّة": القيمة محفوظة لكنها لا تطابق أي دولة في القائمة —
  // إمّا لم تُختَر دولة بعد أساساً، أو المستخدم كتب اسماً حراً سابقاً عبر
  // "دولة أخرى" (فيبقى قابلاً للتعديل في نفس الوضع عند إعادة فتح القسم).
  const [customMode, setCustomMode] = useState(Boolean(value) && !matchedCountry)

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return WORLD_COUNTRIES
    return WORLD_COUNTRIES.filter((c) => c.name.includes(q))
  }, [query])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
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

  if (customMode) {
    return (
      <div className="flex items-center gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="اكتب اسم الدولة" className="flex-1" />
        <button
          type="button"
          onClick={() => setCustomMode(false)}
          className="shrink-0 text-xs font-medium text-accent hover:underline"
        >
          اختيار من القائمة
        </button>
      </div>
    )
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(FIELD_BASE, "flex items-center justify-between gap-2 text-right")}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          {matchedCountry ? (
            <>
              <FlagIcon code={matchedCountry.code} />
              <span className="truncate">{matchedCountry.name}</span>
            </>
          ) : (
            "—"
          )}
        </span>
        <ChevronDown size={16} className="shrink-0 text-black/45" />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-black/15 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-black/10 px-3 py-2">
            <Search size={14} className="shrink-0 text-black/40" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن دولة…"
              className="w-full text-sm outline-none placeholder:text-black/35"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c.name)
                  setOpen(false)
                  setQuery("")
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-1.5 text-right text-sm hover:bg-accent/10",
                  value === c.name && "bg-accent/10 font-medium"
                )}
              >
                <FlagIcon code={c.code} />
                <span className="truncate">{c.name}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="px-3 py-2 text-xs text-black/40">لا نتائج مطابقة</p>}
            <button
              type="button"
              onClick={() => {
                setCustomMode(true)
                setOpen(false)
                setQuery("")
              }}
              className="block w-full border-t border-black/10 px-3 py-1.5 text-right text-sm text-accent hover:bg-accent/10"
            >
              دولة أخرى (كتابة حرّة)…
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
