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
  wives: { male: "زوجاته", female: "زوجاته" },
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
 * حين تحوي المجموعة عضواً واحداً فقط (مثال: زوجة واحدة ← "زوجته" لا "زوجاته").
 * الفئات المختلطة الجنس (grandchildren، cousins_*، nephews_*) لها جدول منفصل أدناه
 * لأن صيغة المفرد فيها تعتمد أيضاً على جنس العضو الوحيد نفسه، لا على جنس الفقيد فقط.
 */
const SINGULAR_LABELS_FIXED: Partial<Record<RelativeCategoryKey, Record<Gender, string>>> = {
  wives: { male: "زوجته", female: "زوجته" },
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

/** يربط جملاً بحرف الواو الملتصق: ["أ","ب","ج"] → "أ وب وج" */
export function joinWithWaw(parts: string[]): string {
  return parts
    .filter((p) => p && p.trim().length > 0)
    .reduce((acc, cur, idx) => (idx === 0 ? cur : `${acc} و${cur}`), "")
}

/** يركّب اسم قريب واحد: [اللقب] [الاسم] [زوجته/زوجة اللقب الاسم] — بلا علامة "المرحوم" (تُضاف على مستوى المجموعة). */
export function renderPersonCore(p: Person): string {
  const namePart = p.honorific ? `${p.honorific} ${p.name}` : p.name

  if (!p.spouseName) return namePart

  // القاعدة: قريب ذكر ← "زوجته"، قريبة أنثى ← "زوجة" (الزوج يُذكر بعدها).
  const connector = p.gender === "male" ? "زوجته" : "زوجة"
  const spouseMarker = p.spouseIsDeceased
    ? p.gender === "male"
      ? "المرحومة"
      : "المرحوم"
    : ""
  const spouseHonorific = p.spouseHonorific ? p.spouseHonorific : ""
  const spousePart = [connector, spouseMarker, spouseHonorific, p.spouseName]
    .filter(Boolean)
    .join(" ")

  return `${namePart} ${spousePart}`
}

/**
 * يركّب قائمة أقارب فئة واحدة، مع تجميع سلاسل الوفاة المتتالية تحت
 * "المرحومين/المرحومات" مرة واحدة بدل تكرارها لكل اسم.
 * السلسلة تُجمَّع حسب (متوفى + الجنس) معاً — لا حسب الوفاة فقط — لأن فئات مثل
 * الأحفاد أو أبناء الإخوة تخلط الذكور والإناث فعلياً، وخلط جنسين تحت صيغة جمع
 * واحدة (المرحومين/المرحومات) خطأ نحوي.
 */
export function renderRelativeList(members: Person[]): string {
  const tokens: string[] = []
  let i = 0
  while (i < members.length) {
    const p = members[i]
    if (p.isDeceased) {
      let j = i
      while (j < members.length && members[j].isDeceased && members[j].gender === p.gender) j++
      const run = members.slice(i, j)
      if (run.length >= 2) {
        const marker = p.gender === "male" ? "المرحومين" : "المرحومات"
        const namesJoined = joinWithWaw(run.map(renderPersonCore))
        tokens.push(`${marker} ${namesJoined}`)
      } else {
        const marker = p.gender === "male" ? "المرحوم" : "المرحومة"
        tokens.push(`${marker} ${renderPersonCore(run[0])}`)
      }
      i = j
    } else {
      tokens.push(renderPersonCore(p))
      i++
    }
  }
  return joinWithWaw(tokens)
}
