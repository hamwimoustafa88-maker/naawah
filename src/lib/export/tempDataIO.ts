// ⚠️ مؤقت للاختبار المحلي فقط — تصدير/استيراد كامل بيانات النعوة (ObituaryData)
// كملف JSON، لتفادي إعادة كتابة كل الحقول يدوياً عند كل تجربة للشكل النهائي.
// JSON لا Excel: البيانات شجرة متداخلة (فئات قرابة ← أشخاص ← حقول) + صورة كـdata
// URL أحياناً — JSON يحفظها بلا فقدان وبلا أي تفليط (flatten) يدوي عرضة للخطأ،
// وهو تسلسل JS-native مباشر (JSON.stringify/parse) بلا أي مكتبة إضافية.
//
// احذف هذا الملف + الزرّين المرتبطين به في CreateHeader.tsx (وimportObituaryJson/
// exportObituaryJson/loadData) عند الانتهاء من الاختبار — هذه الخاصية غير مخصّصة للإنتاج.

import type { ObituaryData } from "@/lib/obituary/types"

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
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

/** يُنزّل بيانات النعوة الحالية كملف JSON كامل (بلا فقدان، يشمل صورة الفقيد إن وُجدت). */
export function exportObituaryJson(data: ObituaryData) {
  const trimmed = data.deceased.name.trim()
  const base = trimmed ? `بيانات نعوة - ${trimmed}` : "بيانات نعوة"
  const safe = base.replace(/[\\/:*?"<>|]/g, "").trim()
  downloadJson(data, `${safe}.json`)
}

/**
 * يفتح منتقي ملفات النظام، ويُعيد بيانات النعوة المُحلَّلة من ملف JSON مُختار.
 * يرمي خطأ عربي واضح إن أُلغي الاختيار، أو فشل تحليل JSON، أو كان الملف غير صالح
 * (تحقّق سطحي فقط: وجود deceased/funeral — لا تحقّق أنواع كامل، كافٍ لخاصية اختبار مؤقتة).
 */
export function importObituaryJson(): Promise<ObituaryData> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json,.json"
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) {
        reject(new Error("لم يُختر ملف"))
        return
      }
      file
        .text()
        .then((text) => {
          const parsed = JSON.parse(text)
          if (!parsed || typeof parsed !== "object" || !parsed.deceased || !parsed.funeral) {
            throw new Error("الملف لا يحتوي على بيانات نعوة صالحة")
          }
          resolve(parsed as ObituaryData)
        })
        .catch((err: unknown) => reject(err instanceof Error ? err : new Error("تعذّر قراءة الملف")))
    }
    // إلغاء نافذة الاختيار (بلا اختيار ملف) لا يُطلق change — بلا هذا المعالج تبقى
    // الوعد معلّقاً و busy state عالقاً في CreateHeader.tsx. حدث "cancel" مدعوم في
    // المتصفحات الحديثة على <input type=file> (Chrome 113+, Firefox/Safari الحديثة).
    input.oncancel = () => reject(new Error("أُلغي الاختيار"))
    input.click()
  })
}
