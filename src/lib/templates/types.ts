// نظام القوالب — كل قالب يعرّف طبقة بصرية كاملة (توكنات + إطار + كثافة زخرفة)
// فوق نفس الكتل الدلالية الـ١٤، فلا يتكرر منطق العرض.

import type { ComponentType } from "react"

export interface TemplateTokens {
  /** خلفية الصفحة */
  bg: string
  /** لون الحبر الأساسي (النصوص) */
  ink: string
  /** لون التمييز (الزخارف، الخطوط، الإطار) */
  accent: string
  /** لون خافت للنصوص الثانوية */
  muted: string
  nameFont: string
  bodyFont: string
  calligraphyFont: string
}

export interface TemplateDefinition {
  id: string
  name: string
  category: "تقليدي" | "حديث" | "ملكي"
  description: string
  tokens: TemplateTokens
  /** طبقة SVG/CSS للإطار — يُرسم خلف المحتوى بكامل الصفحة */
  Frame: ComponentType<{ className?: string }>
  /** رمز الفاصل الزخرفي بين الكتل، فارغ = خط بسيط فقط */
  divider: string
  /** هل يظهر فوتر المطبعة (خط أفقي + سطر صغير)؟ */
  showPrintFooter: boolean
  /** تخطيط اسم الفقيد: وسط بسيط / داخل شارة / تحت مخطوطة مهيمنة */
  nameLayout: "plain" | "badge" | "calligraphy-dominant"
  /**
   * حوّل مخطوطات SVG اليدوية (حبر أسود/داكن أصلاً) إلى الأبيض عبر فلتر CSS —
   * ضروري للقوالب ذات الخلفية الداكنة (الليلي الفخم) وإلا تختفي المخطوطة على الأسود.
   */
  calligraphyInvert?: boolean
}
