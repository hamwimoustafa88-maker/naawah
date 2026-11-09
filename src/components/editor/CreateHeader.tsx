"use client"

// hero علوي بسيط لصفحة /create: شعار المشروع + اسمه، وأزرار وصول سريع (تحميل
// PNG/PDF، مشاركة، إعدادات النصوص) — نفس منطق التصدير المستعمل في ExportBar.tsx
// أسفل المعاينة (عبر lib/export/actions.ts المشترك)، بحالة busy/error مستقلة
// خاصة بهذا الشريط فقط.
//
// .home-scope هنا مقصودة: نفس آلية الألوان الفاتحة/الداكنة للصفحة الرئيسية (راجع
// globals.css) — تُستعمل هنا فقط لتوحيد لغة الألوان بصرياً مع بقية الموقع، بلا
// زر تبديل ظاهر في هذا الشريط (أُخفي بطلب صريح؛ لو أراد المستخدم تفعيله لاحقاً من
// الصفحة الرئيسية فسيُطبَّق فوراً هنا أيضاً عبر نفس مفتاح localStorage المشترك).
// **لا** تمتد هذه الترويسة لتلوين بقية عناصر /create (النماذج، الكانفاس) — نطاقها هذا الشريط فقط.
//
// relative z-[60] على الجذر إلزامي: بوتوم-شيت الجوال (mobile/BottomSheet.tsx) يُفتح
// تلقائياً من البداية ويُغلَّف بـfixed inset-0 z-50 — عنصر ساكن (static) بلا موضع
// صريح مثل هذه الترويسة يُرسَم دائماً *قبل* أي عنصر positioned بز-إندكس موجب مهما
// كان ترتيبه في DOM (قاعدة CSS قياسية لترتيب الرسم داخل سياق التكديس)، فتُغطّى كل
// أزرار الترويسة (PNG/PDF/مشاركة/إعدادات) بخلفية الشيت ويصبح النقر عليها يُغلق
// الشيت بدل تنفيذ الزر — عطل حقيقي صادفناه (بلاغ: "زر إعدادات النصوص لا يعمل").
// رفع الترويسة لموضع positioned بز-إندكس أعلى من الشيت (٦٠ > ٥٠) يبقيها فوقه دائماً.

import { useState } from "react"
import { Download, FileJson, FileText, Loader2, Redo2, Share2, Undo2, Upload } from "lucide-react"
import { useEditorStore } from "@/store/editorStore"
import { cn } from "@/lib/utils/cn"
import { exportObituaryJson, importObituaryJson } from "@/lib/export/tempDataIO"
import { TextSettingsPanel } from "@/components/editor/TextSettingsPanel"
import { SavedObituaries } from "@/components/editor/SavedObituaries"
import { useGuardedExport } from "@/components/editor/useGuardedExport"
import { BrandLogo } from "@/components/common/BrandLogo"

/** ⚠️ مؤقت للاختبار — راجع lib/export/tempDataIO.ts. زرا استيراد/تصدير JSON
 * مُخفيّان من الترويسة بطلب صريح (لا محذوفان — لا يزالان مفيدَين للاختبار الداخلي؛
 * بدّل هذا إلى true لإعادة إظهارهما، أو احذف البلوك بالكامل أدناه عند الانتهاء تماماً). */
const SHOW_JSON_IO_TOOLS = false

export function CreateHeader() {
  const data = useEditorStore((s) => s.data)
  const loadData = useEditorStore((s) => s.loadData)
  const draftSaveFailed = useEditorStore((s) => s.draftSaveFailed)
  const canUndo = useEditorStore((s) => s.past.length > 0)
  const canRedo = useEditorStore((s) => s.future.length > 0)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const { busy, error, run, dialog } = useGuardedExport()

  // ⚠️ مؤقت للاختبار — راجع lib/export/tempDataIO.ts. احذف هذا البلوك بالكامل
  // (وزرّيه أدناه) عند الانتهاء من تجربة الشكل النهائي.
  const [dataBusy, setDataBusy] = useState<"export" | "import" | null>(null)
  const [dataError, setDataError] = useState<string | null>(null)

  const handleExportData = () => {
    setDataError(null)
    try {
      exportObituaryJson(data)
    } catch (err) {
      setDataError("تعذّر تصدير البيانات")
      console.error(err)
    }
  }

  const handleImportData = async () => {
    setDataBusy("import")
    setDataError(null)
    try {
      const imported = await importObituaryJson()
      loadData(imported)
    } catch (err) {
      setDataError(err instanceof Error ? err.message : "تعذّر استيراد البيانات")
      console.error(err)
    } finally {
      setDataBusy(null)
    }
  }

  const iconButtonClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--home-border) text-(--home-fg) transition-colors hover:bg-(--home-bg) disabled:opacity-40 disabled:pointer-events-none"
  // على الجوال تظهر هذه الأزرار بنصوصها تحت المعاينة (ExportActions في MobileEditorView).
  const exportButtonClass = cn(iconButtonClass, "hidden lg:inline-flex")

  return (
    <div className="home-scope relative z-60 border-b border-(--home-border) bg-(--home-surface)">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <BrandLogo wordmarkClassName="hidden sm:inline" />

        <div className="flex items-center gap-1 sm:gap-2">
          {dialog}
          {error && <span className="hidden text-xs font-medium text-red-600 sm:inline">{error}</span>}
          {draftSaveFailed && <span className="text-xs font-medium text-red-600">تعذّر الحفظ</span>}
          {SHOW_JSON_IO_TOOLS && dataError && <span className="text-xs font-medium text-red-600">{dataError}</span>}

          {/* ⚠️ مؤقت للاختبار فقط — تصدير/استيراد بيانات النعوة كـJSON (راجع
              lib/export/tempDataIO.ts). مُخفيّ حالياً (SHOW_JSON_IO_TOOLS أعلاه)
              بطلب صريح. حدّ أصفر مميّز عمداً ليسهل تمييزه وحذفه لاحقاً عند إعادة إظهاره. */}
          {SHOW_JSON_IO_TOOLS && (
            <div className="flex items-center gap-2 rounded-full border border-dashed border-amber-500/60 px-1.5 py-0.5" title="مؤقت للاختبار: تصدير/استيراد بيانات النعوة">
              <button
                type="button"
                onClick={handleExportData}
                disabled={busy !== null || dataBusy !== null}
                aria-label="تصدير بيانات النعوة (JSON) — مؤقت"
                className={iconButtonClass}
              >
                <FileJson size={16} />
              </button>
              <button
                type="button"
                onClick={handleImportData}
                disabled={busy !== null || dataBusy !== null}
                aria-label="استيراد بيانات النعوة (JSON) — مؤقت"
                className={iconButtonClass}
              >
                {dataBusy === "import" ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              </button>
            </div>
          )}

          <button type="button" onClick={undo} disabled={!canUndo} aria-label="تراجع" title="تراجع" className={iconButtonClass}>
            <Undo2 size={16} />
          </button>
          <button type="button" onClick={redo} disabled={!canRedo} aria-label="إعادة" title="إعادة" className={iconButtonClass}>
            <Redo2 size={16} />
          </button>

          <SavedObituaries />

          <button type="button" onClick={() => run("png")} disabled={busy !== null} aria-label="تحميل صورة PNG" className={exportButtonClass}>
            {busy === "png" ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          </button>
          <button type="button" onClick={() => run("pdf")} disabled={busy !== null} aria-label="تحميل PDF (A4)" className={exportButtonClass}>
            {busy === "pdf" ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          </button>
          <button type="button" onClick={() => run("share")} disabled={busy !== null} aria-label="مشاركة" className={exportButtonClass}>
            {busy === "share" ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
          </button>

          {/* مخفي على الجوال: نفس الحقول متاحة كقسم "إعدادات النصوص" داخل بوتوم-شيت
              /mobile/MobileEditorView.tsx (ضمن مجموعة "القالب") — بوب-أوفر صغير
              مموضع بالإحداثيات المطلقة هش أصلاً على شاشة ضيقة، والبوتوم-شيت المتّسق
              مع بقية أقسام التعديل هو المسار الوحيد على الجوال الآن. */}
          <div className="hidden lg:block">
            <TextSettingsPanel
              placement="down"
              triggerClassName="inline-flex h-9 items-center whitespace-nowrap rounded-full border border-(--home-border) px-3 text-sm font-medium text-(--home-fg) transition-colors hover:bg-(--home-bg)"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
