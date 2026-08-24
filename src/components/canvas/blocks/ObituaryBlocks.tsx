// الكتل الدلالية المشتركة بين كل القوالب — القالب يبدّل الطبقة البصرية فقط
// (توكنات + إطار)، بينما يبقى ترتيب المحتوى ومصدره واحداً هنا.

import { Calligraphy } from "@/components/canvas/Calligraphy"
import {
  BASMALA_WIDTH_PX, CALLIGRAPHY_DEFAULT_WIDTH_PX, INNA_LILLAH_FOOTER_WIDTH_PX, QURAN_CORNER_WIDTH_PX, QURAN_VERSES,
} from "@/lib/obituary/defaults"
import { A4_HEIGHT_PX } from "@/lib/obituary/pageSize"
import {
  birthInfoLine, burialLine, closingDua, deceasedNameLine, familiesLine, funeralSentence, funeralSentenceCore,
  identityLine, maghfoorLine, marhoomWord, mourningSentence,
  prayerLocationLine, printFooterText, processionLine, relativesBlocks,
} from "@/lib/obituary/render"
import { useEditorStore } from "@/store/editorStore"
import type { ObituaryData } from "@/lib/obituary/types"
import type { TemplateDefinition } from "@/lib/templates/types"

/** أقصى مقاس صورة الفقيد: ٧×١٠سم عند 96dpi (١سم ≈ ٣٧.٨px) — طولية، بلا تمطيط. */
const PHOTO_MAX_WIDTH_PX = 265
const PHOTO_MAX_HEIGHT_PX = 378

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

function Divider({ tokens, divider, size = "0.9em" }: { tokens: TemplateDefinition["tokens"]; divider: string; size?: string }) {
  return <div style={{ color: tokens.accent, fontSize: size }}>{divider}</div>
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
  const verse = deceased.quranVerseId ? QURAN_VERSES.find((v) => v.id === deceased.quranVerseId) : undefined
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
        (verse || funeral.institutionHeader) && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "0.75em" }}>
            <div style={{ flex: "1 1 auto", textAlign: "right" }}>
              {funeral.institutionHeader && (
                <p style={{ margin: 0, fontSize: "1.15em", fontWeight: (funeral.institutionHeaderBold ?? true) ? 700 : 400, color: tokens.muted }}>
                  {funeral.institutionHeader}
                </p>
              )}
            </div>
            {verse && (
              <div style={{ flex: "0 0 auto" }}>
                <Calligraphy
                  id={verse.id}
                  handmadeFile={verse.handmadeFile}
                  fontFamily={tokens.calligraphyFont}
                  widthPx={QURAN_CORNER_WIDTH_PX * (deceased.quranVerseScale ?? 1)}
                  style={{ color: tokens.ink }}
                  invert={template.calligraphyInvert}
                  fontSizeEm={verse.liveTextFontSizeEm ? verse.liveTextFontSizeEm * (deceased.quranVerseScale ?? 1) * 0.5 : undefined}
                />
              </div>
            )}
          </div>
        )
      ) : (
        <>
          {/* حجمها قابل للتحكم اليدوي عبر quranVerseScale. الهامش الرأسي حولها من
              أكبر فراغات أعلى الصفحة، فيُضيَّق أيضاً مع --fit-tightness. */}
          {verse && (
            <div style={{ marginBlock: `calc(${nameLayout === "calligraphy-dominant" ? "0.4em" : "0.2em"} * var(--fit-tightness, 1))` }}>
              <Calligraphy
                id={verse.id}
                handmadeFile={verse.handmadeFile}
                fontFamily={tokens.calligraphyFont}
                widthPx={(verse.targetWidthPx ?? CALLIGRAPHY_DEFAULT_WIDTH_PX) * (deceased.quranVerseScale ?? 1)}
                className="mx-auto"
                style={{ color: tokens.ink }}
                invert={template.calligraphyInvert}
                fontSizeEm={verse.liveTextFontSizeEm ? verse.liveTextFontSizeEm * (deceased.quranVerseScale ?? 1) : undefined}
              />
              {verse.isQuran && (
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
            <p style={{ margin: 0, fontSize: "1.05em", lineHeight: "calc(1.6 * var(--fit-tightness, 1))" }}>{mourningSentence(data)}</p>
            <p style={{ margin: 0, fontSize: "1em", color: tokens.muted }}>{maghfoorLine(data)}</p>
            <p style={{ margin: 0, fontSize: "1.15em", fontWeight: 700 }}>{marhoomWord(deceased)}</p>
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
          {/* eslint-disable-next-line @next/next/no-img-element -- صورة بيانات المستخدم (data URL) محلياً فقط */}
          <img
            src={deceased.photoDataUrl}
            alt=""
            style={{
              flex: "0 0 auto",
              maxWidth: PHOTO_MAX_WIDTH_PX * photoScale,
              maxHeight: PHOTO_MAX_HEIGHT_PX * photoScale,
              width: "auto",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </div>
      ) : (
        <>
          {/* ٤. جملة النعي — قابلة للتخصيص عبر "نصوص مخصّصة" */}
          <p style={{ fontSize: "1.05em", lineHeight: "calc(1.6 * var(--fit-tightness, 1))" }}>{mourningSentence(data)}</p>

          {/* ٥. سطر الترحّم */}
          <p style={{ fontSize: "1em", color: tokens.muted }}>{maghfoorLine(data)}</p>
          <p style={{ fontSize: "1.15em", fontWeight: 700 }}>{marhoomWord(deceased)}</p>

          {/* صورة الفقيد — فوق الاسم، أقصى مقاس فيزيائي ٧×١٠سم، تتقلّص بحد أقصى ٣٠٪ فقط مع كثافة النص */}
          {deceased.photoDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- صورة بيانات المستخدم (data URL) محلياً فقط
            <img
              src={deceased.photoDataUrl}
              alt=""
              style={{
                maxWidth: PHOTO_MAX_WIDTH_PX * photoScale,
                maxHeight: PHOTO_MAX_HEIGHT_PX * photoScale,
                width: "auto",
                height: "auto",
                objectFit: "contain",
                marginInline: "auto",
              }}
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

      {/* ٨. كتلة الأقارب — كل فئة "label: نص" تتدفّق كوحدة داخل صفّ ملتفّ (flex-wrap)
          بدل سطر مستقل إلزامي لكل فئة (كان يُهدر سطراً كاملاً حتى لأقصر فئة، كـ"زوجته: فلانة").
          الفئات القصيرة تلتئم تلقائياً عدّة في السطر نفسه (والده/والدته/أخوه/أخته…)،
          مفصولة بفاصلة عربية كبقية قوائم النعوة (راجع familiesLine)، وتلتف الفئات
          الطويلة (كقائمة أبناء كبيرة) بنفسها بلا كسر إلزامي. هذا يقلّص عدد الأسطر
          الفعلي فيمنح auto-fit مساحة أكبر فيبقي الخط أقرب لحجمه الطبيعي بدل تصغيره. */}
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
        relatives.length > 0 && (
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
      )}

      {divider && <Divider tokens={tokens} divider={divider} />}

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
