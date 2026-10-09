// حساب مشترك لتكبير/تحريك صورة الفقيد داخل إطارها الثابت الطولي — يستهلكه كل من
// PhotoUpload.tsx (التعديل التفاعلي: سحب + شريط تكبير) وObituaryBlocks.tsx (العرض
// النهائي في الكانفاس). حساب واحد هنا يضمن مطابقة معاينة المحرّر للنتيجة المصدَّرة
// بالضبط — لا صيغتين منفصلتين قد تنحرفان عن بعضهما لاحقاً.
//
// الفكرة: <img> بحجم ١٠٠٪×١٠٠٪ من إطار overflow:hidden مع object-fit:cover يملأ
// الإطار تماماً بصرف النظر عن اتجاه الصورة الأصلية (عرضية/طولية) — هذا هو zoom=1
// بلا أي كود إضافي. transform: scale(zoom) فوق ذلك يكبّر من المركز، وtranslate
// يحرّك ضمن الهامش الناتج عن التكبير فقط (لا هامش عند zoom=1 أصلاً).

import type { PhotoCrop } from "./types"

/**
 * أبعاد إطار صورة الفقيد الثابتة: ٧×١٠سم عند 96dpi (١سم ≈ ٣٧.٨px) — طولية دائماً،
 * بصرف النظر عن اتجاه الصورة المرفوعة. مصدر وحيد يستهلكه كل من PhotoUpload.tsx
 * (معاينة المحرّر بمقاس ١:١ حقيقي) وObituaryBlocks.tsx (العرض النهائي، مضروباً
 * بـphotoScale عند كثافة النص العالية) — لا تُعرِّف نسخة مستقلة في أيّ منهما.
 */
export const PHOTO_FRAME_WIDTH_PX = 265
export const PHOTO_FRAME_HEIGHT_PX = 378

export const DEFAULT_PHOTO_CROP: PhotoCrop = { zoom: 1, offsetXFrac: 0, offsetYFrac: 0 }

export const PHOTO_CROP_MIN_ZOOM = 1
export const PHOTO_CROP_MAX_ZOOM = 3
export const PHOTO_CROP_ZOOM_STEP = 0.01

/**
 * مضاعف حجم إطار الصورة نفسه على الصفحة (تكبير/تصغير الصورة كاملة بخطوات ١٠٪) —
 * منفصل تماماً عن PHOTO_CROP_*_ZOOM أعلاه (ذاك يكبّر محتوى الصورة *داخل* إطار
 * ثابت الحجم عبر السحب/الشريط، هذا يغيّر حجم الإطار *نفسه* على الصفحة). حدّ أقصى
 * متحفّظ (١٥٠٪) لتفادي كسر تخطيط الصفحة — auto-fit يتكفّل بتصغير الخط أكثر إن
 * لزم بعد تكبير الصورة، فلا خطر فيض حتى عند الحد الأقصى.
 */
export const DEFAULT_PHOTO_SIZE_SCALE = 1
export const PHOTO_SIZE_SCALE_MIN = 0.5
export const PHOTO_SIZE_SCALE_MAX = 1.5
export const PHOTO_SIZE_SCALE_STEP = 0.1

/**
 * يقيّد كسر الإزاحة على محور واحد إلى الهامش المتاح فعلياً عند مقدار تكبير معيّن.
 * الهامش المتاح (بنصف عرض/طول الإطار) = (zoom-1)/2 — عند zoom=1 يساوي صفراً
 * (الصورة تملأ الإطار بالضبط بلا فائض للتحريك، تماماً كما يفعل object-fit:cover).
 */
export function clampPhotoCropOffset(offsetFrac: number, zoom: number): number {
  const max = Math.max(0, (zoom - 1) / 2)
  return Math.min(max, Math.max(-max, offsetFrac))
}

/** يعيد كائن crop جديد بعد تقييد إزاحتيه لمقدار zoom الحالي (يُستدعى بعد أي تغيير zoom). */
export function reclampPhotoCrop(crop: PhotoCrop): PhotoCrop {
  return {
    zoom: crop.zoom,
    offsetXFrac: clampPhotoCropOffset(crop.offsetXFrac, crop.zoom),
    offsetYFrac: clampPhotoCropOffset(crop.offsetYFrac, crop.zoom),
  }
}

/** سلسلة CSS transform الكاملة — تُطبَّق على <img> بحجم ١٠٠٪×١٠٠٪ من إطار بأبعاد frameWidthPx×frameHeightPx. */
export function photoCropTransform(crop: PhotoCrop, frameWidthPx: number, frameHeightPx: number): string {
  const x = crop.offsetXFrac * frameWidthPx
  const y = crop.offsetYFrac * frameHeightPx
  return `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${crop.zoom})`
}
