"use client"

import { useEditorStore } from "@/store/editorStore"

const MESSAGES = {
  small: "كثرة النصوص صغّرت الخط إلى أقل من ١٢ بكسل، وقد يصعب قراءته مطبوعاً. يُنصح باختصار الأسماء أو الفئات.",
  overflow: "المحتوى أطول من صفحة A4 وسيُقصّ أسفله. اختصر الأسماء أو النصوص.",
}

export function FitWarning() {
  const fitStatus = useEditorStore((s) => s.fitStatus)
  if (fitStatus === "ok") return null
  return (
    <p role="status" className={fitStatus === "overflow" ? "text-xs font-medium text-red-600" : "text-xs font-medium text-amber-700"}>
      {MESSAGES[fitStatus]}
    </p>
  )
}
