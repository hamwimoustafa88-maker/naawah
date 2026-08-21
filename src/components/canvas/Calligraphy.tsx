// مكوّن المخطوطة القرآنية — يفضّل ملف SVG يدوي حقيقي إن توفّر، وإلا يعرض نص الآية
// حيّاً بخط عربي حقيقي (محرك تشكيل المتصفح، لا توليد صور ولا مسارات مصطنعة).
//
// وجود الملف اليدوي يُحسَم مرة واحدة عند البناء عبر HANDMADE_CALLIGRAPHY_IDS
// (مولَّد بـ scripts/generate-calligraphy-manifest.ts قبل كل dev/build) — لا فحص
// شبكي وقت التشغيل، ولا خطر ظهور <img src> مكسور في شجرة #obituary-canvas عند
// التصدير (كان هذا يُفشل html-to-image بالكامل مع cacheBust).

import { QURAN_VERSES, BASMALA } from "@/lib/obituary/defaults"
import { HANDMADE_CALLIGRAPHY_IDS } from "@/lib/calligraphy/registry"
import type { CSSProperties } from "react"

interface CalligraphyProps {
  /** "basmala" أو أحد معرّفات QURAN_VERSES (يُستعمل أيضاً للنص الحيّ الاحتياطي) */
  id: string
  /**
   * اسم ملف SVG اليدوي الفعلي (بلا الامتداد) إن اختلف عن id — بعض الآيات لها
   * مخطوطتان مختلفتان بنفس النص (ملفان مختلفان)، فالاسم الدلالي (id) ينفصل عمداً
   * عن اسم الملف الفعلي على القرص. راجع QuranVerse.handmadeFile في defaults.ts.
   */
  handmadeFile?: string
  className?: string
  style?: CSSProperties
  /**
   * عرض الصورة المستهدف بالبكسل — **إلزامي** لملفات SVG اليدوية. ملفات SVG بلا
   * سمتَي width/height (لدينا فقط viewBox) يرثها المتصفح بحجمها الطبيعي في viewBox
   * كوحدات CSS مباشرة، ما ينتج صوراً ضخمة جداً بلا قصد — هذا عطل حقيقي واجهناه.
   * لا تُسقِط هذه الخاصية عند إضافة استخدام جديد للمكوّن.
   */
  widthPx: number
  /** خط عرض النص الحيّ عند غياب ملف SVG يدوي */
  fontFamily: string
  /**
   * يحوّل ملف SVG اليدوي (حبر أسود/داكن أصلاً) إلى الأبيض عبر فلتر CSS — للقوالب
   * ذات الخلفية الداكنة فقط (راجع TemplateDefinition.calligraphyInvert).
   */
  invert?: boolean
  /** حجم خط النص الحيّ بوحدة em — يُستهلَك فقط في غياب ملف SVG يدوي. راجع QuranVerse.liveTextFontSizeEm. */
  fontSizeEm?: number
}

function verseLines(id: string): string[] {
  if (id === "basmala") return [BASMALA]
  return QURAN_VERSES.find((v) => v.id === id)?.lines ?? []
}

export function Calligraphy({ id, handmadeFile, className, style, widthPx, fontFamily, invert, fontSizeEm }: CalligraphyProps) {
  const fileKey = handmadeFile ?? id
  if (HANDMADE_CALLIGRAPHY_IDS.has(fileKey)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- SVG محلي بسيط، لا يحتاج next/image
      <img
        src={`/calligraphy/handmade/${fileKey}.svg`}
        alt=""
        className={className}
        style={{
          ...style,
          width: widthPx,
          height: "auto",
          maxWidth: "100%",
          // brightness(0) يوحّد أي درجة حبر داكنة إلى أسود خالص، ثم invert(1) يقلبها
          // أبيض خالص — أضمن من invert() وحده أمام تفاوت درجات الحبر الممسوح ضوئياً.
          ...(invert ? { filter: "brightness(0) invert(1)" } : {}),
        }}
      />
    )
  }

  const lines = verseLines(id)
  if (lines.length === 0) return null

  return (
    <div
      className={className}
      style={{
        ...style,
        fontFamily,
        direction: "rtl",
        textAlign: "center",
        maxWidth: widthPx,
        marginInline: "auto",
        ...(fontSizeEm ? { fontSize: `${fontSizeEm}em` } : {}),
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ lineHeight: 1.7 }}>
          {line}
        </div>
      ))}
    </div>
  )
}
