"use client"

// منطق التصدير المشترك بين شريط التصدير وترويسة المحرر: حالة الانشغال والخطأ،
// ونافذة التنبيهات قبل التصدير. portal إلزامي لأن ترويسة z-60 تعلو أي نافذة داخل اللوحة الجانبية.

import { useState } from "react"
import { createPortal } from "react-dom"
import { AlertTriangle } from "lucide-react"
import { createPublicLink, exportPdf, exportPng, exportPrintPdf, exportShare, type ExportKind } from "@/lib/export/actions"
import { exportIssues } from "@/lib/obituary/exportChecks"
import { useEditorStore } from "@/store/editorStore"

export type GuardedExportKind = ExportKind | "link"

const ERROR_MESSAGES: Record<GuardedExportKind, string> = {
  png: "تعذّر تصدير الصورة. حاول مجدداً.",
  pdf: "تعذّر تصدير PDF. حاول مجدداً.",
  print: "تعذّر تجهيز نسخة المطبعة. حاول مجدداً.",
  share: "تعذّرت المشاركة. حاول مجدداً.",
  link: "تعذّر إنشاء الرابط. تأكّد من اتصالك وحاول مجدداً.",
}

export function useGuardedExport() {
  const data = useEditorStore((s) => s.data)
  const archiveKey = useEditorStore((s) => s.archiveKey)
  const fitStatus = useEditorStore((s) => s.fitStatus)
  const [busy, setBusy] = useState<GuardedExportKind | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [publicLink, setPublicLink] = useState<string | null>(null)
  const [pending, setPending] = useState<{ kind: GuardedExportKind; issues: string[] } | null>(null)

  const perform = async (kind: GuardedExportKind) => {
    setPending(null)
    setBusy(kind)
    setError(null)
    try {
      if (kind === "png") await exportPng(data, archiveKey)
      else if (kind === "pdf") await exportPdf(data, archiveKey)
      else if (kind === "print") await exportPrintPdf(data, archiveKey)
      else if (kind === "share") await exportShare(data, archiveKey)
      else setPublicLink(await createPublicLink(data, archiveKey))
    } catch (err) {
      setError(ERROR_MESSAGES[kind])
      console.error(err)
    } finally {
      setBusy(null)
    }
  }

  const run = (kind: GuardedExportKind) => {
    const issues = exportIssues(data, fitStatus)
    if (issues.length > 0) setPending({ kind, issues })
    else void perform(kind)
  }

  const dialog = pending
    ? createPortal(
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 p-4" onClick={() => setPending(null)}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label="تنبيه قبل التصدير"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-sm flex-col gap-3 rounded-xl bg-white p-4 text-foreground shadow-xl"
          >
            <h2 className="flex items-center gap-2 text-base font-bold">
              <AlertTriangle size={18} className="text-amber-600" />
              النعوة غير مكتملة
            </h2>
            <ul className="flex list-inside list-disc flex-col gap-1 text-sm">
              {pending.issues.map((issue) => <li key={issue}>{issue}</li>)}
            </ul>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => void perform(pending.kind)} className="rounded-lg border border-black/15 px-3 py-2 text-sm font-medium">
                المتابعة رغم ذلك
              </button>
              <button type="button" onClick={() => setPending(null)} className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white">
                العودة للتعديل
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null

  return { busy, error, run, dialog, publicLink, clearPublicLink: () => setPublicLink(null) }
}
