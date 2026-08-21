// كتالوج الخطوط العربية القابلة للاختيار من "إعدادات النصوص" — يُستهلَك لكل من
// خط جميع النصوص (bodyFontFamily) وخط اسم الفقيد تحديداً (nameStyle.fontFamily)
// معاً. كلها مستضافة ذاتياً عبر next/font/google في layout.tsx (لا تُحمَّل من
// شبكة خارجية وقت التشغيل)، وتُعرض حيّاً بمحرك تشكيل المتصفح — لا مسارات مولَّدة،
// فلا مشاكل تشكيل عربي متوقَّعة (نفس مبدأ المخطوطات القرآنية في Calligraphy.tsx).

export interface TextFontOption {
  id: string
  label: string
  cssVar: string
}

export const TEXT_FONT_OPTIONS: TextFontOption[] = [
  { id: "amiri", label: "أميري", cssVar: "var(--font-amiri)" },
  { id: "amiri-quran", label: "أميري قرآن", cssVar: "var(--font-amiri-quran)" },
  { id: "scheherazade", label: "شهرزاد", cssVar: "var(--font-scheherazade)" },
  { id: "tajawal", label: "تجاوي", cssVar: "var(--font-tajawal)" },
  { id: "cairo", label: "القاهرة", cssVar: "var(--font-cairo)" },
  { id: "almarai", label: "المرعي", cssVar: "var(--font-almarai)" },
  { id: "alexandria", label: "الإسكندرية", cssVar: "var(--font-alexandria)" },
  { id: "ibm-plex-arabic", label: "آي بي إم بلكس", cssVar: "var(--font-ibm-plex-arabic)" },
  { id: "noto-naskh", label: "نوتو نسخ", cssVar: "var(--font-noto-naskh)" },
  { id: "reem-kufi-plain", label: "ريم كوفي", cssVar: "var(--font-reem-kufi-plain)" },
  { id: "reem-kufi", label: "ريم كوفي (فنّي)", cssVar: "var(--font-reem-kufi)" },
  { id: "aref-ruqaa", label: "عارف رقعة", cssVar: "var(--font-aref-ruqaa)" },
  { id: "el-messiri", label: "المسيري", cssVar: "var(--font-el-messiri)" },
  { id: "lalezar", label: "لالزار", cssVar: "var(--font-lalezar)" },
  { id: "markazi", label: "مركزي", cssVar: "var(--font-markazi)" },
]
