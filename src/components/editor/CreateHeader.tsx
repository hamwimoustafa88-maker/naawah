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
import { Download, FileText, Loader2, Share2 } from "lucide-react"
import { useEditorStore } from "@/store/editorStore"
import { exportPdf, exportPng, exportShare, type ExportKind } from "@/lib/export/actions"
import { TextSettingsPanel } from "@/components/editor/TextSettingsPanel"
import { BrandLogo } from "@/components/common/BrandLogo"

export function CreateHeader() {
  const data = useEditorStore((s) => s.data)
  const templateId = data.templateId
  const deceasedName = data.deceased.name
  const [busy, setBusy] = useState<ExportKind | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runExport = async (kind: ExportKind, errorMessage: string, action: () => Promise<void>) => {
    setBusy(kind)
    setError(null)
    try {
      await action()
    } catch (err) {
      setError(errorMessage)
      console.error(err)
    } finally {
      setBusy(null)
    }
  }

  const handlePng = () => runExport("png", "تعذّر التصدير", () => exportPng(templateId, deceasedName))
  const handlePdf = () => runExport("pdf", "تعذّر التصدير", () => exportPdf(templateId, deceasedName))
  const handleShare = () => runExport("share", "تعذّرت المشاركة", () => exportShare(templateId, data))

  const iconButtonClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--home-border) text-(--home-fg) transition-colors hover:bg-(--home-bg) disabled:opacity-40 disabled:pointer-events-none"

  return (
    <div className="home-scope relative z-60 border-b border-(--home-border) bg-(--home-surface)">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <BrandLogo />

        <div className="flex items-center gap-2">
          {error && <span className="text-xs font-medium text-red-600">{error}</span>}

          <button type="button" onClick={handlePng} disabled={busy !== null} aria-label="تحميل صورة PNG" className={iconButtonClass}>
            {busy === "png" ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          </button>
          <button type="button" onClick={handlePdf} disabled={busy !== null} aria-label="تحميل PDF (A4)" className={iconButtonClass}>
            {busy === "pdf" ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          </button>
          <button type="button" onClick={handleShare} disabled={busy !== null} aria-label="مشاركة" className={iconButtonClass}>
            {busy === "share" ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
          </button>

          {/* مخفي على الجوال: نفس الحقول متاحة كقسم "إعدادات النصوص" داخل بوتوم-شيت
              /mobile/MobileEditorView.tsx (ضمن مجموعة "القالب") — بوب-أوفر صغير
              مموضع بالإحداثيات المطلقة هش أصلاً على شاشة ضيقة، والبوتوم-شيت المتّسق
              مع بقية أقسام التعديل هو المسار الوحيد على الجوال الآن. */}
          <div className="hidden lg:block">
            <TextSettingsPanel placement="down" triggerClassName={iconButtonClass} />
          </div>
        </div>
      </div>
    </div>
  )
}
