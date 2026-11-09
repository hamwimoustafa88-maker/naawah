"use client"

// "رابط النعوة" — مشترك بين شريط التصدير (سطح المكتب) وأسفل معاينة الجوال.

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Check, Copy, Link2, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useGuardedExport } from "@/components/editor/useGuardedExport"
import { useEditorStore } from "@/store/editorStore"

const QR_QUIET_ZONE = 4

function QrCode({ value }: { value: string }) {
  const [matrix, setMatrix] = useState<{ size: number; path: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    // المكتبة لا تلزم إلا من ينشئ رابطاً، فلا تدخل حزمة المحرر الأساسية.
    void import("qrcode-generator").then(({ default: qrcode }) => {
      if (cancelled) return
      const qr = qrcode(0, "M")
      qr.addData(value)
      qr.make()
      const count = qr.getModuleCount()
      let path = ""
      for (let row = 0; row < count; row++) {
        for (let col = 0; col < count; col++) {
          if (qr.isDark(row, col)) path += `M${col + QR_QUIET_ZONE} ${row + QR_QUIET_ZONE}h1v1h-1z`
        }
      }
      setMatrix({ size: count + QR_QUIET_ZONE * 2, path })
    })
    return () => {
      cancelled = true
    }
  }, [value])

  if (!matrix) return <div className="h-44 w-44" />
  return (
    <svg role="img" aria-label="رمز QR لرابط النعوة" viewBox={`0 0 ${matrix.size} ${matrix.size}`} className="h-44 w-44 bg-white">
      <path d={matrix.path} fill="#000" />
    </svg>
  )
}

function PublicLinkDialog({ link, deceasedName, onClose }: { link: string; deceasedName: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`نعوة ${deceasedName}\n${link}`)}`

  const copy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
  }

  return createPortal(
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="رابط النعوة"
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-sm flex-col items-center gap-3 rounded-xl bg-white p-4 text-foreground shadow-xl"
      >
        <div className="flex w-full items-center justify-between">
          <h2 className="text-base font-bold">رابط النعوة</h2>
          <button type="button" onClick={onClose} aria-label="إغلاق" className="text-black/40 hover:text-black/70">
            <X size={18} />
          </button>
        </div>
        <QrCode value={link} />
        <input readOnly dir="ltr" value={link} aria-label="الرابط" onFocus={(e) => e.target.select()} className="w-full rounded-lg border border-black/15 px-3 py-2 text-xs" />
        <div className="flex w-full gap-2">
          <Button onClick={copy} variant="secondary" size="md" className="flex-1">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "تم النسخ" : "نسخ الرابط"}
          </Button>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center rounded-lg bg-accent px-3 text-sm font-medium text-white">
            إرسال عبر واتساب
          </a>
        </div>
        <p className="text-xs leading-relaxed text-black/45">
          كل من يملك هذا الرابط يستطيع مشاهدة النعوة. لا يظهر الرابط في محركات البحث، وإعادة التصدير تحدّث الصورة فيه.
        </p>
      </div>
    </div>,
    document.body
  )
}

export function ExtraExportActions() {
  const deceasedName = useEditorStore((s) => s.data.deceased.name)
  const { busy, error, run, dialog, publicLink, clearPublicLink } = useGuardedExport()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => run("link")} disabled={busy !== null} variant="outline" size="sm" className="text-xs">
          {busy === "link" ? <Loader2 size={16} className="animate-spin" /> : <Link2 size={16} />}
          رابط ورمز QR
        </Button>
      </div>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      {dialog}
      {publicLink && <PublicLinkDialog link={publicLink} deceasedName={deceasedName} onClose={clearPublicLink} />}
    </div>
  )
}
