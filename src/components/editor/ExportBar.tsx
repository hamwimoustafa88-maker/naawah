"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { Download, FileText, Loader2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ExtraExportActions } from "@/components/editor/ExtraExportActions"
import { TextSettingsPanel } from "@/components/editor/TextSettingsPanel"
import { useGuardedExport } from "@/components/editor/useGuardedExport"

const ROW_BUTTON_CLASS = "min-w-0 flex-auto gap-1.5 whitespace-nowrap px-2 text-xs"
/** على الهاتف: أيقونة فوق نص صغير، فتتسع الأزرار الأربعة بنصوصها في سطر واحد. */
export const STACKED_BUTTON_CLASS = "h-14 min-w-0 flex-1 flex-col gap-1 px-1 text-[11px] leading-tight"

/** أزرار التصدير الثلاثة + زر "إعدادات النصوص" الذي يمرّره المستدعي، في سطر واحد دائماً. */
export function ExportActions({ stacked = false, settingsButton }: { stacked?: boolean; settingsButton: ReactNode }) {
  const { busy, error, run, dialog } = useGuardedExport()
  const buttonClass = stacked ? STACKED_BUTTON_CLASS : ROW_BUTTON_CLASS
  const iconSize = stacked ? 18 : 14

  return (
    <>
      <div className="flex gap-1.5">
        <Button onClick={() => run("png")} disabled={busy !== null} size="sm" className={buttonClass}>
          {busy === "png" ? <Loader2 size={iconSize} className="animate-spin" /> : <Download size={iconSize} />}
          {stacked ? "تحميل PNG" : "تحميل صورة PNG"}
        </Button>
        <Button onClick={() => run("pdf")} disabled={busy !== null} variant="secondary" size="sm" className={buttonClass}>
          {busy === "pdf" ? <Loader2 size={iconSize} className="animate-spin" /> : <FileText size={iconSize} />}
          {stacked ? "تحميل PDF" : "تحميل PDF (A4)"}
        </Button>
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
