// الكتل الدلالية المشتركة بين كل القوالب — القالب يبدّل الطبقة البصرية فقط
// (توكنات + إطار)، بينما يبقى ترتيب المحتوى ومصدره واحداً هنا.

import { Calligraphy } from "@/components/canvas/Calligraphy"
import {
  BASMALA_WIDTH_PX, CALLIGRAPHY_DEFAULT_WIDTH_PX, INNA_LILLAH_FOOTER_WIDTH_PX, QURAN_VERSES,
} from "@/lib/obituary/defaults"
import { A4_HEIGHT_PX } from "@/lib/obituary/pageSize"
import {
  birthInfoLine, closingDua, deceasedNameLine, familiesLine, funeralSentence,
  identityLine, maghfoorLine, marhoomWord, mourningSentence,
  printFooterText, processionLine, relativesBlocks,
} from "@/lib/obituary/render"
import type { ObituaryData } from "@/lib/obituary/types"
import type { TemplateDefinition } from "@/lib/templates/types"

/** أقصى مقاس صورة الفقيد: ٧×١٠سم عند 96dpi (١سم ≈ ٣٧.٨px) — طولية، بلا تمطيط. */
const PHOTO_MAX_WIDTH_PX = 265
const PHOTO_MAX_HEIGHT_PX = 378

function Divider({ tokens, divider, size = "0.9em" }: { tokens: TemplateDefinition["tokens"]; divider: string; size?: string }) {
  return <div style={{ color: tokens.accent, fontSize: size }}>{divider}</div>
}

export function ObituaryContent({
  data, template, scale,
}: {
  data: ObituaryData
  template: TemplateDefinition
  /** حجم auto-fit الحالي (0.55-1.0) — تستهلكه صورة الفقيد لتتقلّص بحد أقصى ٣٠٪ لا أكثر. */
  scale: number
}) {
  const { deceased, funeral } = data
  const { tokens, divider, nameLayout, showPrintFooter } = template
  const verse = deceased.quranVerseId ? QURAN_VERSES.find((v) => v.id === deceased.quranVerseId) : undefined
  const innaLillahVerse = QURAN_VERSES.find((v) => v.id === "inna-lillah")
  const identity = identityLine(deceased)
  const birthInfo = birthInfoLine(data)
  const relatives = relativesBlocks(data)
  const procession = processionLine(data)
  const footerText = printFooterText(data, showPrintFooter)

  // الصورة تتقلّص مع النص عند كثافة الأقارب، لكن بحد أقصى ٣٠٪ (لا حتى أدنى مقياس
  // auto-fit) — طُلب صراحةً أن تبقى الصورة قريبة من حجمها الطبيعي دائماً.
  const photoScale = Math.max(scale, 0.7)

  const nameFontFamily = data.nameStyle?.fontFamily || tokens.nameFont
  const nameSizeEm = 2.5 * (data.nameStyle?.sizeMultiplier ?? 1)
  const nameBold = data.nameStyle?.bold ?? true
  // خط جميع النصوص (عدا اسم الفقيد الذي له تحكّمه الخاص أعلاه) — قابل للتخصيص من
  // "إعدادات النصوص"، وإلا يُستعمل bodyFont الخاص بالقالب المختار (كان مُعرَّفاً في
  // كل قالب لكن لم يُطبَّق فعلياً على أي عنصر — عطل حقيقي أُصلح هنا: كل الفقرات كانت
  // تُعرض بخط الصفحة الافتراضي (Cairo) بصرف النظر عن bodyFont المقصود لكل قالب).
  const bodyFontFamily = data.bodyFontFamily || tokens.bodyFont

  // التعزية: إمّا مكان مشترك واحد للرجال والنساء، أو قسمان منفصلان كما كان.
  const hasSeparateCondolences = !funeral.condolencesShared && (funeral.condolencesMen || funeral.condolencesWomen)
  const hasSharedCondolences = funeral.condolencesShared && (funeral.condolencesMen || funeral.condolencesWomen)

  return (
    <div
      dir="rtl"
      style={{ textAlign: "center", color: tokens.ink, minHeight: A4_HEIGHT_PX, fontFamily: bodyFontFamily }}
      className="flex flex-col gap-3 px-14 py-16"
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

      {/* ٢-٣. المخطوطة القرآنية + صدق الله العظيم — حجمها قابل للتحكم اليدوي عبر quranVerseScale */}
      {verse && (
        <div style={{ marginBlock: nameLayout === "calligraphy-dominant" ? "0.4em" : "0.2em" }}>
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

      {divider && <div style={{ color: tokens.accent, fontSize: "1em" }}>{divider}</div>}

      {/* ٤. جملة النعي — قابلة للتخصيص عبر "نصوص مخصّصة" */}
      <p style={{ fontSize: "1.05em", lineHeight: 1.6 }}>{mourningSentence(data)}</p>

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

      {/* ٧. سطر الهوية + معلومات الميلاد */}
      {identity && <p style={{ fontSize: "1.05em" }}>{identity}</p>}
      {birthInfo && <p style={{ fontSize: "0.9em", color: tokens.muted }}>{birthInfo}</p>}

      {divider && <Divider tokens={tokens} divider={divider} />}

      {/* ٨. كتلة الأقارب */}
      {relatives.length > 0 && (
        <div className="flex flex-col gap-1.5" style={{ fontSize: "1em" }}>
          {relatives.map((g) => (
            <p key={g.id} style={{ lineHeight: 1.7 }}>
              <span style={{ fontWeight: 700 }}>{g.label}: </span>
              {g.text}
            </p>
          ))}
        </div>
      )}

      {divider && <Divider tokens={tokens} divider={divider} />}

      {/* ٩. صلاة الجنازة — "ويوارى الثرى في…" ملحقة داخل funeralSentence نفسها
          (بفاصلة، سطر مكمّل لا فقرة منفصلة)، وليست <p> مستقلة هنا. */}
      <div style={{ fontSize: "1em", lineHeight: 1.7 }}>
        {procession && <p>{procession}</p>}
        <p>{funeralSentence(data)}</p>
      </div>

      {/* ١٠. التعزية */}
      {(funeral.condolencesGeneral || hasSeparateCondolences || hasSharedCondolences) && (
        <div style={{ fontSize: "0.95em", color: tokens.muted, lineHeight: 1.7 }}>
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

        {/* ١٣. سطر العائلات */}
        <p style={{ fontSize: "1.1em", fontWeight: 700, margin: 0 }}>{familiesLine(data)}</p>

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
