// منطق التصدير المشترك — يُستهلَك من ExportBar.tsx (شريط التصدير الكامل أسفل
// المعاينة) ومن CreateHeader.tsx (أزرار مختصرة أعلى الصفحة) معاً، حتى لا يتكرر
// منطق التقاط الكانفاس وتوليد الملفات في مكانين.

// html-to-image وjsPDF يُحمَّلان ديناميكياً عند أول تصدير فقط: jsPDF وحده من أكبر
// مكوّنات حزمة /create، ولا يحتاجه من يفتح المحرر قبل ضغط زر التصدير.
import { getTemplate } from "@/lib/templates/registry"
import { shareMessage } from "@/lib/obituary/render"
import { archiveExport } from "@/lib/export/archive"
import type { ObituaryData } from "@/lib/obituary/types"

export type ExportKind = "png" | "pdf" | "share" | "print"

/**
 * نسخة سطح المكتب (EditorShell.tsx) ونسخة الجوال (MobileEditorView.tsx) من
 * ObituaryCanvas مُركَّبتان معاً دائماً في DOM — التبديل بينهما بصرياً بـCSS فقط
 * (lg:hidden / hidden lg:grid) حسب عرض الشاشة، لا بعدم تركيب أحدهما. لذا نبحث
 * عن أول عنصر مُطابق *ظاهر فعلياً* (أبعاد غير صفرية)، لا أول id مطابق مطلقاً —
 * وإلا قد نلتقط النسخة المخفية (٠×٠px) فيفشل toBlob()/toJpeg() بصمت أو ينتج
 * صورة فارغة (عطل حقيقي صادفناه: PNG "فشل تحويل الكانفاس إلى صورة"، PDF بصفحة فارغة).
 */
const CANVAS_IDS = ["obituary-canvas", "obituary-canvas-mobile"]

async function getCanvasNode(): Promise<HTMLElement> {
  const node = CANVAS_IDS
    .map((id) => document.getElementById(id))
    .find((el): el is HTMLElement => !!el && el.offsetWidth > 0 && el.offsetHeight > 0)
  if (!node) throw new Error("لم يُعثر على الكانفاس")
  if (typeof document.fonts?.ready?.then === "function") {
    await document.fonts.ready
  }
  return node
}

/** PNG بلا فقدان — للتحميل المباشر وللمشاركة. */
async function capturePngBlob(): Promise<Blob> {
  const node = await getCanvasNode()
  const { toBlob } = await import("html-to-image")
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
async function captureJpeg(templateId: string, pixelRatio = 3): Promise<string> {
  const node = await getCanvasNode()
  const backgroundColor = getTemplate(templateId).tokens.bg
  const { toJpeg } = await import("html-to-image")
  return toJpeg(node, { pixelRatio, cacheBust: true, quality: 0.92, backgroundColor })
}

/**
 * اسم ملف التصدير: "النعوة الإلكترونية - {اسم الفقيد}"، أو "النعوة الإلكترونية"
 * وحدها إن لم يُدخَل اسم بعد. يُزيل الرموز غير الصالحة في أسماء الملفات عبر أنظمة
 * التشغيل المختلفة (Windows تحديداً أكثرها تقييداً: \/:*?"<>|).
 */
function buildFileName(deceasedName: string, extension: string, suffix = ""): string {
  const trimmed = deceasedName.trim()
  const base = (trimmed ? `النعوة الإلكترونية - ${trimmed}` : "النعوة الإلكترونية") + suffix
  const safe = base.replace(/[\\/:*?"<>|]/g, "").trim()
  return `${safe}.${extension}`
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

async function notifyStats(data: ObituaryData) {
  // نعوة بلا اسم مجرّد تجربة، فلا تُحتسب في عدّاد الصفحة الرئيسية.
  if (!data.deceased.name.trim()) return
  try {
    await fetch("/api/stats/increment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId: data.templateId }),
    })
  } catch {
    // إحصاءات صامتة — لا نعطّل التصدير إن فشل الطلب
  }
}

/**
 * يؤرشف نسخة عن النعوة المُصدَّرة في Google Drive عبر /api/archive — صامت تماماً
 * (نفس نمط notifyStats أعلاه بالضبط): أي فشل هنا (شبكة، خادم غير مُهيَّأ لـDrive،
 * قاعدة بيانات) لا يظهر للمستخدم إطلاقاً ولا يعطّل التصدير الذي استلمه فعلاً، لأنه
 * يُستدعى دائماً بـvoid بعد اكتمال التنزيل/المشاركة. jpegDataUrl مُمرَّرة جاهزة من
 * exportPdf (تلتقطها أصلاً لبناء الملف) لتفادي التقاط الكانفاس مرتين؛ exportPng
 * وexportShare يلتقطانها هنا من الصفر — التكلفة تقع بعد نزول ملف المستخدم فلا يشعر بها.
 */
async function archiveAfterExport(data: ObituaryData, archiveKey: string, kind: ExportKind, jpegDataUrl?: string) {
  try {
    const dataUrl = jpegDataUrl ?? (await captureJpeg(data.templateId))
    await archiveExport({ data, archiveKey, exportKind: kind, jpegDataUrl: dataUrl })
  } catch {
    // أرشفة صامتة — لا نعطّل التصدير إن فشلت
  }
}

export async function exportPng(data: ObituaryData, archiveKey: string) {
  const blob = await capturePngBlob()
  downloadBlob(blob, buildFileName(data.deceased.name, "png"))
  void notifyStats(data)
  void archiveAfterExport(data, archiveKey, "png")
}

export async function exportPdf(data: ObituaryData, archiveKey: string) {
  const dataUrl = await captureJpeg(data.templateId)
  const { jsPDF } = await import("jspdf")
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true })
  pdf.addImage(dataUrl, "JPEG", 0, 0, 210, 297)
  pdf.save(buildFileName(data.deceased.name, "pdf"))
  void notifyStats(data)
  void archiveAfterExport(data, archiveKey, "pdf", dataUrl)
}

const A4_TRIM_MM = { width: 210, height: 297 }
const BLEED_MM = 3
/** شريط أبيض حول منطقة النزف تُرسم فيه علامات القص. */
const MARK_ZONE_MM = 7
const CROP_MARK_INSET_MM = 1.5

/**
 * نسخة المطبعة: صفحة A4 نفسها بدقة أعلى (٣٨٤ نقطة/بوصة تقريباً)، يحيط بها نزف ٣مم بلون
 * خلفية القالب وعلامات قص خارجه. الألوان RGB لأن jsPDF لا يضمّن صوراً بنظام CMYK.
 */
export async function exportPrintPdf(data: ObituaryData, archiveKey: string) {
  const dataUrl = await captureJpeg(data.templateId, 4)
  const { jsPDF } = await import("jspdf")
  const margin = MARK_ZONE_MM + BLEED_MM
  const sheetWidth = A4_TRIM_MM.width + margin * 2
  const sheetHeight = A4_TRIM_MM.height + margin * 2
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [sheetWidth, sheetHeight], compress: true })

  pdf.setFillColor(getTemplate(data.templateId).tokens.bg)
  pdf.rect(MARK_ZONE_MM, MARK_ZONE_MM, sheetWidth - MARK_ZONE_MM * 2, sheetHeight - MARK_ZONE_MM * 2, "F")
  pdf.addImage(dataUrl, "JPEG", margin, margin, A4_TRIM_MM.width, A4_TRIM_MM.height)

  pdf.setDrawColor(0)
  pdf.setLineWidth(0.1)
  const markStart = CROP_MARK_INSET_MM
  const markEnd = MARK_ZONE_MM - CROP_MARK_INSET_MM
  for (const x of [margin, sheetWidth - margin]) {
    pdf.line(x, markStart, x, markEnd)
    pdf.line(x, sheetHeight - markEnd, x, sheetHeight - markStart)
  }
  for (const y of [margin, sheetHeight - margin]) {
    pdf.line(markStart, y, markEnd, y)
    pdf.line(sheetWidth - markEnd, y, sheetWidth - markStart, y)
  }

  pdf.save(buildFileName(data.deceased.name, "pdf", " - للمطبعة"))
  void notifyStats(data)
  void archiveAfterExport(data, archiveKey, "print")
}

/** يؤرشف النعوة وينتظر النتيجة، ثم يعيد رابطها العام. يرمي إن تعذّر إنشاؤه. */
export async function createPublicLink(data: ObituaryData, archiveKey: string): Promise<string> {
  const jpegDataUrl = await captureJpeg(data.templateId)
  const { publicId } = await archiveExport({ data, archiveKey, exportKind: "link", jpegDataUrl })
  if (!publicId) throw new Error("تعذّر إنشاء رابط النعوة")
  return `${window.location.origin}/n/${publicId}`
}

/**
 * المشاركة (زر واتساب/مشاركة النظام) — تُرفق نص الرسالة (shareMessage) مع الصورة
 * معاً في نفس استدعاء navigator.share() الواحد، فتُضيفهما تطبيقات مثل واتساب
 * كصورة + تعليق نصي في رسالة واحدة (سلوك قياسي لـWeb Share API عند تمرير
 * files وtext معاً). الاحتياط (متصفحات بلا دعم مشاركة ملفات، غالباً سطح المكتب)
 * يبقى تنزيلاً صامتاً بلا نص — كما كان، خارج نطاق هذا التعديل.
 */
export async function exportShare(data: ObituaryData, archiveKey: string) {
  const blob = await capturePngBlob()
  const filename = buildFileName(data.deceased.name, "png")
  const file = new File([blob], filename, { type: "image/png" })
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "نعوة", text: shareMessage(data) })
    } catch (err) {
      // إغلاق نافذة المشاركة بلا اختيار تطبيق قرار من المستخدم لا عطل.
      if (err instanceof DOMException && err.name === "AbortError") return
      throw err
    }
  } else {
    downloadBlob(blob, filename)
  }
  void notifyStats(data)
  void archiveAfterExport(data, archiveKey, "share")
}
