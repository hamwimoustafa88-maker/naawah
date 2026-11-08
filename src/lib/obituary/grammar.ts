// محرك التصريف حسب الجنس — قلب المشروع.
// كل كلمة هنا مُستخرجة من مقارنة مباشرة بين المرفقات الخمسة (نعوات حقيقية).

import type { Gender, Person, RelativeCategoryKey } from "./types"

/** كلمات تتصرّف حسب جنس الفقيد نفسه (وليس القريب). */
const GENDER_INVARIANT_WORDS = {
  tahir: "الطاهر",
  ajruh: "الأجر",
  rahmah: "الرحمة",
}

export const DECEASED_WORDS: Record<Gender, Record<string, string>> = {
  male: {
    ...GENDER_INVARIANT_WORDS,
    marhoom: "المرحوم",
    maghfoor: "المغفور له",
    faqeed: "الفقيد",
    jasad: "جثمانه",
    sayusalla: "سيصلى",
    wafatuhu: "وفاته",
    lahu: "له",
  },
  female: {
    ...GENDER_INVARIANT_WORDS,
    marhoom: "المرحومة",
    maghfoor: "المغفور لها",
    faqeed: "الفقيدة",
    jasad: "جثمانها",
    sayusalla: "ستصلى",
    wafatuhu: "وفاتها",
    lahu: "لها",
  },
}

/** جدول تسميات فئات القرابة — يتصرّف حسب جنس الفقيد (مالك القرابة). */
const RELATIVE_LABELS: Record<Exclude<RelativeCategoryKey, "custom">, Record<Gender, string>> = {
  parents: { male: "الوالدين", female: "الوالدين" },
  // "أرامله" لا "زوجاته" — بطلب صريح (الزوج/الفقيد متوفٍّ فعلاً، فزوجاته أصبحن أرامله).
  wives: { male: "أرامله", female: "أرامله" },
  husband: { male: "زوجها", female: "زوجها" },
  sons: { male: "أولاده", female: "أولادها" },
  daughters: { male: "بناته", female: "بناتها" },
  brothers: { male: "أشقاؤه", female: "أشقاؤها" },
  sisters: { male: "شقيقاته", female: "شقيقاتها" },
  grandchildren: { male: "أحفاده", female: "أحفادها" },
  uncles_paternal: { male: "أعمامه", female: "أعمامها" },
  uncles_maternal: { male: "أخواله", female: "أخوالها" },
  aunts_paternal: { male: "عماته", female: "عماتها" },
  aunts_maternal: { male: "خالاته", female: "خالاتها" },
  cousins_paternal: { male: "أبناء أعمامه", female: "أبناء أعمامها" },
  cousins_maternal: { male: "أبناء أخواله", female: "أبناء أخوالها" },
  nephews_brothers: { male: "أبناء أشقائه", female: "أبناء أشقائها" },
  nephews_sisters: { male: "أبناء شقيقاته", female: "أبناء شقيقاتها" },
  inlaws_sons: { male: "أصهاره", female: "أصهارها" },
  inlaws_daughters: { male: "أصهاره لبناته", female: "أصهارها لبناتها" },
  inlaws_sisters: { male: "أزواج شقيقاته", female: "أزواج شقيقاتها" },
}

/**
 * صيغة المفرد لكل فئة قرابة ثابتة الجنس — تظهر بدل صيغة الجمع في `RELATIVE_LABELS`
 * حين تحوي المجموعة عضواً واحداً فقط (مثال: أرملة واحدة ← "أرملته" لا "أرامله").
 * الفئات المختلطة الجنس (grandchildren، cousins_*، nephews_*) لها جدول منفصل أدناه
 * لأن صيغة المفرد فيها تعتمد أيضاً على جنس العضو الوحيد نفسه، لا على جنس الفقيد فقط.
 */
const SINGULAR_LABELS_FIXED: Partial<Record<RelativeCategoryKey, Record<Gender, string>>> = {
  wives: { male: "أرملته", female: "أرملته" },
  sons: { male: "ولده", female: "ولدها" },
  daughters: { male: "ابنته", female: "ابنتها" },
  brothers: { male: "شقيقه", female: "شقيقها" },
  sisters: { male: "شقيقته", female: "شقيقتها" },
  uncles_paternal: { male: "عمه", female: "عمها" },
  uncles_maternal: { male: "خاله", female: "خالها" },
  aunts_paternal: { male: "عمته", female: "عمتها" },
  aunts_maternal: { male: "خالته", female: "خالتها" },
  inlaws_sons: { male: "صهره", female: "صهرها" },
  inlaws_daughters: { male: "صهره لابنته", female: "صهرها لابنتها" },
  inlaws_sisters: { male: "زوج شقيقته", female: "زوج شقيقتها" },
}

/**
 * صيغة المفرد للفئات المختلطة الجنس — مفتاحها الخارجي جنس الفقيد وجنس العضو
 * الوحيد داخلياً (حفيد مقابل حفيدة، ابن عم مقابل ابنة عم…).
 */
const SINGULAR_LABELS_MIXED: Partial<Record<RelativeCategoryKey, Record<Gender, Record<Gender, string>>>> = {
  grandchildren: {
    male: { male: "حفيده", female: "حفيدته" },
    female: { male: "حفيدها", female: "حفيدتها" },
  },
  cousins_paternal: {
    male: { male: "ابن عمه", female: "ابنة عمه" },
    female: { male: "ابن عمها", female: "ابنة عمها" },
  },
  cousins_maternal: {
    male: { male: "ابن خاله", female: "ابنة خاله" },
    female: { male: "ابن خالها", female: "ابنة خالها" },
  },
  nephews_brothers: {
    male: { male: "ابن أخيه", female: "ابنة أخيه" },
    female: { male: "ابن أخيها", female: "ابنة أخيها" },
  },
  nephews_sisters: {
    male: { male: "ابن أخته", female: "ابنة أخته" },
    female: { male: "ابن أختها", female: "ابنة أختها" },
  },
}

/** يعيد صيغة المفرد المطابقة إن وُجدت لهذه الفئة، وإلا `undefined` (تبقى صيغة الجمع). */
function singularRelativeLabel(key: RelativeCategoryKey, deceasedGender: Gender, memberGender: Gender): string | undefined {
  const fixed = SINGULAR_LABELS_FIXED[key]
  if (fixed) return fixed[deceasedGender]
  const mixed = SINGULAR_LABELS_MIXED[key]
  if (mixed) return mixed[deceasedGender][memberGender]
  return undefined
}

/**
 * كلمات بديلة لعبارة "المرحوم" الظاهرة مباشرة فوق اسم الفقيد — قابلة للاختيار من
 * (بيانات الفقيد) عبر deceased.marhoomStyle. "custom" لا يستعمل هذا الجدول إطلاقاً
 * (نص حر من deceased.marhoomCustomText) — راجع marhoomWord في render.ts.
 */
export const MARHOOM_STYLE_WORDS: Record<"marhoom" | "shaheed", Record<Gender, string>> = {
  marhoom: { male: "المرحوم", female: "المرحومة" },
  shaheed: { male: "الشهيد", female: "الشهيدة" },
}

/**
 * تسميتا الأب والأم منفصلتين — تُستعملان خصيصاً لتقسيم فئة "الوالدين" الموحّدة
 * إلى سطرين عند الطباعة (كل والد بسطره الخاص كما في النعوات الحقيقية)، رغم أنها
 * فئة واحدة في المحرر. راجع relativesBlocks في render.ts.
 */
export const PARENT_LABELS: Record<"father" | "mother", Record<Gender, string>> = {
  father: { male: "والده", female: "والدها" },
  mother: { male: "والدته", female: "والدتها" },
}

/**
 * تسمية فئة القرابة — تتحوّل تلقائياً لصيغة المفرد حين تحوي المجموعة عضواً واحداً
 * فقط (مثال: زوجة واحدة ← "زوجته" لا "زوجاته"، ابن واحد ← "ولده" لا "أولاده").
 * `members` اختياري (افتراضياً []) حتى تبقى الاستدعاءات القديمة بلا معلومات أعضاء صالحة.
 */
export function relativeCategoryLabel(
  key: RelativeCategoryKey,
  deceasedGender: Gender,
  members: Person[] = [],
  customLabel?: string
): string {
  if (key === "custom") return customLabel?.trim() || "أقارب"
  if (members.length === 1) {
    const singular = singularRelativeLabel(key, deceasedGender, members[0].gender)
    if (singular) return singular
  }
  return RELATIVE_LABELS[key][deceasedGender]
}

/** مقطع من سطر الأقارب — isName يميّز الأسماء لتنسيقها (عريض/تحته خط) دون الروابط والصفات. */
export interface RelativeTextPart {
  text: string
  isName: boolean
}

/** يركّب اسم قريب واحد: [اللقب] [الاسم] [زوجته/زوجة اللقب الاسم] — بلا علامة "المرحوم" (تُضاف على مستوى المجموعة). */
function personParts(p: Person): RelativeTextPart[] {
  const namePart: RelativeTextPart = { text: p.honorific ? `${p.honorific} ${p.name}` : p.name, isName: true }

  if (!p.spouseName) return [namePart]

  // القاعدة: قريب ذكر ← "زوجته"، قريبة أنثى ← "زوجة" (الزوج يُذكر بعدها)،
  // أو "أرملة" إن اختيرت وكان الزوج متوفى فعلاً — لا تصح "أرملة" لزوج حيّ.
  const femaleConnector = p.spouseIsDeceased && p.widowStyle === "أرملة" ? "أرملة" : "زوجة"
  const connector = p.gender === "male" ? "زوجته" : femaleConnector
  const spouseMarker = p.spouseIsDeceased
    ? p.gender === "male"
      ? "المرحومة"
      : "المرحوم"
    : ""
  const spouseLead = [connector, spouseMarker].filter(Boolean).join(" ")
  const spouseName = [p.spouseHonorific, p.spouseName].filter(Boolean).join(" ")

  return [namePart, { text: ` ${spouseLead} `, isName: false }, { text: spouseName, isName: true }]
}

const partsToText = (parts: RelativeTextPart[]) => parts.map((part) => part.text).join("")

export function renderPersonCore(p: Person): string {
  return partsToText(personParts(p))
}

/**
 * يركّب قائمة أقارب فئة واحدة، وكل اسم متوفى تسبقه "المرحوم/المرحومة" منفردة بجنسه.
 * لا تُدمج الأسماء تحت "المرحومين/المرحومات" — بطلب صريح: الدمج لم يكن يوضح أي
 * الأسماء متوفى وأيها حيّ حين تختلط الحالتان في الفئة نفسها.
 */
export function renderRelativeParts(members: Person[]): RelativeTextPart[] {
  return members.flatMap((p, index) => {
    const parts: RelativeTextPart[] = []
    if (index > 0) parts.push({ text: " و", isName: false })
    if (p.isDeceased) parts.push({ text: p.gender === "male" ? "المرحوم " : "المرحومة ", isName: false })
    return [...parts, ...personParts(p)]
  })
}

export function renderRelativeList(members: Person[]): string {
  return partsToText(renderRelativeParts(members))
}
