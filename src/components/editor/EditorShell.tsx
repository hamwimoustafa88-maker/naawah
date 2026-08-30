"use client"

import { Fragment, useEffect } from "react"
import { ObituaryCanvas } from "@/components/canvas/ObituaryCanvas"
import { ResponsiveCanvasFrame } from "@/components/canvas/ResponsiveCanvasFrame"
import { useEditorStore } from "@/store/editorStore"
import { ExportBar } from "@/components/editor/ExportBar"
import { MobileEditorView } from "@/components/editor/mobile/MobileEditorView"
import { SECTION_GROUPS } from "@/components/editor/mobile/sectionRegistry"
import { Step1Deceased } from "@/components/editor/steps/Step1Deceased"
import { Step2Funeral } from "@/components/editor/steps/Step2Funeral"
import { Step3Relatives } from "@/components/editor/steps/Step3Relatives"
import { Step4Template } from "@/components/editor/steps/Step4Template"

/**
 * سطح المكتب حصراً (استثناءً صريحاً — الجوال يبقى بلا أي تغيير، MobileEditorView.tsx
 * مستقل بالكامل): الأقسام الأربعة (كانت خطوات منفصلة بتبويبات + زرَّي سابق/تالي)
 * صارت مجمَّعة معاً في عمود تمرير واحد متواصل — بطلب صريح لتقليل عدد الأزرار.
 * كل قسم يحتفظ ببطاقاته الداخلية الخاصة (Card/CardTitle) كما هي تماماً — العنوان
 * أسفل خاص بالقسم الأربعة نفسها (تُطابق SECTION_GROUPS المُستعملة أصلاً في قائمة
 * الجوال — مصدر واحد للتسميات بلا تكرار حرفي)، لا ببطاقاته الفرعية الداخلية.
 */
const STEPS = [Step1Deceased, Step2Funeral, Step3Relatives, Step4Template]

// أرقام عربية-هندية ثابتة (١-٤) — زخرفة بصرية بحتة لواجهة المحرر نفسها، لا صلة لها
// بخيار "نظام الأرقام" الخاص بمحتوى النعوة (data.format.numerals)، فلا داعٍ لأي
// أداة تنسيق مشتركة هنا.
const SECTION_NUMERALS = ["١", "٢", "٣", "٤"]

/**
 * عنوان القسم مدمَج داخل الخط الفاصل نفسه (لا سطر مستقل فوقه) — بطلب صريح: رقم
 * القسم داخل دائرة صغيرة بلون accent ثم التسمية، يليهما خط رفيع يمتدّ لبقية
 * العرض. يظهر أيضاً فوق القسم الأول (لا بين الأقسام فقط) فيحمل كل قسم عنوانه.
 */
function SectionDivider({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
        {number}
      </span>
      <span className="shrink-0 text-sm font-bold text-black/70">{title}</span>
      <div className="h-px flex-1 bg-black/10" />
    </div>
  )
}

export function EditorShell() {
  const data = useEditorStore((s) => s.data)
  const regenerateArchiveKey = useEditorStore((s) => s.regenerateArchiveKey)

  // توليد archiveKey الفعلي بعد التركيب فقط — راجع تعليق الحقل في editorStore.ts
  // (قيمته الابتدائية ثابتة تفادياً لعطل hydration mismatch). EditorShell هو نقطة
  // تركيب وحيدة لصفحة /create (مع CreateHeader)، فتشغيله هنا مرة واحدة يكفي
  // لكلا نسختي الكانفاس (سطح مكتب/جوال) المُركَّبتين معاً دائماً.
  useEffect(() => {
    regenerateArchiveKey()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- مرة واحدة عند التركيب فقط
  }, [])

  return (
    <>
      {/* الجوال: معاينة حية دائمة الظهور + بوب-أب أقسام صغيرة سريعة (راجع mobile/MobileEditorView.tsx) */}
      <div className="lg:hidden">
        <MobileEditorView />
      </div>

      {/* سطح المكتب: الأقسام الأربعة معاً في عمود واحد + معاينة جنباً إلى جنب */}
      <div className="mx-auto hidden max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,480px)]">
        <div className="flex min-w-0 flex-col gap-6">
          {STEPS.map((Section, i) => (
            <Fragment key={i}>
              <SectionDivider number={SECTION_NUMERALS[i]} title={SECTION_GROUPS[i].label} />
              <Section />
            </Fragment>
          ))}
        </div>

        {/* لوحة المعاينة — تتقلّص لتملأ عرض حاويتها بالضبط، بلا أي scroll أفقي */}
        <div className="flex w-full min-w-0 flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          {/* overflow-x-hidden صريح إلزامي: تحديد overflow-y وحده يجعل المتصفح يحوّل
              overflow-x تلقائياً إلى auto (قاعدة CSS قياسية)، فيقصّ الكانفاس المصغَّر أفقياً. */}
          <div className="w-full overflow-x-hidden overflow-y-auto rounded-lg" style={{ maxHeight: "calc(100vh - 220px)" }}>
            <ResponsiveCanvasFrame>
              {/* nameHeadingLevel="div": هذا القسم "سطح المكتب حصراً" (راجع تعليق
                  الملف أعلاه)، والكانفاس المكافئ في MobileEditorView.tsx (id
                  obituary-canvas-mobile) يظهر بالتوازي على الجوال — كلاهما في DOM
                  الصفحة معاً (إخفاء بصري عبر lg:hidden فقط، لا إزالة من الشجرة)،
                  فكان ذلك يُنتج h1 مكرَّراً بنفس اسم الفقيد على /create. أبقينا h1
                  الحقيقي على نسخة الجوال (الافتراضي في ObituaryCanvas) تحديداً لأن
                  Google يفهرس بمحرّك زحف الجوال أولاً (mobile-first indexing) منذ
                  سنوات — عطل سيو حقيقي رصدناه أثناء التحقّق. */}
              <ObituaryCanvas data={data} nameHeadingLevel="div" />
            </ResponsiveCanvasFrame>
          </div>
          <ExportBar />
        </div>
      </div>
    </>
  )
}
