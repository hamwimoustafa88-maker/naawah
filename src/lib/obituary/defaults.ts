// القيم الافتراضية والقوائم المرجعية — الألقاب، فئات القرابة، الآيات، وبيانات عرض أولية.

import type { Gender, ObituaryData, Person, RelativeCategoryKey, RelativeGroup } from "./types"

/** كل لقب بصيغتيه — يُختار منها حسب جنس الشخص، فلا يظهر لقب مؤنّث لذكر أو العكس. */
export const HONORIFIC_OPTIONS: { male: string; female: string }[] = [
  { male: "الحاج", female: "الحاجة" },
  { male: "المربي", female: "المربية" },
  { male: "المربي الفاضل", female: "المربية الفاضلة" },
  { male: "الداعية", female: "الداعية" },
  { male: "الطبيب", female: "الطبيبة" },
  { male: "الدكتور", female: "الدكتورة" },
  { male: "المحامي", female: "المحامية" },
  { male: "المهندس", female: "المهندسة" },
  { male: "المجاهد", female: "المجاهدة" },
  { male: "المحافظ", female: "المحافظة" },
  { male: "مدير إدارة", female: "مديرة إدارة" },
  { male: "الشهيد", female: "الشهيدة" },
  { male: "الأستاذ", female: "الأستاذة" },
  { male: "الشيخ", female: "الشيخة" },
  { male: "الشيخ العلامة الفقيه المحدث", female: "الشيخة العلامة" },
  { male: "العميد المتقاعد", female: "العميد المتقاعد" },
  { male: "اللواء المتقاعد", female: "اللواء المتقاعد" },
  { male: "الضابط المتقاعد", female: "الضابط المتقاعد" },
  { male: "سعادة الوزير السابق", female: "سعادة الوزيرة السابقة" },
]

/** قائمة الألقاب الظاهرة لجنس واحد فقط — تمنع ظهور "الحاجة" عند اختيار "ذكر" والعكس. */
export function honorificsFor(gender: Gender): string[] {
  return HONORIFIC_OPTIONS.map((h) => (gender === "male" ? h.male : h.female))
}

export const RELATIVE_CATEGORY_OPTIONS: {
  key: RelativeCategoryKey
  labelMale: string
  labelFemale: string
}[] = [
    { key: "parents", labelMale: "الوالدين", labelFemale: "الوالدين" },
    { key: "wives", labelMale: "زوجاته", labelFemale: "زوجاته" },
    { key: "husband", labelMale: "زوجها", labelFemale: "زوجها" },
    { key: "sons", labelMale: "أولاده", labelFemale: "أولادها" },
    { key: "daughters", labelMale: "بناته", labelFemale: "بناتها" },
    { key: "brothers", labelMale: "أشقاؤه", labelFemale: "أشقاؤها" },
    { key: "sisters", labelMale: "شقيقاته", labelFemale: "شقيقاتها" },
    { key: "grandchildren", labelMale: "أحفاده", labelFemale: "أحفادها" },
    { key: "uncles_paternal", labelMale: "أعمامه", labelFemale: "أعمامها" },
    { key: "uncles_maternal", labelMale: "أخواله", labelFemale: "أخوالها" },
    { key: "aunts_paternal", labelMale: "عماته", labelFemale: "عماتها" },
    { key: "aunts_maternal", labelMale: "خالاته", labelFemale: "خالاتها" },
    { key: "cousins_paternal", labelMale: "أبناء أعمامه", labelFemale: "أبناء أعمامها" },
    { key: "cousins_maternal", labelMale: "أبناء أخواله", labelFemale: "أبناء أخوالها" },
    { key: "nephews_brothers", labelMale: "أبناء أشقائه", labelFemale: "أبناء أشقائها" },
    { key: "nephews_sisters", labelMale: "أبناء شقيقاته", labelFemale: "أبناء شقيقاتها" },
    { key: "inlaws_sons", labelMale: "أصهاره", labelFemale: "أصهارها" },
    { key: "inlaws_daughters", labelMale: "أصهاره لبناته", labelFemale: "أصهارها لبناتها" },
    { key: "inlaws_sisters", labelMale: "أزواج شقيقاته", labelFemale: "أزواج شقيقاتها" },
    { key: "custom", labelMale: "فئة مخصّصة", labelFemale: "فئة مخصّصة" },
  ]

/**
 * الجنس الثابت لأعضاء فئة قرابة معيّنة — تمنع ظهور محدِّد الجنس في المحرر حين يكون
 * محسوماً بالفئة نفسها (مثال: عضو في "بناته" هو أنثى دائماً، فلا داعي لسؤال المستخدم).
 * الفئات غير المذكورة هنا (parents، grandchildren، cousins_*، nephews_*) مختلطة فعلياً
 * فتُبقي محدِّد الجنس ظاهراً.
 */
export const FIXED_GENDER_BY_CATEGORY: Partial<Record<RelativeCategoryKey, Gender>> = {
  wives: "female",
  husband: "male",
  sons: "male",
  daughters: "female",
  brothers: "male",
  sisters: "female",
  uncles_paternal: "male",
  uncles_maternal: "male",
  aunts_paternal: "female",
  aunts_maternal: "female",
  inlaws_sons: "male",
  inlaws_daughters: "male",
  inlaws_sisters: "male",
}

/**
 * بعض فئات القرابة صالحة لجنس فقيد واحد فقط — "زوجاته" لا معنى لها إلا لفقيد ذكر
 * (تعدّد الزوجات)، و"زوجها" لا معنى له إلا لفقيدة أنثى. تُستبعد من قائمة "إضافة
 * فئة قرابة" حين لا تنطبق على جنس الفقيد الحالي (كان عطلاً حقيقياً: "زوجها" تظهر
 * كخيار متاح حتى لفقيد ذكر). لا علاقة لهذا بـ FIXED_GENDER_BY_CATEGORY أعلاه —
 * ذاك يخصّ جنس *أعضاء* الفئة، وهذا يخصّ جنس *الفقيد* نفسه.
 */
export const CATEGORY_REQUIRES_DECEASED_GENDER: Partial<Record<RelativeCategoryKey, Gender>> = {
  wives: "male",
  husband: "female",
}

export interface QuranVerse {
  id: string
  label: string
  lines: string[]
  /** نص قرآني حرفي (تُعرض تحته "صدق الله العظيم")، أو عبارة مأثورة غير قرآنية حرفياً. */
  isQuran: boolean
  /** اسم ملف SVG اليدوي المطابق داخل public/calligraphy/handmade/ (بلا الامتداد)، إن وُجد. */
  handmadeFile?: string
  /** عرض العرض المستهدف بالبكسل (عند 96dpi) — إن غاب يُستعمل CALLIGRAPHY_DEFAULT_WIDTH_PX. */
  targetWidthPx?: number
  /**
   * حجم خط النص الحيّ بوحدة em — لا يُستعمل إلا في حال غياب ملف SVG يدوي (نص حيّ
   * فقط). widthPx لا يتحكم بحجم النص الحيّ فعلياً (يقيّد عرض اللف فقط)، فهذا الحقل
   * ضروري لتكبير آية "نفس مطمئنة" (الوحيدة بلا مخطوطة يدوية) دون التأثير على غيرها.
   */
  liveTextFontSizeEm?: number
}

/** ١سم ≈ ٣٧.٨px عند 96dpi (٧٩٤px = ٢١سم عرض صفحة A4). */
const CM_TO_PX = 794 / 21

/** العرض الافتراضي لمعظم المخطوطات: ~١٥سم. */
export const CALLIGRAPHY_DEFAULT_WIDTH_PX = Math.round(15 * CM_TO_PX)
/** البسملة: ~٦سم (كانت ٧.٥سم، صُغِّرت ٢٠٪ بطلب صريح). */
export const BASMALA_WIDTH_PX = Math.round(6 * CM_TO_PX)
/** آية الفجر (٢٧-٣٠) عريضة/عرضية بطبيعتها — تبقى بحجمها الطبيعي الأكبر: ~١٨سم. */
const FAJR_WIDTH_PX = Math.round(18 * CM_TO_PX)
/**
 * علامة الختام الثابتة أسفل الصفحة («إنّا لله وإنّا إليه راجعون» عبر hasInnaLillah)
 * — أصغر بكثير من نفس الآية حين تُختار كمخطوطة رئيسية أعلى الصفحة (quranVerseId):
 * ~٤.٥سم (مُصغَّرة ٧٠٪ عن ١٥سم الافتراضي). عمداً ثابت منفصل عن targetWidthPx في
 * QURAN_VERSES — تغيير ذاك كان سيُصغّر نفس الآية أيضاً حين تُختار كمخطوطة رئيسية.
 */
export const INNA_LILLAH_FOOTER_WIDTH_PX = Math.round(4.5 * CM_TO_PX)

/** كل نص هنا موثوق حرفياً — يُعرض حيّاً بخط عربي حقيقي، لا يُولَّد بمسارات أو صور. */
export const QURAN_VERSES: QuranVerse[] = [
  {
    id: "inna-lillah",
    label: "إنّا لله وإنّا إليه راجعون",
    lines: ["إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ"],
    isQuran: true,
    handmadeFile: "1",
  },
  {
    id: "wa-bashir-sabireen-1",
    label: "وبشّر الصابرين (الرسم الأول)",
    lines: [
      "وَبَشِّرِ الصَّابِرِينَ ۝",
      "الَّذِينَ إِذَا أَصَابَتْهُمْ مُصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
    ],
    isQuran: true,
    handmadeFile: "2",
  },
  {
    id: "fajr-27-30",
    label: "يا أيتها النفس المطمئنة (الفجر ٢٧-٣٠)",
    lines: [
      "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ",
      "ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً",
      "فَادْخُلِي فِي عِبَادِي وَادْخُلِي جَنَّتِي",
    ],
    isQuran: true,
    handmadeFile: "3",
    targetWidthPx: FAJR_WIDTH_PX,
  },
  {
    id: "kullu-nafs",
    label: "كل نفس ذائقة الموت",
    lines: ["كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ"],
    isQuran: true,
    handmadeFile: "5",
  },
  {
    id: "wa-bashir-sabireen-2",
    label: "وبشّر الصابرين (الرسم الثاني)",
    lines: [
      "وَبَشِّرِ الصَّابِرِينَ ۝",
      "الَّذِينَ إِذَا أَصَابَتْهُمْ مُصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
    ],
    isQuran: true,
    handmadeFile: "6",
  },
  {
    id: "nafs-mutmainna",
    label: "نفس مطمئنة إنتقلت إلى دار البقاء",
    lines: ["نَفْسٌ مُطْمَئِنَّةٌ", "إِنْتَقَلَتْ مِنْ دَارِ الْفَنَاءِ إِلَى دَارِ الْبَقَاءِ"],
    isQuran: false,
    // الوحيدة بلا مخطوطة يدوية (نص حيّ دائماً) — لذا تظهر بحجم النص العادي بلا هذا
    // الحقل؛ كُبِّرت ١٥٠٪ (١em ← ٢.٥em) بطلب صريح لتضاهي حضور المخطوطات المرسومة.
    liveTextFontSizeEm: 2.5,
  },
]

export const BASMALA = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"

export const MOURNING_OPENINGS = [
  "بمزيد من الرضا والتسليم بقضاء الله وقدره ننعي إليكم وفاة",
  "بمزيد من الرضا والتسليم بمشيئة الله تعالى ننعي إليكم وفاة فقيدتنا الغالية",
  "بمزيد من الرضا والتسليم ننعي إليكم وفاة",
]

export const DEFAULT_PRINT_FOOTER_TEXT =
  "النعوة الإلكترونية — مشروع خيري مجاني لجميع المسلمين — enaawah.scouthub.dev"

export const ARAB_COUNTRIES = [
  "لبنان", "سوريا", "الأردن", "فلسطين", "مصر", "العراق",
  "السعودية", "الإمارات", "الكويت", "قطر", "البحرين", "عمان",
  "اليمن", "المغرب", "الجزائر", "تونس", "ليبيا", "السودان",
]

/** تاريخ اليوم بصيغة ISO (YYYY-MM-DD) محلياً — يُستعمل كقيمة افتراضية لتاريخ الوفاة/الدفن. */
export function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function createEmptyPerson(gender: Gender = "male"): Person {
  return {
    id: crypto.randomUUID(),
    name: "",
    isDeceased: false,
    gender,
  }
}

export function createEmptyRelativeGroup(categoryKey: RelativeCategoryKey): RelativeGroup {
  return {
    id: crypto.randomUUID(),
    categoryKey,
    // فئة "الوالدين" حالة خاصة: تُنشأ بعضوين جاهزين (أب/أم) دائماً — فئات القرابة
    // ذات الجنس الثابت (بناته، أولاده...) تُملأ عبر addRelativeGroup في المتجر بدلاً
    // من هنا، لأنها تحتاج قراءة FIXED_GENDER_BY_CATEGORY.
    members:
      categoryKey === "parents"
        ? [createEmptyPerson("male"), createEmptyPerson("female")]
        : [],
  }
}

/** بيانات عرض أولية — إعادة بناء تقريبية لبنية المرفق الأول (الحاج محمود شهاب) لتغذية الكانفاس أثناء التطوير. */
export const SAMPLE_OBITUARY_DATA: ObituaryData = {
  deceased: {
    gender: "male",
    name: "محمود محمد شهاب",
    honorific: "الحاج",
    deathDateISO: "2026-03-24",
    hijriOffsetDays: 0,
    country: "لبنان",
    quranVerseId: "nafs-mutmainna",
    hasBasmala: false,
    hasInnaLillah: false,
  },
  funeral: {
    processionFrom: "منزله الكائن في محلة رأس بيروت، الروشة، شارع رفيق أرسلان، بناية شهاب، الطابق الأول",
    prayerLocation: "مسجد الشهداء",
    prayerTimeNote: "عصر يوم الثلاثاء",
    burialLocation: "جبانة الثرى",
    condolencesGeneral: "تُقبل التعازي في (إسم المكان) قبل الدفن وبعده في منزل الفقيد",
    condolencesMen: "في مسجد الحمراء، قاعة المرحوم الحاج عبد اللطيف عيتاني، بين صلاتي العصر والمغرب",
    condolencesWomen: "في مسجد الحمراء، قاعة المرحوم الحاج عبد اللطيف عيتاني، بين صلاتي العصر والمغرب",
  },
  relatives: [
    {
      id: "parents",
      categoryKey: "parents",
      members: [
        { id: "father", name: "محمد شهاب", honorific: "الحاج", isDeceased: true, gender: "male" },
        { id: "mother", name: "خديجة عيتاني", honorific: "الحاجة", isDeceased: true, gender: "female" },
      ],
    },
    {
      id: "wives",
      categoryKey: "wives",
      members: [
        { id: "w1", name: "سميرة زكريا نعوس", honorific: "الحاجة", isDeceased: true, gender: "female" },
        { id: "w2", name: "ناريمان دعبول", honorific: "الحاجة", isDeceased: false, gender: "female" },
      ],
    },
    {
      id: "sons",
      categoryKey: "sons",
      members: [
        { id: "s1", name: "كمال", isDeceased: false, gender: "male", spouseName: "رلى دوغان", spouseHonorific: "الحاجة" },
        { id: "s2", name: "محمد", isDeceased: false, gender: "male", spouseName: "حليمة الزعبي", spouseHonorific: "" },
      ],
    },
    {
      id: "daughters",
      categoryKey: "daughters",
      members: [
        { id: "d1", name: "هنا", isDeceased: false, gender: "female", spouseName: "توفيق شهاب", spouseHonorific: "الحاج" },
        { id: "d2", name: "ندى", isDeceased: false, gender: "female", spouseName: "فؤاد نجار", spouseHonorific: "الحاج" },
        { id: "d3", name: "نهاد", isDeceased: false, gender: "female", spouseName: "عبد الرحمن عيتاني", spouseHonorific: "الحاج" },
        { id: "d4", name: "رجاء", isDeceased: false, gender: "female", spouseName: "فوزي فاخوري", spouseHonorific: "الحاج" },
        { id: "d5", name: "زينه", isDeceased: false, gender: "female", spouseName: "سليم حمندي", spouseHonorific: "الحاج" },
        { id: "d6", name: "حورية", isDeceased: false, gender: "female", spouseName: "زياد عيتاني", spouseHonorific: "الحاج" },
      ],
    },
    {
      id: "brothers",
      categoryKey: "brothers",
      members: [
        { id: "b1", name: "ابراهيم", honorific: "الحاج", isDeceased: false, gender: "male" },
        { id: "b2", name: "أحمد", honorific: "الحاج", isDeceased: true, gender: "male" },
        { id: "b3", name: "عبدالله", honorific: "الحاج", isDeceased: true, gender: "male" },
      ],
    },
    {
      id: "sisters",
      categoryKey: "sisters",
      members: [
        { id: "si1", name: "يسر", honorific: "الحاجة", isDeceased: false, gender: "female" },
        { id: "si2", name: "سعاد", honorific: "الحاجة", isDeceased: true, gender: "female" },
        { id: "si3", name: "خانم", honorific: "الحاجة", isDeceased: true, gender: "female" },
        { id: "si4", name: "نجاح", honorific: "الحاجة", isDeceased: false, gender: "female" },
        { id: "si5", name: "هدى", honorific: "الحاجة", isDeceased: false, gender: "female" },
      ],
    },
  ],
  format: {
    numerals: "arabic-indic",
    months: "levantine",
    dateOrder: "hijri-first",
  },
  templateId: "royal-monogram",
  // مثبَّت يدوياً (لا مُشتَقاً تلقائياً من الأقارب أعلاه) للحفاظ على مطابقة هذه
  // البيانات التجريبية حرفياً للمرفق المرجعي الأصلي (بعض هذه العائلات — حكيم،
  // طبارة — لا تقابل قريباً بعينه في القائمة أعلاه، بل معارف/أصهار غير مُفصَّلين).
  customTexts: {
    familiesLine: "الراضون بقضاء الله وقدره: آل شهاب وحكيم ودعبول ونعوس وعيتاني ونجار وفاخوري وحمندي والزعبي وطبارة",
  },
}
