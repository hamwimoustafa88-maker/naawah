"use client"

// إطار تفاعلي لتوضيع صورة الفقيد: سحب بالماوس/اللمس لتحريكها ضمن إطار طولي ثابت
// (٧×١٠سم — نفس أبعاد العرض النهائي في الكانفاس بالضبط، معاينة ١:١ حقيقية)، وشريط
// تكبير أسفله. الحساب (تحويل CSS + تقييد حدود التحريك) مشترك بالكامل مع
// ObituaryBlocks.tsx عبر lib/obituary/photoCrop.ts — لا صيغة مستقلة هنا.

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { RotateCcw } from "lucide-react"
import {
  DEFAULT_PHOTO_CROP, PHOTO_CROP_MAX_ZOOM, PHOTO_CROP_MIN_ZOOM, PHOTO_CROP_ZOOM_STEP,
  PHOTO_FRAME_HEIGHT_PX, PHOTO_FRAME_WIDTH_PX, clampPhotoCropOffset, photoCropTransform,
} from "@/lib/obituary/photoCrop"
import type { PhotoCrop } from "@/lib/obituary/types"

export function PhotoCropper({
  photoDataUrl, crop, onChange,
}: {
  photoDataUrl: string
  crop: PhotoCrop
  onChange: (crop: PhotoCrop) => void
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; startOffsetXFrac: number; startOffsetYFrac: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // لا هامش للتحريك عند zoom=1 أصلاً (object-fit:cover يملأ الإطار بالضبط) — تعطيل
  // السحب هنا يمنع مؤشر "يد" مضلِّل على صورة لا يمكن تحريكها فعلياً بعد.
  const canDrag = crop.zoom > PHOTO_CROP_MIN_ZOOM

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!canDrag) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, startOffsetXFrac: crop.offsetXFrac, startOffsetYFrac: crop.offsetYFrac }
    setIsDragging(true)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !frameRef.current) return
    const rect = frameRef.current.getBoundingClientRect()
    const dxFrac = (e.clientX - dragRef.current.startX) / rect.width
    const dyFrac = (e.clientY - dragRef.current.startY) / rect.height
    onChange({
      zoom: crop.zoom,
      offsetXFrac: clampPhotoCropOffset(dragRef.current.startOffsetXFrac + dxFrac, crop.zoom),
      offsetYFrac: clampPhotoCropOffset(dragRef.current.startOffsetYFrac + dyFrac, crop.zoom),
    })
  }

  const endDrag = () => {
    dragRef.current = null
    setIsDragging(false)
  }

  // تغيير zoom قد يُضيّق الهامش المتاح — نُعيد تقييد الإزاحتين الحاليتين فوراً
  // بدل ترك الصورة عند وضع صار خارج الحدود المسموحة لمقدار التكبير الجديد.
  const setZoom = (zoom: number) => {
    onChange({
      zoom,
      offsetXFrac: clampPhotoCropOffset(crop.offsetXFrac, zoom),
      offsetYFrac: clampPhotoCropOffset(crop.offsetYFrac, zoom),
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        className="mx-auto overflow-hidden rounded-md border border-black/15 bg-black/5"
        style={{
          width: PHOTO_FRAME_WIDTH_PX,
          height: PHOTO_FRAME_HEIGHT_PX,
          position: "relative",
          touchAction: "none",
          cursor: canDrag ? (isDragging ? "grabbing" : "grab") : "default",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- معاينة صورة بيانات المستخدم محلياً فقط */}
        <img
          src={photoDataUrl}
          alt="معاينة صورة الفقيد"
          draggable={false}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: photoCropTransform(crop, PHOTO_FRAME_WIDTH_PX, PHOTO_FRAME_HEIGHT_PX),
            userSelect: "none",
          }}
        />
      </div>

      <p className="text-center text-xs text-black/45">اسحب الصورة داخل الإطار لتحريكها لأفضل وضعية</p>

      <div className="flex items-center gap-2 rounded-lg bg-black/5 px-3 py-2">
        <input
          type="range"
          min={PHOTO_CROP_MIN_ZOOM}
          max={PHOTO_CROP_MAX_ZOOM}
          step={PHOTO_CROP_ZOOM_STEP}
          value={crop.zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="h-1.5 flex-1 accent-accent"
        />
        <span className="shrink-0 text-xs font-medium text-foreground">تكبير</span>
        <button
          type="button"
          onClick={() => onChange(DEFAULT_PHOTO_CROP)}
          aria-label="إعادة ضبط التكبير والموضع"
          title="إعادة ضبط التكبير والموضع"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-black/15 bg-white hover:bg-black/5"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  )
}
