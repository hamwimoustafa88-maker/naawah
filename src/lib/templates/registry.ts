// مسجّل القوالب — ٦ قوالب متمايزة في: الإطار، الخلفية، الخط، تخطيط الاسم، والفواصل.

import {
  GoldFrame, NewspaperFrame, MinimalFrame, OliveFrame, RoyalFrame, ThuluthFrame,
} from "@/components/canvas/frames/frames"
import type { TemplateDefinition } from "./types"

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "gold-classic",
    name: "الكلاسيكي الذهبي",
    category: "تقليدي",
    description: "إطار مزدوج بزوايا أرابيسك على خلفية عاجية، بخط أميري رصين.",
    tokens: {
      bg: "#faf6ec",
      ink: "#241a0f",
      accent: "#a8802a",
      muted: "#6b5a3e",
      nameFont: "var(--font-amiri)",
      bodyFont: "var(--font-amiri)",
      calligraphyFont: "var(--font-amiri-quran)",
    },
    Frame: GoldFrame,
    divider: "✦",
    showPrintFooter: false,
    nameLayout: "plain",
  },
  {
    id: "olive-calm",
    name: "الزيتي الهادئ",
    category: "حديث",
    description: "خط رفيع مفرد وحيز أبيض واسع، بخط شهرزاد الهادئ.",
    tokens: {
      bg: "#ffffff",
      ink: "#1f2a1a",
      accent: "#5c6e3f",
      muted: "#7a8768",
      nameFont: "var(--font-scheherazade)",
      bodyFont: "var(--font-scheherazade)",
      calligraphyFont: "var(--font-amiri-quran)",
    },
    Frame: OliveFrame,
    divider: "—",
    showPrintFooter: false,
    nameLayout: "plain",
  },
  {
    id: "modern-minimal",
    name: "الزجاجي الحديث",
    category: "حديث",
    description: "بلا إطار إطلاقاً، أبيض ناصع، خط تجاوي واضح لقراءة سريعة.",
    tokens: {
      bg: "#ffffff",
      ink: "#111827",
      accent: "#374151",
      muted: "#6b7280",
      nameFont: "var(--font-tajawal)",
      bodyFont: "var(--font-tajawal)",
      calligraphyFont: "var(--font-amiri-quran)",
    },
    Frame: MinimalFrame,
    divider: "",
    showPrintFooter: false,
    nameLayout: "plain",
  },
  {
    id: "thuluth-focus",
    name: "الخط الثلث المترادف",
    category: "تقليدي",
    description: "المخطوطة القرآنية تهيمن على الثلث العلوي، بإطار متقطّع.",
    tokens: {
      bg: "#f7f2e6",
      ink: "#26201a",
      accent: "#7a5230",
      muted: "#6e5c47",
      nameFont: "var(--font-amiri)",
      bodyFont: "var(--font-amiri)",
      calligraphyFont: "var(--font-aref-ruqaa)",
    },
    Frame: ThuluthFrame,
    divider: "✷",
    showPrintFooter: false,
    nameLayout: "calligraphy-dominant",
  },
  {
    id: "royal-monogram",
    name: "البروتوكولي الملكي",
    category: "ملكي",
    description: "إطار مزدوج ومعيّنات الزوايا، واسم الفقيد داخل شارة مركزية.",
    tokens: {
      bg: "#faf3e3",
      ink: "#241c12",
      accent: "#8a6d1f",
      muted: "#6d5c3a",
      nameFont: "var(--font-amiri)",
      bodyFont: "var(--font-amiri)",
      calligraphyFont: "var(--font-reem-kufi)",
    },
    Frame: RoyalFrame,
    divider: "◈",
    showPrintFooter: false,
    nameLayout: "badge",
  },
  {
    id: "traditional-press",
    name: "الصحيفة التقليدية",
    category: "تقليدي",
    description: "خطوط علوية وسفلية ثقيلة بلا جوانب، بفوتر مطبعة — أقرب لنعوة الصحف الورقية.",
    tokens: {
      bg: "#ffffff",
      ink: "#1a1a1a",
      accent: "#1a1a1a",
      muted: "#4b4b4b",
      nameFont: "var(--font-amiri)",
      bodyFont: "var(--font-amiri)",
      calligraphyFont: "var(--font-amiri-quran)",
    },
    Frame: NewspaperFrame,
    divider: "",
    showPrintFooter: true,
    nameLayout: "plain",
  },
  {
    id: "midnight-elegant",
    name: "الليلي الفخم",
    category: "ملكي",
    description: "خلفية سوداء أنيقة بخط ذهبي وإطار مزدوج — مثالية للمشاركة على وسائل التواصل.",
    tokens: {
      bg: "#161311",
      ink: "#f2e8d8",
      accent: "#c9a94a",
      muted: "#a89676",
      nameFont: "var(--font-amiri)",
      bodyFont: "var(--font-amiri)",
      calligraphyFont: "var(--font-amiri-quran)",
    },
    // إعادة استعمال RoyalFrame — الإطارات مبنية على متغيّرات CSS للقالب فقط (--tpl-accent/--tpl-ink)
    // فتعمل بصرياً على أي خلفية بلا أي تعديل.
    Frame: RoyalFrame,
    divider: "✦",
    showPrintFooter: false,
    nameLayout: "plain",
    // خلفية سوداء — مخطوطات SVG اليدوية مرسومة بحبر أسود/داكن، تختفي بلا هذا الفلتر.
    calligraphyInvert: true,
  },
  {
    id: "tripoli-north",
    name: "طرابلس وشمال لبنان",
    category: "تقليدي",
    description: "الرزنامة الصحفية المعتمدة في طرابلس والشمال — حبر أسود خالص على أبيض ناصع بخط نسخ تقليدي، بلا إطار.",
    tokens: {
      bg: "#ffffff",
      ink: "#0a0a0a",
      accent: "#0a0a0a",
      muted: "#4b4b4b",
      nameFont: "var(--font-noto-naskh)",
      bodyFont: "var(--font-noto-naskh)",
      calligraphyFont: "var(--font-amiri-quran)",
    },
    // نسخة عن MinimalFrame (بلا إطار إطلاقاً) — النعوة الصحفية المعتمدة في طرابلس
    // مسطّحة بلا حدود صفحة، فالتمايز البصري كلّه عبر الخط الأسود الخالص والنسخ التقليدي.
    Frame: MinimalFrame,
    divider: "",
    showPrintFooter: false,
    nameLayout: "plain",
    // كتلة الأقارب على طراز الصحف الطرابلسية الورقية — سطر مستقل بعرض الصفحة لكل
    // فئة، بلا توسيط، وبتسمية مطوَّلة بحرف التطويل قبل النقطتين.
    relativesLayout: "justified-lines",
    // الاسم أكبر عنصر في الصفحة بوضوح — أكبر من الافتراضي (٢.٥) بكثير.
    nameSizeEm: 4,
    // المخطوطة القرآنية مصغّرة في الزاوية العلوية بجانب الجهة الناعية، لا وسط الصفحة.
    quranPlacement: "corner",
    // سطر العائلات: عائلة الأب وعائلة الأم فقط، لا كل عائلات الأقارب والأصهار.
    familiesLineScope: "parents-only",
    // اسم المسجد سطر عريض مستقل بعد جملة الصلاة، لا مدموجاً داخلها.
    emphasizePrayerLocation: true,
    // مخفيّ مؤقّتاً بطلب صريح — التعريف يبقى كاملاً (getTemplate يجده عبر TEMPLATES
    // غير المُصفّاة)، فقط غائب عن واجهات الاختيار عبر VISIBLE_TEMPLATES أدناه.
    // لإعادة إظهاره: احذف هذا السطر.
    hidden: true,
  },
]

/** القوالب الظاهرة فعلياً في واجهات الاختيار (محرر /create + معرض الصفحة الرئيسية)
 * — تستبعد أي قالب `hidden: true`. استعمل TEMPLATES نفسها (غير المُصفّاة) فقط عند
 * الحاجة لحلّ معرّف قالب محدَّد (getTemplate) لا لعرض قائمة اختيار. */
export const VISIBLE_TEMPLATES = TEMPLATES.filter((t) => !t.hidden)

export function getTemplate(id: string): TemplateDefinition {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}
