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

// الأسماء بالإنجليزية عمداً (لا نظائرها العربية) — بطلب صريح: هي الأسماء الفعلية
// للخطوط كما تُعرف بها عالمياً (مطابقة لاسم كل خط في Google Fonts حرفياً)، فيسهل
// على المستخدم تمييزها والبحث عنها لاحقاً، بدل تسميات عربية مترجمة قد تختلف تفسيرها.
export const TEXT_FONT_OPTIONS: TextFontOption[] = [
  { id: "amiri", label: "Amiri", cssVar: "var(--font-amiri)" },
  { id: "amiri-quran", label: "Amiri Quran", cssVar: "var(--font-amiri-quran)" },
  { id: "scheherazade", label: "Scheherazade New", cssVar: "var(--font-scheherazade)" },
  { id: "tajawal", label: "Tajawal", cssVar: "var(--font-tajawal)" },
  { id: "cairo", label: "Cairo", cssVar: "var(--font-cairo)" },
  { id: "almarai", label: "Almarai", cssVar: "var(--font-almarai)" },
  { id: "alexandria", label: "Alexandria", cssVar: "var(--font-alexandria)" },
  { id: "ibm-plex-arabic", label: "IBM Plex Sans Arabic", cssVar: "var(--font-ibm-plex-arabic)" },
  { id: "noto-naskh", label: "Noto Naskh Arabic", cssVar: "var(--font-noto-naskh)" },
  { id: "reem-kufi-plain", label: "Reem Kufi", cssVar: "var(--font-reem-kufi-plain)" },
  { id: "reem-kufi", label: "Reem Kufi Ink", cssVar: "var(--font-reem-kufi)" },
  { id: "aref-ruqaa", label: "Aref Ruqaa Ink", cssVar: "var(--font-aref-ruqaa)" },
  { id: "el-messiri", label: "El Messiri", cssVar: "var(--font-el-messiri)" },
  { id: "lalezar", label: "Lalezar", cssVar: "var(--font-lalezar)" },
  { id: "markazi", label: "Markazi Text", cssVar: "var(--font-markazi)" },
]
