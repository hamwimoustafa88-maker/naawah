"use client"

// رفع صورة الفقيد — تبقى في الذاكرة/المتصفح فقط (data URL) ولا تُرسل لأي خادم إطلاقاً
// (لا توجد صورة الفقيد في أي حمولة API بهذا المشروع، خلافاً لبيانات الإحصاءات
// المجهولة الهوية التي لا تحوي بيانات شخصية أساساً). تُعرض بمقاس أقصى ٧×١٠سم
// بلا تمطيط (object-fit: contain) — راجع ObituaryBlocks.tsx للعرض الفعلي في النعوة.

import { useRef } from "react"
import { ImagePlus, X } from "lucide-react"
import { useEditorStore } from "@/store/editorStore"
import { Label } from "@/components/ui/Field"

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function PhotoUpload() {
  const photoDataUrl = useEditorStore((s) => s.data.deceased.photoDataUrl)
  const update = useEditorStore((s) => s.updateDeceased)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    update({ photoDataUrl: dataUrl })
  }

  return (
    <div>
      <Label>صورة الفقيد (اختياري)</Label>
      <div className="flex items-center gap-3">
        {photoDataUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element -- معاينة صورة بيانات المستخدم محلياً فقط */}
            <img
              src={photoDataUrl}
              alt="معاينة صورة الفقيد"
              className="h-24 w-[4.5rem] rounded-md border border-black/15 object-contain bg-white"
            />
            <button
              type="button"
              onClick={() => update({ photoDataUrl: undefined })}
              className="absolute -left-2 -top-2 rounded-full bg-white p-1 text-black/50 shadow hover:text-red-600"
              aria-label="حذف الصورة"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-[4.5rem] flex-col items-center justify-center gap-1 rounded-md border border-dashed border-black/25 text-black/40 hover:border-accent hover:text-accent"
          >
            <ImagePlus size={18} />
            <span className="text-[10px]">إضافة</span>
          </button>
        )}
        <p className="text-xs leading-relaxed text-black/45">
          صورة طولية، أقصى مقاس ٧×١٠سم — تُعرض بلا تمطيط أعلى اسم الفقيد.
          <br />
          تبقى في متصفحك فقط ولا تُرفع لأي خادم.
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}
