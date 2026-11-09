// تنبيهات ما قبل التصدير — تحذيرات يمكن تجاوزها لا موانع.

import type { ObituaryData } from "./types"

/** حالة ملاءمة المحتوى لصفحة A4 — يحسبها ObituaryCanvas بعد auto-fit. */
export type FitStatus = "ok" | "small" | "overflow"

export function exportIssues(data: ObituaryData, fit: FitStatus): string[] {
  const issues: string[] = []
  if (!data.deceased.name.trim()) issues.push("لم يُكتب اسم الفقيد.")
  if (!data.deceased.deathDateISO && !data.funeral.burialDateISO) issues.push("لم يُحدَّد تاريخ الوفاة أو الصلاة.")
  if (!data.funeral.prayerLocation.trim()) issues.push("لم يُحدَّد مكان صلاة الجنازة.")
  if (fit === "overflow") issues.push("المحتوى أطول من صفحة A4 وسيُقصّ أسفله.")
  return issues
}
