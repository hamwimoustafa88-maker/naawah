"use client"

import { useEffect, useState } from "react"
import { Check, FolderOpen, Plus, Trash2, X } from "lucide-react"
import { deleteSavedObituary, listSavedObituaries, type SavedObituary } from "@/lib/drafts/savedObituaries"
import { deceasedNameLine } from "@/lib/obituary/render"
import { useEditorStore } from "@/store/editorStore"

/** زر "نعواتي" في ترويسة المحرر ونافذة النعوات المحفوظة في هذا المتصفح. */
export function SavedObituaries() {
  const archiveKey = useEditorStore((s) => s.archiveKey)
  const openObituary = useEditorStore((s) => s.openObituary)
  const reset = useEditorStore((s) => s.reset)
  const [items, setItems] = useState<SavedObituary[] | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const open = items !== null

  const close = () => {
    setItems(null)
    setConfirmDeleteId(null)
    setError(false)
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  const loadItems = async () => {
    try {
      setItems(await listSavedObituaries())
    } catch (err) {
      console.error(err)
      setItems([])
      setError(true)
    }
  }

  const handleNew = () => {
    reset()
    close()
  }

  const handleOpen = (item: SavedObituary) => {
    if (item.id !== archiveKey) openObituary(item.id, item.data)
    close()
  }

  const handleDelete = async (item: SavedObituary) => {
    if (confirmDeleteId !== item.id) {
      setConfirmDeleteId(item.id)
      return
    }
    try {
      await deleteSavedObituary(item.id)
      if (item.id === archiveKey) reset()
      setConfirmDeleteId(null)
      await loadItems()
    } catch (err) {
      console.error(err)
      setError(true)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={loadItems}
        aria-label="نعواتي المحفوظة"
        title="نعواتي المحفوظة"
        className="inline-flex h-9 w-9 items-center justify-center gap-1.5 rounded-full border border-(--home-border) text-sm font-medium text-(--home-fg) transition-colors hover:bg-(--home-bg) sm:w-auto sm:px-3"
      >
        <FolderOpen size={16} />
        <span className="hidden sm:inline">نعواتي</span>
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="نعواتي المحفوظة"
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[85vh] w-full max-w-md flex-col gap-3 rounded-xl bg-white p-4 text-foreground shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">نعواتي</h2>
              <button type="button" onClick={close} aria-label="إغلاق" className="text-black/40 hover:text-black/70">
                <X size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleNew}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-accent bg-accent px-3 py-2 text-sm font-medium text-white"
            >
              <Plus size={16} />
              نعوة جديدة
            </button>

            {error && <p className="text-xs font-medium text-red-600">تعذّر الوصول إلى النعوات المحفوظة في هذا المتصفح.</p>}

            <div className="flex min-h-0 flex-col gap-1.5 overflow-x-hidden overflow-y-auto">
              {items.length === 0 && !error && (
                <p className="py-6 text-center text-sm text-black/45">لا توجد نعوات محفوظة بعد.</p>
              )}
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 rounded-lg border border-black/10 p-2">
                  <button type="button" onClick={() => handleOpen(item)} className="min-w-0 flex-1 text-right hover:text-accent">
                    <span className="block truncate text-sm font-medium">
                      {deceasedNameLine(item.data.deceased) || "نعوة بدون اسم"}
                    </span>
                    <span className="block text-xs text-black/45">
                      {item.id === archiveKey
                        ? "مفتوحة الآن"
                        : new Date(item.lastUsedAt).toLocaleString("ar", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    aria-label={confirmDeleteId === item.id ? "تأكيد حذف النعوة نهائياً" : "حذف النعوة"}
                    title={confirmDeleteId === item.id ? "اضغط مرة أخرى للحذف نهائياً" : "حذف النعوة"}
                    className={
                      confirmDeleteId === item.id
                        ? "flex shrink-0 items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white"
                        : "shrink-0 p-1 text-black/30 hover:text-red-600"
                    }
                  >
                    {confirmDeleteId === item.id ? (
                      <>
                        <Check size={14} />
                        تأكيد الحذف
                      </>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs leading-relaxed text-black/45">
              تُحفظ نعواتك تلقائياً في هذا المتصفح وعلى هذا الجهاز فقط. مسح بيانات المتصفح يحذفها.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
