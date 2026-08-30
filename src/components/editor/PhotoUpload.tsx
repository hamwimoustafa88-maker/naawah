"use client"

// رفع صورة الفقيد — تبقى في الذاكرة/المتصفح فقط (data URL) ولا تُرسل لأي خادم إطلاقاً
// (لا توجد صورة الفقيد في أي حمولة API بهذا المشروع، خلافاً لبيانات الإحصاءات
// المجهولة الهوية التي لا تحوي بيانات شخصية أساساً). تُعرض دائماً داخل إطار ثابت
// طولي — راجع PhotoCropper.tsx (التعديل التفاعلي) وObituaryBlocks.tsx (العرض
// الفعلي في النعوة، نفس الحساب بالضبط عبر lib/obituary/photoCrop.ts).

import { useRef } from "react"
import { ImagePlus, Minus, Plus, X } from "lucide-react"
import { useEditorStore } from "@/store/editorStore"
import { Label } from "@/components/ui/Field"
import { PhotoCropper } from "@/components/editor/PhotoCropper"
import {
  DEFAULT_PHOTO_CROP, DEFAULT_PHOTO_SIZE_SCALE, PHOTO_SIZE_SCALE_MAX, PHOTO_SIZE_SCALE_MIN, PHOTO_SIZE_SCALE_STEP,
} from "@/lib/obituary/photoCrop"

/** زرا تكبير/تصغير حجم إطار الصورة نفسه على الصفحة (لا محتواها الداخلي — راجع
 * PhotoCropper.tsx لذلك) — بخطوات ١٠٪، نفس نمط أزرار تكبير المخطوطات القرآنية. */
function PhotoSizeStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const clamp = (v: number) => Math.min(PHOTO_SIZE_SCALE_MAX, Math.max(PHOTO_SIZE_SCALE_MIN, +v.toFixed(2)))
  return (
    <div className="mt-2 flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(clamp(value - PHOTO_SIZE_SCALE_STEP))}
        disabled={value <= PHOTO_SIZE_SCALE_MIN}
        aria-label="تصغير الصورة"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-black/15 hover:bg-black/5 disabled:opacity-30"
      >
        <Minus size={14} />
      </button>
      <span className="w-11 shrink-0 text-center text-xs tabular-nums text-black/60">{Math.round(value * 100)}%</span>
      <button
        type="button"
        onClick={() => onChange(clamp(value + PHOTO_SIZE_SCALE_STEP))}
        disabled={value >= PHOTO_SIZE_SCALE_MAX}
        aria-label="تكبير الصورة"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-black/15 hover:bg-black/5 disabled:opacity-30"
      >
        <Plus size={14} />
      </button>
      <span className="text-xs text-black/45">حجم الصورة</span>
    </div>
  )
}

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
  const photoCrop = useEditorStore((s) => s.data.deceased.photoCrop)
  const photoSizeScale = useEditorStore((s) => s.data.deceased.photoSizeScale ?? DEFAULT_PHOTO_SIZE_SCALE)
  // معطَّل افتراضياً (undefined=false) بطلب صريح — الصورة متوسِّطة فوق الاسم
  // كوضع افتراضي، لا جانب النص.
  const photoSideBySide = useEditorStore((s) => s.data.deceased.photoSideBySide ?? false)
  const update = useEditorStore((s) => s.updateDeceased)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    // صورة جديدة = وضعية جديدة دائماً (لا نُبقي تكبير/تحريك/حجم الصورة السابقة
    // عالقاً على صورة مختلفة تماماً).
    update({ photoDataUrl: dataUrl, photoCrop: DEFAULT_PHOTO_CROP, photoSizeScale: DEFAULT_PHOTO_SIZE_SCALE })
  }

  return (
    <div>
      <Label>صورة الفقيد (اختياري)</Label>

      {photoDataUrl ? (
        <div className="relative">
          <PhotoCropper
            photoDataUrl={photoDataUrl}
            crop={photoCrop ?? DEFAULT_PHOTO_CROP}
            onChange={(crop) => update({ photoCrop: crop })}
          />
          <button
            type="button"
            onClick={() => update({ photoDataUrl: undefined, photoCrop: undefined, photoSizeScale: undefined })}
            // مكبَّر ١٤٠٪ عن حجمه الأصلي بطلب صريح (كان صغيراً جداً) — scale بدل
            // تكبير size/padding يدوياً، فيحافظ على تناسق الشكل (أيقونة+حشوة+ظل) تماماً.
            className="absolute -left-2 -top-2 scale-[1.4] rounded-full bg-white p-1 text-black/50 shadow hover:text-red-600"
            aria-label="حذف الصورة"
          >
            <X size={14} />
          </button>

          {/* حجم الصورة على الصفحة — منفصل عن التكبير/التحريك داخل الإطار أعلاه. */}
          <PhotoSizeStepper value={photoSizeScale} onChange={(v) => update({ photoSizeScale: v })} />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-18 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-black/25 text-black/40 hover:border-accent hover:text-accent"
          >
            <ImagePlus size={18} />
            <span className="text-[10px]">إضافة</span>
          </button>
          <p className="text-xs leading-relaxed text-black/45">
            تُعرض دائماً داخل إطار طولي ثابت (٧×١٠سم تقريباً) بصرف النظر عن اتجاه الصورة —
            يمكن تكبيرها وتحريكها ضمن الإطار بعد رفعها.
            <br />
            تبقى في متصفحك فقط ولا تُرفع لأي خادم.
          </p>
        </div>
      )}

      {/* معطَّل افتراضياً بطلب صريح (الصورة متوسِّطة فوق الاسم كوضع افتراضي) —
          تفعيله يضع الصورة جهة اليسار والنص جهة اليمين في صفّ واحد بدل ذلك،
          مفيد لتقليل الاستهلاك الرأسي للمساحة الذي يُسرِّع تفعيل تصغير auto-fit.
          يظهر فقط عند وجود صورة. */}
      {photoDataUrl && (
        <label className="mt-2 flex items-center gap-2 text-xs text-black/60">
          <input
            type="checkbox"
            checked={photoSideBySide}
            onChange={(e) => update({ photoSideBySide: e.target.checked })}
            className="h-3.5 w-3.5 accent-accent"
          />
          وضع الصورة جانب النص (الصورة يساراً، النص يميناً) بدل توسيطها فوق الاسم
        </label>
      )}

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
