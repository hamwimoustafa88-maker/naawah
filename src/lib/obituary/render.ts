// طبقة التركيب — تبني جمل الصفحة الكاملة من البيانات + محرك القواعد + محرك التاريخ.

import { DECEASED_WORDS, MARHOOM_STYLE_WORDS, PARENT_LABELS, relativeCategoryLabel, renderRelativeList } from "./grammar"
import { formatDualDate, formatWeekdayName } from "./hijri"
import { DEFAULT_PRINT_FOOTER_TEXT, MOURNING_OPENINGS } from "./defaults"
import type { DeceasedInfo, ObituaryData } from "./types"

/** يُلحق لام الجر بكلمة تبدأ بـ"ال" التعريف: "الفقيد" → "للفقيد" */
function attachLam(word: string): string {
  return word.startsWith("ال") ? "لل" + word.slice(2) : "ل" + word
}

export function defaultMourningSentence(): string {
  return MOURNING_OPENINGS[0]
}

/** جملة النعي الافتتاحية — قابلة للتخصيص عبر data.customTexts.mourningSentence. */
export function mourningSentence(data: ObituaryData): string {
  return data.customTexts?.mourningSentence ?? defaultMourningSentence()
}

export function defaultMaghfoorLine(gender: DeceasedInfo["gender"]): string {
  return `${DECEASED_WORDS[gender].maghfoor} بإذن الله`
}

export function maghfoorLine(data: ObituaryData): string {
  return data.customTexts?.maghfoorLine ?? defaultMaghfoorLine(data.deceased.gender)
}

/**
 * عبارة الترحّم فوق اسم الفقيد مباشرة — "المرحوم/ة" افتراضياً، أو "الشهيد/ة"،
 * أو نص حر (marhoomCustomText) عند اختيار "custom". قابلة للتحكم من (بيانات الفقيد).
 */
export function marhoomWord(deceased: DeceasedInfo): string {
  if (deceased.marhoomStyle === "custom") {
    return deceased.marhoomCustomText?.trim() || MARHOOM_STYLE_WORDS.marhoom[deceased.gender]
  }
  return MARHOOM_STYLE_WORDS[deceased.marhoomStyle === "shaheed" ? "shaheed" : "marhoom"][deceased.gender]
}

export function deceasedNameLine(deceased: DeceasedInfo): string {
  return [deceased.honorific, deceased.name].filter(Boolean).join(" ")
}

/** سطر الهوية: زوجة/أرملة المرحوم فلان — أو "المتوفي/المتوفاة في {مكان}". null إن لم ينطبق شيء. */
export function identityLine(deceased: DeceasedInfo): string | null {
  if (deceased.gender === "female" && deceased.spouseName) {
    const style = deceased.widowStyle ?? "زوجة"
    // "حرم المغفور له" تحمل معنى الوفاة داخل العبارة نفسها — لا نُضيف "المرحوم" بعدها.
    // ولا نُضيفها أيضاً إن كتبها المستخدم بالفعل داخل حقل لقب الزوج الحر.
    const honorificAlreadyMarksDeath = deceased.spouseHonorific?.includes("مرحوم") ?? false
    const styleAlreadyMarksDeath = style === "حرم المغفور له"
    const marker = deceased.spouseIsDeceased && !honorificAlreadyMarksDeath && !styleAlreadyMarksDeath ? "المرحوم" : ""
    return [style, marker, deceased.spouseHonorific, deceased.spouseName].filter(Boolean).join(" ")
  }
  if (deceased.deathPlaceNote) {
    const word = deceased.gender === "male" ? "المتوفي" : "المتوفاة"
    return `${word} في ${deceased.deathPlaceNote}`
  }
  return null
}

export interface RenderedRelativeGroup {
  id: string
  label: string
  text: string
}

export function relativesBlocks(data: ObituaryData): RenderedRelativeGroup[] {
  const blocks: RenderedRelativeGroup[] = []
  for (const g of data.relatives) {
    if (g.members.length === 0) continue

    if (g.categoryKey === "parents") {
      // فئة موحّدة في المحرر، لكنها تُطبع كسطرين منفصلين (كما في كل النعوات الحقيقية):
      // "والده: ..." ثم "والدته: ..." — الأب والأم يُميَّزان بجنس العضو نفسه.
      const father = g.members.find((m) => m.gender === "male")
      const mother = g.members.find((m) => m.gender === "female")
      if (father) {
        blocks.push({
          id: `${g.id}-father`,
          label: PARENT_LABELS.father[data.deceased.gender],
          text: renderRelativeList([father]),
        })
      }
      if (mother) {
        blocks.push({
          id: `${g.id}-mother`,
          label: PARENT_LABELS.mother[data.deceased.gender],
          text: renderRelativeList([mother]),
        })
      }
      continue
    }

    blocks.push({
      id: g.id,
      label: relativeCategoryLabel(g.categoryKey, data.deceased.gender, g.members, g.customLabel),
      text: renderRelativeList(g.members),
    })
  }
  return blocks
}

export function funeralSentence(data: ObituaryData): string {
  const words = DECEASED_WORDS[data.deceased.gender]
  // تاريخ الصلاة/الدفن قد يختلف عن تاريخ الوفاة (الدفن غالباً بعد يوم أو أكثر) —
  // إن لم يُحدَّد صراحةً، نفترضه نفس تاريخ الوفاة.
  const burialDate = data.funeral.burialDateISO || data.deceased.deathDateISO
  const dateStr = formatDualDate(burialDate, {
    hijriOffsetDays: data.deceased.hijriOffsetDays,
    order: data.format.dateOrder,
    numerals: data.format.numerals,
    months: data.format.months,
  })
  const weekday = formatWeekdayName(burialDate)
  const parts = [
    words.sayusalla,
    "على",
    words.jasad,
    words.tahir,
    data.funeral.prayerTimeNote,
    weekday ? `يوم ${weekday}` : "",
    dateStr ? `الواقع في ${dateStr}` : "",
    data.funeral.prayerLocation ? `في ${data.funeral.prayerLocation}` : "",
  ]
  const sentence = parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim()

  // "ويوارى الثرى في {مكان الدفن}" يُلحَق مباشرة بفاصلة — سطر مكمّل لا فقرة منفصلة،
  // بطلب صريح: كان يظهر كسطر مستقل تحت جملة الصلاة فلا يبدو استمراراً لها بصرياً.
  return data.funeral.burialLocation
    ? `${sentence}، ويوارى الثرى في ${data.funeral.burialLocation}`
    : sentence
}

export function defaultClosingDua(gender: DeceasedInfo["gender"]): string {
  const words = DECEASED_WORDS[gender]
  return `${attachLam(words.faqeed)} ${words.rahmah} ولكم ${words.ajruh} والثواب`
}

export function closingDua(data: ObituaryData): string {
  return data.customTexts?.closingDua ?? defaultClosingDua(data.deceased.gender)
}

/**
 * آخر كلمة في اسم كامل — تُعامَل كاسم العائلة (اللقب العائلي). أسماء من كلمة واحدة
 * (غالباً أبناء/إخوة يُذكرون بالاسم الأول فقط، يُفترض مشاركتهم لقب الفقيد نفسه)
 * تُستبعد عمداً — لا يوجد فيها ما يُميَّز كلقب عائلة فعلي، فتحويلها إلى "عائلة"
 * كان يُلوِّث القائمة بأسماء أولى ليست عائلات إطلاقاً.
 */
function lastNameOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  return parts.length >= 2 ? parts[parts.length - 1] : ""
}

/**
 * تُشتق تلقائياً من أسماء عائلة كل الأقارب المُدخَلين في (٣. الأقارب) — آخر كلمة من
 * اسم كل قريب **وزوج/ة كل قريب أيضاً** (الأصهار جزء تقليدي أصيل من هذه العبارة —
 * تحقّقتُ هذا من نص SAMPLE_OBITUARY_DATA المحفوظ يدوياً أصلاً، يتضمّن عائلات أزواج
 * البنات صراحة)، بلا تكرار لنفس اسم العائلة، مسبوقة بـ"آل" مرة واحدة ومفصولة بفاصلة.
 */
export function defaultFamiliesLine(data: ObituaryData): string {
  const surnames: string[] = []
  const addSurname = (name: string | undefined) => {
    const surname = name ? lastNameOf(name) : ""
    if (surname && !surnames.includes(surname)) surnames.push(surname)
  }
  for (const group of data.relatives) {
    for (const member of group.members) {
      addSurname(member.name)
      addSurname(member.spouseName)
    }
  }
  if (surnames.length === 0) return ""
  return `الراضون بقضاء الله وقدره: آل ${surnames.join("، ")}`
}

/** سطر العائلات — مُشتق تلقائياً من الأقارب افتراضياً، قابل للتخصيص الحرّ عبر customTexts.familiesLine. */
export function familiesLine(data: ObituaryData): string {
  return data.customTexts?.familiesLine ?? defaultFamiliesLine(data)
}

export function processionLine(data: ObituaryData): string | null {
  return data.funeral.processionFrom ? `سيُشيَّع الجثمان من ${data.funeral.processionFrom}` : null
}

/** سطر معلومات الميلاد — يظهر فقط إن فعّله المستخدم صراحةً. */
export function birthInfoLine(data: ObituaryData): string | null {
  const { deceased } = data
  if (!deceased.showBirthInfo) return null
  if (!deceased.birthDateISO && !deceased.birthCountry) return null

  const dateStr = deceased.birthDateISO
    ? formatDualDate(deceased.birthDateISO, {
        hijriOffsetDays: 0,
        order: data.format.dateOrder,
        numerals: data.format.numerals,
        months: data.format.months,
      })
    : ""
  const parts = [
    "من مواليد",
    deceased.birthCountry,
    dateStr && `بتاريخ ${dateStr}`,
  ].filter(Boolean)
  return parts.length > 1 ? parts.join(" ") : null
}

export function defaultPrintFooterText(): string {
  return DEFAULT_PRINT_FOOTER_TEXT
}

/** نص فوتر المطبعة — يظهر فقط إن فعّله المستخدم صراحةً أو اقترحه القالب افتراضياً. */
export function printFooterText(data: ObituaryData, templateSuggestsFooter: boolean): string | null {
  const enabled = data.funeral.printFooterEnabled ?? templateSuggestsFooter
  if (!enabled) return null
  return data.customTexts?.printFooterText ?? defaultPrintFooterText()
}

/**
 * نص رسالة المشاركة (واتساب وغيره) — تُلحَق بصورة النعوة عبر Web Share API
 * (`lib/export/actions.ts`، exportShare). مبنية من نفس محرك القواعد المستعمل في
 * النعوة نفسها (لا نص مكرَّر يدوياً هنا): سطر افتتاحي باسم الفقيد الكامل، ثم فقرة
 * التشييع والصلاة والدفن الكاملة (processionLine + funeralSentence معاً — نفس
 * الجملتين المتلاصقتين بصرياً في الكانفاس، راجع ObituaryBlocks.tsx)، ثم توقيع الموقع.
 */
export function shareMessage(data: ObituaryData): string {
  const name = deceasedNameLine(data.deceased)
  const openingLine = name ? `انتقل إلى رحمته تعالى ${name}` : "انتقل إلى رحمته تعالى"
  const funeralParagraph = [processionLine(data), funeralSentence(data)].filter(Boolean).join(" ")
  return [openingLine, funeralParagraph, DEFAULT_PRINT_FOOTER_TEXT].filter(Boolean).join("\n\n")
}
