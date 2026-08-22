"use client"

import { ObituaryCanvas } from "@/components/canvas/ObituaryCanvas"
import { ResponsiveCanvasFrame } from "@/components/canvas/ResponsiveCanvasFrame"
import { useEditorStore } from "@/store/editorStore"
import { cn } from "@/lib/utils/cn"
import { ExportBar } from "@/components/editor/ExportBar"
import { MobileEditorView } from "@/components/editor/mobile/MobileEditorView"
import { Step1Deceased } from "@/components/editor/steps/Step1Deceased"
import { Step2Funeral } from "@/components/editor/steps/Step2Funeral"
import { Step3Relatives } from "@/components/editor/steps/Step3Relatives"
import { Step4Template } from "@/components/editor/steps/Step4Template"

const STEPS = [
  { id: 1, label: "بيانات الفقيد", Component: Step1Deceased },
  { id: 2, label: "الجنازة والتعزية", Component: Step2Funeral },
  { id: 3, label: "الأقارب", Component: Step3Relatives },
  { id: 4, label: "القالب", Component: Step4Template },
]

/** زرا التنقّل بين الخطوات — يظهران أعلى النموذج وأسفله معاً. */
function StepNav({ step, onPrev, onNext }: { step: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="flex justify-between">
      <button disabled={step === 1} onClick={onPrev} className="text-sm font-medium text-black/55 disabled:opacity-30">
        ← السابق
      </button>
      <button disabled={step === STEPS.length} onClick={onNext} className="text-sm font-medium text-accent disabled:opacity-30">
        التالي →
      </button>
    </div>
  )
}

export function EditorShell() {
  const data = useEditorStore((s) => s.data)
  const step = useEditorStore((s) => s.step)
  const setStep = useEditorStore((s) => s.setStep)

  const Active = STEPS.find((s) => s.id === step)?.Component ?? Step1Deceased
  const goPrev = () => setStep(step - 1)
  const goNext = () => setStep(step + 1)

  return (
    <>
      {/* الجوال: معاينة حية دائمة الظهور + بوب-أب أقسام صغيرة سريعة (راجع mobile/MobileEditorView.tsx) */}
      <div className="lg:hidden">
        <MobileEditorView />
      </div>

      {/* سطح المكتب: نموذج خطوات + معاينة جنباً إلى جنب — بلا أي تغيير عن السابق */}
      <div className="mx-auto hidden max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,480px)]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-black/5 p-1">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={cn(
                  "flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  step === s.id ? "bg-white shadow-sm text-foreground" : "text-black/55 hover:text-black/80"
                )}
              >
                {s.id}. {s.label}
              </button>
            ))}
          </div>

          <StepNav step={step} onPrev={goPrev} onNext={goNext} />

          <Active />

          <div className="pt-2">
            <StepNav step={step} onPrev={goPrev} onNext={goNext} />
          </div>
        </div>

        {/* لوحة المعاينة — تتقلّص لتملأ عرض حاويتها بالضبط، بلا أي scroll أفقي */}
        <div className="flex w-full min-w-0 flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          {/* overflow-x-hidden صريح إلزامي: تحديد overflow-y وحده يجعل المتصفح يحوّل
              overflow-x تلقائياً إلى auto (قاعدة CSS قياسية)، فيقصّ الكانفاس المصغَّر أفقياً. */}
          <div className="w-full overflow-x-hidden overflow-y-auto rounded-lg" style={{ maxHeight: "calc(100vh - 220px)" }}>
            <ResponsiveCanvasFrame>
              <ObituaryCanvas data={data} />
            </ResponsiveCanvasFrame>
          </div>
          <ExportBar />
        </div>
      </div>
    </>
  )
}
