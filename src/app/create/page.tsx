import type { Metadata } from "next"
import { Suspense } from "react"
import { CreateHeader } from "@/components/editor/CreateHeader"
import { EditorShell } from "@/components/editor/EditorShell"
import { TemplateFromQuery } from "@/components/editor/TemplateFromQuery"

export const metadata: Metadata = {
  title: "إنشاء نعوة إلكترونية",
  description:
    "صمّم نعوتك خطوة بخطوة: بيانات الفقيد، الأقارب، الجنازة والتعزية — ثم اختر من ٧ قوالب واطبعها أو شاركها فوراً بصيغة PNG/PDF.",
  alternates: { canonical: "/create" },
}

export default function CreatePage() {
  return (
    <>
      <Suspense fallback={null}>
        <TemplateFromQuery />
      </Suspense>
      <CreateHeader />
      <EditorShell />
    </>
  )
}
