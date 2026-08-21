// منطق التصدير المشترك — يُستهلَك من ExportBar.tsx (شريط التصدير الكامل أسفل
// المعاينة) ومن CreateHeader.tsx (أزرار مختصرة أعلى الصفحة) معاً، حتى لا يتكرر
// منطق التقاط الكانفاس وتوليد الملفات في مكانين.

import { toBlob, toJpeg } from "html-to-image"
import { jsPDF } from "jspdf"
import { getTemplate } from "@/lib/templates/registry"

export type ExportKind = "png" | "pdf" | "share"

async function getCanvasNode(): Promise<HTMLElement> {
  const node = document.getElementById("obituary-canvas")
  if (!node) throw new Error("لم يُعثر على الكانفاس")
  if (typeof document.fonts?.ready?.then === "function") {
    await document.fonts.ready
  }
  return node
}

/** PNG بلا فقدان — للتحميل المباشر وللمشاركة. */
async function capturePngBlob(): Promise<Blob> {
  const node = await getCanvasNode()
  const blob = await toBlob(node, { pixelRatio: 3, cacheBust: true })
  if (!blob) throw new Error("فشل تحويل الكانفاس إلى صورة")
  return blob
}

/**
 * JPEG بجودة عالية — للـPDF فقط. jsPDF يضمّن PNG خاماً بلا ضغط، فتنتج ملفات ٢٠+
 * ميجابايت غير عملية للمشاركة عبر واتساب/إيميل. الضغط بجودة 0.92 غير ملحوظ بصرياً
 * على النصوص والخطوط، ويقلّص الحجم بنسبة تفوق ٩٠٪.
 *
 * خلفية JPEG (بلا شفافية) يجب أن تطابق خلفية القالب الفعلية — لا أبيض ثابت، وإلا
 * ظهرت هالة بيضاء على حواف القوالب الداكنة (مثال: "الليلي الفخم") عند التصدير.
 */
async function captureJpeg(templateId: string): Promise<string> {
  const node = await getCanvasNode()
  const backgroundColor = getTemplate(templateId).tokens.bg
  return toJpeg(node, { pixelRatio: 3, cacheBust: true, quality: 0.92, backgroundColor })
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  // يجب إلحاق العنصر بالمستند قبل click() — بعض المتصفحات تتجاهل تنزيل عنصر منفصل عن DOM.
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

async function notifyStats(templateId: string) {
  try {
    await fetch("/api/stats/increment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId }),
    })
  } catch {
    // إحصاءات صامتة — لا نعطّل التصدير إن فشل الطلب
  }
}

export async function exportPng(templateId: string) {
  const blob = await capturePngBlob()
  downloadBlob(blob, "naawah.png")
  void notifyStats(templateId)
}

export async function exportPdf(templateId: string) {
  const dataUrl = await captureJpeg(templateId)
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true })
  pdf.addImage(dataUrl, "JPEG", 0, 0, 210, 297)
  pdf.save("naawah.pdf")
  void notifyStats(templateId)
}

export async function exportShare(templateId: string) {
  const blob = await capturePngBlob()
  const file = new File([blob], "naawah.png", { type: "image/png" })
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: "نعوة" })
  } else {
    downloadBlob(blob, "naawah.png")
  }
  void notifyStats(templateId)
}
