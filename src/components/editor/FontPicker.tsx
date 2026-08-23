"use client"

// قائمة خطوط مخصّصة (بديلة عن <select> الأصلي) — تسمح بمعاينة الخط في الكانفاس
// الحيّ فوراً عند تمرير المؤشر فوق اسمه، **على شاشة الكمبيوتر فقط** (بلا إذن سبق
// اختياره صراحةً؛ عناصر <select> الأصلية لا تُطلق أحداث hover على كل <option> بشكل
// موثوق عبر المتصفحات، فاستبدالها بقائمة مخصّصة كان إلزامياً لتحقيق هذا الطلب).
// النقر فقط يُثبّت الخط فعلياً؛ مغادرة المؤشر بلا نقر "لا تعني شيئاً" — تُعيد
// المعاينة لآخر خط مُثبَّت فعلياً عبر onPreview(undefined)، كما طُلب حرفياً.

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { ChevronDown } from "lucide-react"
import { TEXT_FONT_OPTIONS } from "@/lib/textFonts"
import { cn } from "@/lib/utils/cn"
import { FIELD_BASE } from "@/components/ui/Field"

const HOVER_QUERY = "(hover: hover) and (pointer: fine)"

function subscribeHoverCapable(callback: () => void) {
  const mql = window.matchMedia(HOVER_QUERY)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

/** true فقط على أجهزة بمؤشر دقيق حقيقي (فأرة) — لا نُفعّل معاينة hover على اللمس
 * (قد تُطلق المتصفحات أحداث hover/leave بشكل غير متوقع عند أول لمسة).
 * useSyncExternalStore (لا useState+useEffect) لأنها قراءة متزامنة من واجهة
 * متصفح خارجية — النمط الموصى به رسمياً، آمن عبر SSR (getServerSnapshot=false،
 * إذ لا يوجد window على الخادم إطلاقاً). */
function useHoverCapable(): boolean {
  return useSyncExternalStore(
    subscribeHoverCapable,
    () => window.matchMedia(HOVER_QUERY).matches,
    () => false
  )
}

export function FontPicker({
  value, onChange, onPreview,
}: {
  /** cssVar المُثبَّت فعلياً، أو "" لـ"افتراضي القالب". */
  value: string
  onChange: (v: string | undefined) => void
  /** معاينة عابرة — تُستدعى بـcssVar عند hover، وbـundefined عند مغادرة المؤشر
   * (أو إغلاق القائمة بلا اختيار). اختيارية: تُهمَل صامتة على أجهزة اللمس. */
  onPreview?: (v: string | undefined) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const hoverCapable = useHoverCapable()

  const selectedLabel = TEXT_FONT_OPTIONS.find((f) => f.cssVar === value)?.label ?? "افتراضي القالب"

  const close = () => {
    setOpen(false)
    onPreview?.(undefined)
  }

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close مُعاد إنشاؤها كل تصيير، تعتمد فقط على open فعلياً
  }, [open])

  const select = (v: string | undefined) => {
    onChange(v)
    onPreview?.(undefined)
    setOpen(false)
  }

  const previewProps = (v: string | undefined) =>
    hoverCapable ? { onMouseEnter: () => onPreview?.(v), onMouseLeave: () => onPreview?.(undefined) } : {}

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(FIELD_BASE, "flex items-center justify-between gap-2 text-right")}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={16} className="shrink-0 text-black/45" />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border border-black/15 bg-white py-1 shadow-lg">
          <button
            type="button"
            {...previewProps(undefined)}
            onClick={() => select(undefined)}
            className={cn(
              "block w-full px-3 py-2 text-right text-sm hover:bg-accent/10",
              !value && "bg-accent/10 font-medium"
            )}
          >
            افتراضي القالب
          </button>
          {TEXT_FONT_OPTIONS.map((f) => (
            <button
              key={f.id}
              type="button"
              {...previewProps(f.cssVar)}
              onClick={() => select(f.cssVar)}
              style={{ fontFamily: f.cssVar }}
              className={cn(
                "block w-full px-3 py-2 text-right text-sm hover:bg-accent/10",
                value === f.cssVar && "bg-accent/10 font-medium"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
