// الكتل الدلالية المشتركة بين كل القوالب — القالب يبدّل الطبقة البصرية فقط
// (توكنات + إطار)، بينما يبقى ترتيب المحتوى ومصدره واحداً هنا.

import type { CSSProperties } from "react"
import { Calligraphy } from "@/components/canvas/Calligraphy"
import {
  BASMALA_WIDTH_PX, CALLIGRAPHY_DEFAULT_WIDTH_PX, INNA_LILLAH_FOOTER_WIDTH_PX, QURAN_CORNER_WIDTH_PX, QURAN_VERSES,
} from "@/lib/obituary/defaults"
import { A4_HEIGHT_PX } from "@/lib/obituary/pageSize"
import { DEFAULT_PHOTO_CROP, PHOTO_FRAME_HEIGHT_PX, PHOTO_FRAME_WIDTH_PX, photoCropTransform } from "@/lib/obituary/photoCrop"
import {
  birthInfoLine, burialLine, closingDua, deceasedNameLine, familiesLine, funeralSentence, funeralSentenceCore,
  identityLine, marhoomWord, mourningLine,
  prayerLocationLine, printFooterText, processionLine, relativesBlocks,
} from "@/lib/obituary/render"
import { useEditorStore } from "@/store/editorStore"
import type { ObituaryData, PhotoCrop } from "@/lib/obituary/types"
import type { TemplateDefinition } from "@/lib/templates/types"

/** حرف التطويل العربي — يُدرج داخل تسمية الفئة (لا في النص المُخزَّن) لمحاكاة
 * تنضيد الصحف الورقية (طرابلس وشمال لبنان حصراً، عبر relativesLayout). */
const TATWEEL = "ـ"
/** هامش إضافي فوق أطول تسمية فعلية — حتى الفئة الأطول تُطال قليلاً بدل البقاء
 * بلا تمديد إطلاقاً (طُلب صراحةً "ممطوط بشكل كامل" — تمديد واضح على كل الأسطر). */
const RELATIVE_LABEL_EXTRA_PAD = 6
const RELATIVE_LABEL_MIN_TARGET_LEN = 12

/** يُطيل تسمية فئة القرابة بحرف التطويل حتى تبلغ الطول الهدف المُمرَّر — يُدرَج قبل
 * آخر حرفين لتفادي كسر لاحقة الضمير ("ـه"/"ـها"/"ـهم") عن بقية الكلمة. */
function stretchRelativeLabel(label: string, targetLen: number): string {
  const raw = label.trim()
  if (raw.length >= targetLen) return raw
  const pad = TATWEEL.repeat(targetLen - raw.length)
  const cut = Math.max(raw.length - 2, 1)
  return raw.slice(0, cut) + pad + raw.slice(cut)
}

/** طول الهدف المشترك لكل تسميات الأقارب في نعوة واحدة — أطول تسمية فعلية + هامش،
 * حتى تُطال كل الفئات تمديداً واضحاً ومتّسقاً بصرياً بدل تمديد التسميات القصيرة
 * فقط (راجع stretchRelativeLabel). */
function relativeLabelTargetLen(labels: string[]): number {
  const longest = labels.reduce((max, l) => Math.max(max, l.trim().length), 0)
  return Math.max(RELATIVE_LABEL_MIN_TARGET_LEN, longest + RELATIVE_LABEL_EXTRA_PAD)
}

/**
 * كثافة عرض كتلة الأقارب (قوالب "centered-wrap" فقط — لا تمسّ "justified-lines"
 * الخاصة بطرابلس وشمال لبنان إطلاقاً) — ثلاث درجات تتبع مباشرة درجة تصغير
 * auto-fit نفسها (useAutoFit.ts)، بطلب صريح: صفحة فارغة (scale=1، بلا أي تصغير)
 * تعرض كل فئة قرابة بسطر مستقل مع فراغ واضح بينها؛ بمجرد أن يبدأ الخط بالتصغير
 * فعلياً (دليل مباشر على أن الصفحة بدأت تمتلئ)، تُدمج الفئات اثنتين اثنتين في كل
 * سطر؛ وعند تصغير أشدّ (الخط بلغ حدّه المفضّل ١٢px تقريباً أو تجاوزه) تتدفّق كل
 * الفئات معاً بلا حدّ (سطر واحد يضمّ أكبر عدد ممكن) — هذا الأخير كان السلوك
 * الوحيد سابقاً بصرف النظر عن الكثافة الفعلية، فيبدو النص "معجوقاً" على صفحة
 * لم تكن ممتلئة أصلاً.
 * ملاحظة: التدرّج يُشتقّ من scale النهائي بعد استقرار useAutoFit فقط (لا يُعاد
 * قياسه من جديد بالتخطيط الأكثف الناتج) — كسبٌ عملي بسيط بدل بحث ثنائي إضافي
 * يختبر كل تخطيط على حدة؛ النتيجة الأسوأ الممكنة "أكثر تحفّظاً مما يلزم بقليل"،
 * لا صفحة فائضة أو مكسورة.
 */
function relativesDensityMode(scale: number): "stacked" | "paired" | "flowing" {
  if (scale >= 0.95) return "stacked"
  if (scale >= 0.85) return "paired"
  return "flowing"
}

/** يقسّم مصفوفة إلى مجموعات متتالية بحجم size (المجموعة الأخيرة قد تكون أقصر). */
function chunkPairs<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size))
  return chunks
}

function Divider({ tokens, divider, size = "0.9em" }: { tokens: TemplateDefinition["tokens"]; divider: string; size?: string }) {
  return <div style={{ color: tokens.accent, fontSize: size }}>{divider}</div>
}

/**
 * صورة الفقيد داخل إطار ثابت طولي — object-fit:cover كأساس (يملأ الإطار بصرف
 * النظر عن اتجاه الصورة الأصلية)، ثم تحويل photoCropTransform فوقه لتطبيق
 * تكبير/تحريك المستخدم المحفوظَين في deceased.photoCrop. نفس حساب PhotoUpload.tsx
 * بالضبط (عبر lib/obituary/photoCrop.ts المشترك) فتطابق المعاينة النتيجة النهائية.
 */
function DeceasedPhoto({
  photoDataUrl, crop, photoScale, style,
}: {
  photoDataUrl: string
  crop: PhotoCrop
  photoScale: number
  style?: CSSProperties
}) {
  const frameWidthPx = PHOTO_FRAME_WIDTH_PX * photoScale
  const frameHeightPx = PHOTO_FRAME_HEIGHT_PX * photoScale
  return (
    <div style={{ position: "relative", overflow: "hidden", width: frameWidthPx, height: frameHeightPx, ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- صورة بيانات المستخدم (data URL) محلياً فقط */}
      <img
        src={photoDataUrl}
        alt=""
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: photoCropTransform(crop, frameWidthPx, frameHeightPx),
        }}
      />
    </div>
  )
}

export function ObituaryContent({
  data, template, scale,
}: {
  data: ObituaryData
  template: TemplateDefinition
  /** حجم auto-fit الحالي (0.625-1.0 — الخط يفضّل عدم النزول تحت ١٢px، ولا ينزل تحت ١٠px إطلاقاً حتى كملاذ أخير) — تستهلكه صورة الفقيد لتتقلّص بحد أدنى ٦٠٪. */
  scale: number
}) {
  const { deceased, funeral } = data
  const {
    tokens, divider, nameLayout, showPrintFooter, relativesLayout,
    nameSizeEm: templateNameSizeEm, quranPlacement, familiesLineScope, emphasizePrayerLocation,
  } = template
  // "نص مخصص" ليس آية فعلية في السجلّ — quranVerseId === "custom" يعني عرض
  // deceased.customTopText كنص حيّ بخط فني بدل البحث في QURAN_VERSES. راجع
  // Calligraphy.tsx (customText prop) وStep1Deceased.tsx (خيار "نص مخصص").
  const isCustomTopText = deceased.quranVerseId === "custom"
  const verse = deceased.quranVerseId && !isCustomTopText ? QURAN_VERSES.find((v) => v.id === deceased.quranVerseId) : undefined
  const hasTopVerseContent = Boolean(verse) || (isCustomTopText && Boolean(deceased.customTopText?.trim()))
  /** تكبير افتراضي للنص المخصّص — بلا هذا يبدو صغيراً جداً مقارنة بالمخطوطات
   * المرسومة يدوياً (نفس سبب liveTextFontSizeEm الخاص بآية "نفس مطمئنة"). */
  const CUSTOM_TOP_TEXT_FONT_SIZE_EM = 2
  const innaLillahVerse = QURAN_VERSES.find((v) => v.id === "inna-lillah")
  const identity = identityLine(deceased)
  const birthInfo = birthInfoLine(data)
  const relatives = relativesBlocks(data)
  const procession = processionLine(data)
  const footerText = printFooterText(data, showPrintFooter)

  // الصورة تتقلّص مع النص عند كثافة الأقارب، لكن بحد أدنى ٦٠٪ (لا حتى أدنى مقياس
  // auto-fit الكامل) — طُلب صراحةً أن تبقى الصورة قريبة من حجمها الطبيعي، مع سماح
  // بتقليص إضافي بسيط (كان ٧٠٪) كأحد أدوات التكثيف عند البيانات الكثيفة جداً.
  const photoScale = Math.max(scale, 0.6)

  // معاينة عابرة (hover) من FontPicker.tsx — أولوية أعلى من القيمة الفعلية المحفوظة،
  // بلا أي تعديل على data نفسها. undefined دائماً ما لم يكن المؤشر فوق اسم خط فعلياً.
  const previewBodyFontFamily = useEditorStore((s) => s.previewBodyFontFamily)
  const previewNameFontFamily = useEditorStore((s) => s.previewNameFontFamily)

  const nameFontFamily = previewNameFontFamily || data.nameStyle?.fontFamily || tokens.nameFont
  const nameSizeEm = (templateNameSizeEm ?? 2.5) * (data.nameStyle?.sizeMultiplier ?? 1)
  const nameBold = data.nameStyle?.bold ?? true
  // عبارة الترحّم ("المرحوم" مثلاً) — ١.١٥em ثابت افتراضياً، أو نفس حجم اسم الفقيد
  // بالضبط عند تفعيل deceased.marhoomEnlarged (زر تبديل واحد في بيانات الفقيد).
  const marhoomFontSizeEm = deceased.marhoomEnlarged ? nameSizeEm : 1.15
  // خط جميع النصوص (عدا اسم الفقيد الذي له تحكّمه الخاص أعلاه) — قابل للتخصيص من
  // "إعدادات النصوص"، وإلا يُستعمل bodyFont الخاص بالقالب المختار (كان مُعرَّفاً في
  // كل قالب لكن لم يُطبَّق فعلياً على أي عنصر — عطل حقيقي أُصلح هنا: كل الفقرات كانت
  // تُعرض بخط الصفحة الافتراضي (Cairo) بصرف النظر عن bodyFont المقصود لكل قالب).
  const bodyFontFamily = previewBodyFontFamily || data.bodyFontFamily || tokens.bodyFont

  // التعزية: إمّا مكان مشترك واحد للرجال والنساء، أو قسمان منفصلان كما كان.
  const hasSeparateCondolences = !funeral.condolencesShared && (funeral.condolencesMen || funeral.condolencesWomen)
  const hasSharedCondolences = funeral.condolencesShared && (funeral.condolencesMen || funeral.condolencesWomen)

  return (
    <div
      dir="rtl"
      style={{
        textAlign: "center",
        color: tokens.ink,
        minHeight: A4_HEIGHT_PX,
        fontFamily: bodyFontFamily,
        display: "flex",
        flexDirection: "column",
        // بادئاً كانت px-14/py-16/gap-3 أصنافاً بوحدة rem ثابتة لا تتأثر بتصغير
        // auto-fit للخط (content.style.fontSize يُطبَّق على هذا العنصر تحديداً) —
        // فتحوّلت لهدر مساحة رأسية متزايد كل ما اشتدت كثافة البيانات. تحويلها لـ
        // em يجعلها تتقلّص تلقائياً مع الخط في المرحلة ١ من useAutoFit، والفراغ
        // بين الأقسام (gap) يُضيَّق إضافياً في المرحلة ٢ عبر --fit-tightness.
        // الهامش العلوي تحديداً (paddingTop) يُضيَّق أكثر من السفلي — طُلب صراحةً
        // تقليص فراغات الأعلى تحديداً؛ السفلي أقل حساسية لأن الفقرات الأخيرة مثبَّتة
        // أسفل الصفحة بـmarginTop:auto فلا تستفيد من ضغطه بقدر ما يخسر شكل الصفحة.
        paddingInline: "3.5em",
        paddingTop: "calc(3.5em * var(--fit-tightness, 1))",
        paddingBottom: "3.5em",
        gap: "calc(0.75em * var(--fit-tightness, 1))",
      }}
    >
      {/* ١. البسملة — حجمها قابل للتحكم اليدوي من (بيانات الفقيد) عبر basmalaScale */}
      {deceased.hasBasmala && (
        <Calligraphy
          id="basmala"
          fontFamily={tokens.calligraphyFont}
          widthPx={BASMALA_WIDTH_PX * (deceased.basmalaScale ?? 1)}
          className="mx-auto"
          invert={template.calligraphyInvert}
        />
      )}

      {/* ٢-٣. المخطوطة القرآنية + الجهة الناعية. طرابلس وشمال لبنان (quranPlacement
          === "corner"): صفّ واحد — الجهة الناعية تتصدّر يمين الصفحة (أول عنصر DOM
          يُرسم يميناً مع dir="rtl")، والمخطوطة مصغّرة في الزاوية اليسرى بجانبها،
          بدل التتابع الرأسي المتوسِّط المعتاد في بقية القوالب. */}
      {quranPlacement === "corner" ? (
        (hasTopVerseContent || funeral.institutionHeader) && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "0.75em" }}>
            <div style={{ flex: "1 1 auto", textAlign: "right" }}>
              {funeral.institutionHeader && (
                <p style={{ margin: 0, fontSize: "1.15em", fontWeight: (funeral.institutionHeaderBold ?? true) ? 700 : 400, color: tokens.muted }}>
                  {funeral.institutionHeader}
                </p>
              )}
            </div>
            {hasTopVerseContent && (
              <div style={{ flex: "0 0 auto" }}>
                <Calligraphy
                  id={verse?.id ?? "custom"}
                  handmadeFile={verse?.handmadeFile}
                  fontFamily={isCustomTopText ? (deceased.customTopTextFontFamily || tokens.calligraphyFont) : tokens.calligraphyFont}
                  widthPx={QURAN_CORNER_WIDTH_PX * (deceased.quranVerseScale ?? 1)}
                  style={{ color: tokens.ink }}
                  invert={template.calligraphyInvert}
                  fontSizeEm={
                    isCustomTopText
                      ? CUSTOM_TOP_TEXT_FONT_SIZE_EM * (deceased.quranVerseScale ?? 1) * 0.5
                      : verse?.liveTextFontSizeEm
                        ? verse.liveTextFontSizeEm * (deceased.quranVerseScale ?? 1) * 0.5
                        : undefined
                  }
                  customText={isCustomTopText ? deceased.customTopText : undefined}
                />
              </div>
            )}
          </div>
        )
      ) : (
        <>
          {/* حجمها قابل للتحكم اليدوي عبر quranVerseScale. الهامش الرأسي حولها من
              أكبر فراغات أعلى الصفحة، فيُضيَّق أيضاً مع --fit-tightness. */}
          {hasTopVerseContent && (
            <div style={{ marginBlock: `calc(${nameLayout === "calligraphy-dominant" ? "0.4em" : "0.2em"} * var(--fit-tightness, 1))` }}>
              <Calligraphy
                id={verse?.id ?? "custom"}
                handmadeFile={verse?.handmadeFile}
                fontFamily={isCustomTopText ? (deceased.customTopTextFontFamily || tokens.calligraphyFont) : tokens.calligraphyFont}
                widthPx={(verse?.targetWidthPx ?? CALLIGRAPHY_DEFAULT_WIDTH_PX) * (deceased.quranVerseScale ?? 1)}
                className="mx-auto"
                style={{ color: tokens.ink }}
                invert={template.calligraphyInvert}
                fontSizeEm={
                  isCustomTopText
                    ? CUSTOM_TOP_TEXT_FONT_SIZE_EM * (deceased.quranVerseScale ?? 1)
                    : verse?.liveTextFontSizeEm
                      ? verse.liveTextFontSizeEm * (deceased.quranVerseScale ?? 1)
                      : undefined
                }
                customText={isCustomTopText ? deceased.customTopText : undefined}
              />
              {verse?.isQuran && (
                <div style={{ fontSize: "0.7em", color: tokens.muted, marginTop: "0.2em" }}>(صدق الله العظيم)</div>
              )}
            </div>
          )}

          {/* الجهة الناعية — بين المخطوطة العلوية وجملة النعي. حجم مكبَّر درجة عن سائر
              النص (1.15em) بطلب صريح، وخط عريض افتراضياً (institutionHeaderBold ??
              true) قابل للإلغاء من (٢. الجنازة والتعزية). */}
          {funeral.institutionHeader && (
            <p style={{ fontSize: "1.15em", fontWeight: (funeral.institutionHeaderBold ?? true) ? 700 : 400, color: tokens.muted }}>
              {funeral.institutionHeader}
            </p>
          )}
        </>
      )}

      {divider && <div style={{ color: tokens.accent, fontSize: "1em" }}>{divider}</div>}

      {/* ٤-٦. جملة النعي + سطر الترحّم + المرحوم + صورة الفقيد + اسم الفقيد.
          photoSideBySide (مفعّل افتراضياً عند وجود صورة): صفّ واحد — النص (أول
          عنصر DOM يُرسم يميناً مع dir="rtl") جهة اليمين، والصورة جهة اليسار،
          بدل الاستهلاك الرأسي للمساحة الذي يُسرِّع تفعيل تصغير auto-fit. بلا صورة،
          أو والخيار مُعطَّل، يبقى التخطيط المتوسِّط/المكدَّس الرأسي كما هو تماماً. */}
      {deceased.photoDataUrl && (deceased.photoSideBySide ?? true) ? (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "1em", width: "100%" }}>
          <div
            style={{
              flex: "1 1 auto",
              minWidth: 0,
              textAlign: "right",
              display: "flex",
              flexDirection: "column",
              gap: "calc(0.75em * var(--fit-tightness, 1))",
            }}
          >
            <p style={{ margin: 0, fontSize: "1.05em", lineHeight: "calc(1.6 * var(--fit-tightness, 1))" }}>{mourningLine(data)}</p>
            <p style={{ margin: 0, fontSize: `${marhoomFontSizeEm}em`, fontWeight: 700 }}>{marhoomWord(deceased)}</p>
            <h1
              style={{
                fontFamily: nameFontFamily,
                fontSize: `${nameSizeEm}em`,
                fontWeight: nameBold ? 700 : 500,
                lineHeight: 1.25,
                margin: 0,
                ...(nameLayout === "badge"
                  ? { border: `2px solid ${tokens.accent}`, borderRadius: "9999px", padding: "0.3em 1em", display: "inline-block" }
                  : {}),
              }}
            >
              {divider && nameLayout === "plain" ? `${divider} ${deceasedNameLine(deceased)} ${divider}` : deceasedNameLine(deceased)}
            </h1>
          </div>
          <DeceasedPhoto
            photoDataUrl={deceased.photoDataUrl}
            crop={deceased.photoCrop ?? DEFAULT_PHOTO_CROP}
            photoScale={photoScale}
            style={{ flex: "0 0 auto" }}
          />
        </div>
      ) : (
        <>
          {/* ٤. جملة النعي + سطر الترحّم — سطر واحد مدمج، قابل للتخصيص عبر "نصوص مخصّصة" */}
          <p style={{ fontSize: "1.05em", lineHeight: "calc(1.6 * var(--fit-tightness, 1))" }}>{mourningLine(data)}</p>

          {/* ٥. عبارة الترحّم — سطر مستقل تماماً، غير مشمول بالدمج أعلاه */}
          <p style={{ fontSize: `${marhoomFontSizeEm}em`, fontWeight: 700 }}>{marhoomWord(deceased)}</p>

          {/* صورة الفقيد — فوق الاسم، إطار ثابت ٧×١٠سم (object-fit:cover + تحكّم المستخدم
              بالتكبير/التحريك عبر photoCrop)، يتقلّص بحد أقصى ٣٠٪ فقط مع كثافة النص */}
          {deceased.photoDataUrl && (
            <DeceasedPhoto
              photoDataUrl={deceased.photoDataUrl}
              crop={deceased.photoCrop ?? DEFAULT_PHOTO_CROP}
              photoScale={photoScale}
              style={{ marginInline: "auto" }}
            />
          )}

          {/* ٦. اسم الفقيد — أكبر عنصر وأوضحه في الصفحة، بخط/حجم قابلين للتخصيص من الإعدادات */}
          <h1
            style={{
              fontFamily: nameFontFamily,
              fontSize: `${nameSizeEm}em`,
              fontWeight: nameBold ? 700 : 500,
              lineHeight: 1.25,
              margin: 0,
              ...(nameLayout === "badge"
                ? { border: `2px solid ${tokens.accent}`, borderRadius: "9999px", padding: "0.3em 1em", display: "inline-block", marginInline: "auto" }
                : {}),
            }}
          >
            {divider && nameLayout === "plain" ? `${divider} ${deceasedNameLine(deceased)} ${divider}` : deceasedNameLine(deceased)}
          </h1>
        </>
      )}

      {/* ٧. سطر الهوية + معلومات الميلاد */}
      {identity && <p style={{ fontSize: "1.05em" }}>{identity}</p>}
      {birthInfo && <p style={{ fontSize: "0.9em", color: tokens.muted }}>{birthInfo}</p>}

      {divider && <Divider tokens={tokens} divider={divider} />}

      {/* ٨. كتلة الأقارب. طرابلس وشمال لبنان (justified-lines): سلوك ثابت بصرف
          النظر عن الكثافة — كل فئة سطر مستقل (أسلوب تنضيد صحف تقليدي مقصود).
          بقية القوالب (centered-wrap): كثافة العرض تتدرّج مع scale فعلياً — راجع
          relativesDensityMode أعلاه. */}
      {relatives.length > 0 && relativesLayout === "justified-lines" ? (
        // طرابلس وشمال لبنان — كل فئة سطر مستقل بعرض الصفحة كاملاً، بلا توسيط،
        // بتسمية مطوَّلة بحرف التطويل قبل النقطتين (راجع stretchRelativeLabel أعلاه)
        // مطابقةً لتنضيد الصحف الورقية. text-align-last: justify يمدّد الفراغ بين
        // كلمات القيمة حتى نهاية السطر بدل تركها متكدّسة قرب البداية.
        <div style={{ fontSize: "1em", lineHeight: "calc(1.9 * var(--fit-tightness, 1))", width: "100%" }}>
          {(() => {
            const targetLen = relativeLabelTargetLen(relatives.map((g) => g.label))
            return relatives.map((g) => (
              <p
                key={g.id}
                style={{ margin: 0, textAlign: "justify", textAlignLast: "justify" }}
              >
                <span style={{ fontWeight: 700 }}>{stretchRelativeLabel(g.label, targetLen)}</span>
                {": "}
                {g.text}
              </p>
            ))
          })()}
        </div>
      ) : (
        relatives.length > 0 &&
        (() => {
          const mode = relativesDensityMode(scale)

          // "stacked" — صفحة غير ممتلئة (scale=1، بلا أي تصغير): كل فئة سطر
          // مستقل بفراغ واضح بينها، بدل تكديسها معاً بلا داعٍ فعلي للتوفير.
          if (mode === "stacked") {
            return (
              <div
                style={{
                  fontSize: "1em",
                  lineHeight: 1.7,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5em",
                }}
              >
                {relatives.map((g) => (
                  <p key={g.id} style={{ margin: 0, textAlign: "center" }}>
                    <span style={{ fontWeight: 700 }}>{g.label}: </span>
                    {g.text}
                  </p>
                ))}
              </div>
            )
          }

          // "paired" — الخط بدأ بالتصغير فعلياً (الصفحة بدأت تمتلئ): فئتان في
          // كل سطر بدل فئة واحدة، مرحلة وسطى بين التباعد الكامل والتدفّق الحرّ.
          if (mode === "paired") {
            return (
              <div
                style={{
                  fontSize: "1em",
                  lineHeight: "calc(1.7 * var(--fit-tightness, 1))",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "calc(0.3em * var(--fit-tightness, 1))",
                }}
              >
                {chunkPairs(relatives, 2).map((pair, i) => (
                  <p key={i} style={{ margin: 0, textAlign: "center" }}>
                    {pair.map((g, j) => (
                      <span key={g.id}>
                        <span style={{ fontWeight: 700 }}>{g.label}: </span>
                        {g.text}
                        {j < pair.length - 1 ? "، " : ""}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            )
          }

          // "flowing" — الصفحة ممتلئة فعلياً (الخط بلغ حدّه المفضّل أو تجاوزه):
          // كل الفئات تتدفّق معاً داخل صفّ ملتفّ (flex-wrap)، أكبر عدد ممكن في كل
          // سطر، بدل سطر مستقل إلزامي لكل فئة (هذا كان السلوك الوحيد سابقاً بصرف
          // النظر عن الكثافة الفعلية — يقلّص عدد الأسطر فيمنح auto-fit مساحة أكبر).
          return (
            <div
              style={{
                fontSize: "1em",
                lineHeight: "calc(1.7 * var(--fit-tightness, 1))",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                columnGap: "0.6em",
                rowGap: "calc(0.2em * var(--fit-tightness, 1))",
              }}
            >
              {relatives.map((g, i) => (
                <span key={g.id}>
                  <span style={{ fontWeight: 700 }}>{g.label}: </span>
                  {g.text}
                  {i < relatives.length - 1 ? "،" : ""}
                </span>
              ))}
            </div>
          )
        })()
      )}

      {divider && <Divider tokens={tokens} divider={divider} />}

      {/*
        ٩+١٠. التشييع والصلاة والدفن والتعزية معاً — إطار (stroke) مربع اختياري
        حول القسمين معاً (emphasizeFuneralBox، مفعّل افتراضياً) لتركيز الانتباه
        على المعلومات المهمة؛ لا يشمل "ملاحظات إضافية" بعده عمداً. راجع
        Step2Funeral.tsx (CondolencesFields) للتحكّم.
      */}
      {(() => {
        const funeralAndCondolences = (
          <>
            {/* ٩. صلاة الجنازة — "ويوارى الثرى في…" ملحقة داخل funeralSentence نفسها
                (بفاصلة، سطر مكمّل لا فقرة منفصلة)، وليست <p> مستقلة هنا. طرابلس وشمال
                لبنان (emphasizePrayerLocation): اسم المسجد يُفصل كسطر عريض مستقل بعد
                جملة الصلاة، بدل دمجه داخلها — راجع funeralSentenceCore/prayerLocationLine
                في render.ts (funeralSentence نفسها بلا تغيير، تبقى لبقية القوالب). */}
            <div style={{ fontSize: "1em", lineHeight: "calc(1.7 * var(--fit-tightness, 1))" }}>
              {procession && <p>{procession}</p>}
              {emphasizePrayerLocation ? (
                <>
                  <p>{funeralSentenceCore(data)}</p>
                  {prayerLocationLine(data) && (
                    <p style={{ fontSize: "1.3em", fontWeight: 700, margin: "0.2em 0" }}>{prayerLocationLine(data)}</p>
                  )}
                  {burialLine(data) && <p style={{ fontSize: "0.85em", color: tokens.muted }}>{burialLine(data)}</p>}
                </>
              ) : (
                <p>{funeralSentence(data)}</p>
              )}
            </div>

            {/* ١٠. التعزية */}
            {(funeral.condolencesGeneral || hasSeparateCondolences || hasSharedCondolences) && (
              <div style={{ fontSize: "0.95em", color: tokens.muted, lineHeight: "calc(1.7 * var(--fit-tightness, 1))" }}>
                {funeral.condolencesGeneral && <p>{funeral.condolencesGeneral}</p>}
                {hasSharedCondolences && <p>للرجال والنساء: {funeral.condolencesMen || funeral.condolencesWomen}</p>}
                {hasSeparateCondolences && (
                  <>
                    {funeral.condolencesMen && <p>للرجال: {funeral.condolencesMen}</p>}
                    {funeral.condolencesWomen && <p>للنساء: {funeral.condolencesWomen}</p>}
                  </>
                )}
              </div>
            )}
          </>
        )

        return (funeral.emphasizeFuneralBox ?? true) ? (
          <div style={{ border: `1px solid ${tokens.ink}`, borderRadius: 0, padding: "0.6em 0.9em", display: "flex", flexDirection: "column", gap: "0.5em" }}>
            {funeralAndCondolences}
          </div>
        ) : (
          funeralAndCondolences
        )
      })()}

      {funeral.extraNotes && <p style={{ fontSize: "0.9em", color: tokens.muted }}>{funeral.extraNotes}</p>}

      {/*
        الفقرات الثلاث الأخيرة ثابتة أسفل الصفحة دائماً (خاتمة الدعاء، إنّا لله وإنّا
        إليه راجعون، سطر العائلات) — margin-top:auto يدفعها للأسفل عند وجود فراغ
        (نعوة قصيرة النص)، بفضل minHeight الثابت على الجذر أعلاه. لا تُغيَّر إلى flex-grow
        على عنصر آخر — هذا يكسر حساب auto-fit (راجع useAutoFit.ts).
      */}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.75em" }}>
        {funeral.extraBottomSpacingEm ? <div style={{ height: `${funeral.extraBottomSpacingEm}em` }} /> : null}
        {funeral.extraDividerLine && (
          <div style={{ borderTop: `1px solid ${tokens.muted}`, opacity: 0.5, marginBlock: "0.3em" }} />
        )}

        {/* ١١. خاتمة الدعاء */}
        <p style={{ fontSize: "1.05em", fontWeight: 600, margin: 0 }}>{closingDua(data)}</p>

        {/*
          ١٢. إنّا لله وإنّا إليه راجعون — نفس ملف SVG اليدوي المستعمل أعلى الصفحة
          (handmadeFile="1")، لكن بعرض أصغر بكثير هنا (INNA_LILLAH_FOOTER_WIDTH_PX
          وليس targetWidthPx من QURAN_VERSES) — علامة ختامية صغيرة، لا مخطوطة رئيسية.
          حجمها قابل للتحكم اليدوي أيضاً عبر innaLillahScale.
        */}
        {deceased.hasInnaLillah && (
          <Calligraphy
            id="inna-lillah"
            handmadeFile={innaLillahVerse?.handmadeFile}
            fontFamily={tokens.calligraphyFont}
            widthPx={INNA_LILLAH_FOOTER_WIDTH_PX * (deceased.innaLillahScale ?? 1)}
            className="mx-auto"
            invert={template.calligraphyInvert}
          />
        )}

        {/* ١٣. سطر العائلات — familiesLineScope="parents-only" (طرابلس وشمال لبنان
            حصراً): عائلة الأب وعائلة الأم فقط، لا كل عائلات الأقارب والأصهار. */}
        <p style={{ fontSize: "1.1em", fontWeight: 700, margin: 0 }}>{familiesLine(data, familiesLineScope)}</p>

        {/* ١٤. فوتر المطبعة — قابل للتفعيل والتحرير من المحرر */}
        {footerText && (
          <div style={{ paddingTop: "0.6em", borderTop: `1px solid ${tokens.ink}`, fontSize: "0.65em", color: tokens.muted }}>
            {footerText}
          </div>
        )}
      </div>
    </div>
  )
}
