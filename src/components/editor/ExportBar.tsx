"use client"

import { useState } from "react"
import { Download, FileText, Loader2, Share2 } from "lucide-react"
import { useEditorStore } from "@/store/editorStore"
import { exportPdf, exportPng, exportShare, type ExportKind } from "@/lib/export/actions"
import { Button } from "@/components/ui/Button"
import { TextSettingsPanel } from "@/components/editor/TextSettingsPanel"

export function ExportBar() {
  const data = useEditorStore((s) => s.data)
  const archiveKey = useEditorStore((s) => s.archiveKey)
  const [busy, setBusy] = useState<ExportKind | null>(null)
  const [error, setError] = useState<string | null>(null)

  /** يلفّ كل عمليات التصدير الثلاث بنفس منطق busy/error. */
  const runExport = async (kind: ExportKind, errorMessage: string, action: () => Promise<void>) => {
    setBusy(kind)
    setError(null)
    try {
      await action()
    } catch (err) {
      setError(errorMessage)
      console.error(err)
    } finally {
      setBusy(null)
    }
  }

  const handlePng = () => runExport("png", "تعذّر تصدير الصورة. حاول مجدداً.", () => exportPng(data, archiveKey))
  const handlePdf = () => runExport("pdf", "تعذّر تصدير PDF. حاول مجدداً.", () => exportPdf(data, archiveKey))
  const handleShare = () => runExport("share", "تعذّرت المشاركة. حاول مجدداً.", () => exportShare(data, archiveKey))

  return (
    <div className="flex flex-col gap-3 border-t border-black/10 pt-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={handlePng} disabled={busy !== null} size="md">
          {busy === "png" ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          تحميل صورة PNG
        </Button>
        <Button onClick={handlePdf} disabled={busy !== null} variant="secondary" size="md">
          {busy === "pdf" ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          تحميل PDF (A4)
        </Button>
        <Button onClick={handleShare} disabled={busy !== null} variant="outline" size="md">
          {busy === "share" ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
          مشاركة
        </Button>
        <TextSettingsPanel />
      </div>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      <p className="text-xs leading-relaxed text-black/45">
        ملاحظة هامة: باستخدامك لهذا التطبيق فإنك تتعهد بصحة المعلومات والبيانات الواردة في تصميم النعوة.
      </p>
    </div>
  )
}
