"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { ChevronDown, Download, FileText, ImageIcon, Loader2, Printer, Share2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ExtraExportActions } from "@/components/editor/ExtraExportActions"
import { TextSettingsPanel } from "@/components/editor/TextSettingsPanel"
import { useGuardedExport, type GuardedExportKind } from "@/components/editor/useGuardedExport"

const ROW_BUTTON_CLASS = "min-w-0 flex-auto gap-1.5 whitespace-nowrap px-2 text-xs"
/** على الهاتف: أيقونة فوق نص صغير، فتتسع الأزرار بنصوصها في سطر واحد. */
export const STACKED_BUTTON_CLASS = "h-14 min-w-0 flex-1 flex-col gap-1 px-1 text-[11px] leading-tight"

const DOWNLOAD_OPTIONS = [
  { kind: "png", label: "صورة PNG", Icon: ImageIcon },
  { kind: "pdf", label: "PDF (A4)", Icon: FileText },
  { kind: "print", label: "PDF للمطبعة", Icon: Printer },
] as const

/** زر "تحميل" واحد يفتح قائمة الصيغ. القائمة تُفتح لأعلى لأن الزر في أسفل عمود المعاينة. */
function DownloadMenu({
  stacked,
  busy,
  onSelect,
}: {
  stacked: boolean
  busy: GuardedExportKind | null
  onSelect: (kind: GuardedExportKind) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const iconSize = stacked ? 18 : 14
  const downloading = DOWNLOAD_OPTIONS.some((option) => option.kind === busy)

  useEffect(() => {
    if (!open) return
    rootRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return
      setOpen(false)
      rootRef.current?.querySelector("button")?.focus()
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const moveFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return
    e.preventDefault()
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'))
    const current = items.indexOf(document.activeElement as HTMLElement)
    items[(current + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length].focus()
  }

  return (
    <div ref={rootRef} className={stacked ? "relative min-w-0 flex-1" : "relative min-w-0 flex-auto"}>
      <Button
        onClick={() => setOpen((v) => !v)}
        disabled={busy !== null}
        size="sm"
        aria-haspopup="menu"
        aria-expanded={open}
        className={`${stacked ? STACKED_BUTTON_CLASS : ROW_BUTTON_CLASS} w-full`}
      >
        {downloading ? <Loader2 size={iconSize} className="animate-spin" /> : <Download size={iconSize} />}
        <span className="flex items-center gap-1">
          تحميل
          <ChevronDown size={12} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
        </span>
      </Button>

      {open && (
        <div
          role="menu"
          aria-label="صيغة التحميل"
          onKeyDown={moveFocus}
          className="absolute start-0 bottom-full z-20 mb-1.5 flex w-44 flex-col rounded-lg border border-black/10 bg-white p-1 text-foreground shadow-lg"
        >
          {DOWNLOAD_OPTIONS.map(({ kind, label, Icon }) => (
            <button
              key={kind}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                onSelect(kind)
              }}
              className="flex min-h-10 items-center gap-2 rounded-md px-2.5 text-right text-sm font-medium transition-colors hover:bg-black/5 focus-visible:bg-black/5 focus-visible:outline-none"
            >
              <Icon size={16} className="text-accent" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** زر التحميل + المشاركة + زر "إعدادات النصوص" الذي يمرّره المستدعي، في سطر واحد دائماً. */
export function ExportActions({ stacked = false, settingsButton }: { stacked?: boolean; settingsButton: ReactNode }) {
  const { busy, error, run, dialog } = useGuardedExport()
  const buttonClass = stacked ? STACKED_BUTTON_CLASS : ROW_BUTTON_CLASS
  const iconSize = stacked ? 18 : 14

  return (
    <>
      <div className="flex gap-1.5">
        <DownloadMenu stacked={stacked} busy={busy} onSelect={run} />
        <Button onClick={() => run("share")} disabled={busy !== null} variant="outline" size="sm" className={buttonClass}>
          {busy === "share" ? <Loader2 size={iconSize} className="animate-spin" /> : <Share2 size={iconSize} />}
          مشاركة
        </Button>
        {settingsButton}
      </div>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      {dialog}
    </>
  )
}

export function ExportBar() {
  return (
    <div className="flex flex-col gap-3 border-t border-black/10 pt-4">
      <ExportActions
        settingsButton={
          <div className="min-w-0 flex-auto">
            <TextSettingsPanel triggerClassName="inline-flex h-8 w-full items-center justify-center whitespace-nowrap rounded-lg border border-black/15 px-2 text-xs font-medium text-foreground transition-colors hover:bg-black/5" />
          </div>
        }
      />
      <ExtraExportActions />
      <p className="text-xs leading-relaxed text-black/45">
        ملاحظة هامة: باستخدامك لهذا التطبيق فإنك تتعهد بصحة المعلومات والبيانات الواردة في تصميم النعوة.
        عند التصدير تُحفظ نسخة من النعوة في أرشيف الموقع (<Link href="/privacy" prefetch={false} className="underline">التفاصيل</Link>).
      </p>
    </div>
  )
}
