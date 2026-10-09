// استدعاء عميل لنقطة /api/archive — منفصل عن lib/export/actions.ts ليبقى ذاك
// الملف مركّزاً على التقاط الكانفاس والتنزيل. صامت بالكامل: أي فشل يُبتلَع هنا
// (نفس نمط notifyStats في actions.ts)، فلا يعطّل التصدير الذي استلمه المستخدم فعلاً.

import { formatDualDate } from "@/lib/obituary/hijri"
import type { FuneralInfo, ObituaryData } from "@/lib/obituary/types"
import type { ExportKind } from "@/lib/export/actions"

export interface ArchivePayload {
  data: ObituaryData
  archiveKey: string
  exportKind: ExportKind
  /** JPEG جاهزة مسبقاً (PDF يلتقطها أصلاً لبناء الملف) — تُعاد استعمالها بدل
   * التقاط الكانفاس مرة ثانية. PNG/المشاركة يلتقطانها هنا من الصفر. */
  jpegDataUrl: string
}

// يُعيد ArrayBuffer صريحاً لا Uint8Array — Blob([bytes]) أدناه يتوقّع BlobPart،
// وUint8Array الحديث معرَّف عمومياً على ArrayBufferLike في إصدار TS الحالي فيتعارض
// معه (راجع نفس الملاحظة في lib/drive/client.ts)، بينما ArrayBuffer محدَّد بلا تعارض.
function dataUrlToBytes(dataUrl: string): ArrayBuffer {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1)
  const binary = atob(base64)
  const buffer = new ArrayBuffer(binary.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i)
  return buffer
}

/**
 * نص التعزية مُجمَّعاً كسطر واحد للعرض في جدول /admin — يُطابق منطق الفرع نفسه
 * في ObituaryBlocks.tsx (funeralAndCondolences) حرفياً لكن بنص عادي لا JSX:
 * إمّا مكان مشترك واحد للرجال والنساء (condolencesShared)، أو قسمان منفصلان.
 */
function condolencesSummary(funeral: FuneralInfo): string {
  const parts: string[] = []
  if (funeral.condolencesGeneral) parts.push(funeral.condolencesGeneral)

  const hasSeparate = !funeral.condolencesShared && (funeral.condolencesMen || funeral.condolencesWomen)
  const hasShared = funeral.condolencesShared && (funeral.condolencesMen || funeral.condolencesWomen)
  if (hasShared) parts.push(`للرجال والنساء: ${funeral.condolencesMen || funeral.condolencesWomen}`)
  if (hasSeparate) {
    if (funeral.condolencesMen) parts.push(`للرجال: ${funeral.condolencesMen}`)
    if (funeral.condolencesWomen) parts.push(`للنساء: ${funeral.condolencesWomen}`)
  }
  return parts.join(" | ")
}

export async function archiveExport({ data, archiveKey, exportKind, jpegDataUrl }: ArchivePayload): Promise<void> {
  if (!archiveKey || !data.deceased.name.trim()) return

  const deathDateAr = formatDualDate(data.deceased.deathDateISO, {
    hijriOffsetDays: data.deceased.hijriOffsetDays,
    order: data.format.dateOrder,
    numerals: data.format.numerals,
    months: data.format.months,
  })

  const bytes = dataUrlToBytes(jpegDataUrl)
  const form = new FormData()
  form.set("file", new Blob([bytes], { type: "image/jpeg" }), "archive.jpg")
  form.set("archiveKey", archiveKey)
  form.set("deceasedName", data.deceased.name.trim())
  form.set("deathDateISO", data.deceased.deathDateISO)
  form.set("deathDateAr", deathDateAr)
  form.set("templateId", data.templateId)
  form.set("exportKind", exportKind)
  form.set("deathPlaceNote", data.deceased.deathPlaceNote ?? "")
  form.set("condolencesInfo", condolencesSummary(data.funeral))

  await fetch("/api/archive", { method: "POST", body: form })
}
