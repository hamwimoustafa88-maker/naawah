// نعوات تجريبية لمعاينة القوالب — لكل قالب حالة مختلفة (قصيرة/كثيفة، بصورة/بدونها)
// حتى يرى الزائر سلوك التصميم فعلياً. كل الأسماء والأماكن هنا مختلقة.

import type { Gender, ObituaryData, Person, RelativeCategoryKey, RelativeGroup } from "@/lib/obituary/types"

const PORTRAIT = "/templates/portrait-placeholder.svg"

type PersonDetails = Partial<Omit<Person, "id" | "name" | "gender">>

function group(categoryKey: RelativeCategoryKey, gender: Gender, members: [string, PersonDetails?][]): RelativeGroup {
  return {
    id: categoryKey,
    categoryKey,
    members: members.map(([name, details], index) => ({ id: `${categoryKey}-${index}`, name, gender, isDeceased: false, ...details })),
  }
}

function parents(father: [string, PersonDetails], mother: [string, PersonDetails]): RelativeGroup {
  const [fatherName, fatherDetails] = father
  const [motherName, motherDetails] = mother
  return {
    id: "parents",
    categoryKey: "parents",
    members: [
      { id: "father", name: fatherName, gender: "male", isDeceased: false, ...fatherDetails },
      { id: "mother", name: motherName, gender: "female", isDeceased: false, ...motherDetails },
    ],
  }
}

const HAJJ_DECEASED: PersonDetails = { honorific: "الحاج", isDeceased: true }
const HAJJA_DECEASED: PersonDetails = { honorific: "الحاجة", isDeceased: true }

function showcase(templateId: string, data: Pick<ObituaryData, "deceased" | "funeral" | "relatives">): ObituaryData {
  return { ...data, templateId, format: { numerals: "arabic-indic", months: "levantine", dateOrder: "hijri-first" } }
}

const BASE_DECEASED = { deathDateISO: "2026-03-24", hijriOffsetDays: 0, country: "لبنان", hasBasmala: false, hasInnaLillah: false }

const SHOWCASES: ObituaryData[] = [
  // متوسطة، بصورة في الوسط
  showcase("gold-classic", {
    deceased: {
      ...BASE_DECEASED, gender: "male", honorific: "الحاج", name: "عبد الرحمن خالد الزين",
      quranVerseId: "fajr-27-30", hasInnaLillah: true, photoDataUrl: PORTRAIT, photoSizeScale: 0.75,
    },
    funeral: {
      prayerLocation: "مسجد النور", prayerTimeNote: "بعد صلاة الظهر", burialLocation: "جبانة البلدة",
      condolencesGeneral: "تُقبل التعازي قبل الدفن وبعده في منزل الفقيد",
    },
    relatives: [
      parents(["خالد الزين", HAJJ_DECEASED], ["آمنة الحلبي", HAJJA_DECEASED]),
      group("wives", "female", [["سعاد ناصر", { honorific: "الحاجة" }]]),
      group("sons", "male", [["سامي", { honorific: "المهندس" }], ["وليد", { honorific: "الدكتور" }]]),
      group("daughters", "female", [["رنا", { spouseName: "طارق المصري" }]]),
    ],
  }),

  // قصيرة جداً، بلا صورة
  showcase("olive-calm", {
    deceased: {
      ...BASE_DECEASED, gender: "female", honorific: "الحاجة", name: "فاطمة سليم الحسن",
      quranVerseId: "kullu-nafs", spouseName: "أحمد يوسف الحسن", widowStyle: "أرملة",
    },
    funeral: { prayerLocation: "مسجد السلام", prayerTimeNote: "بعد صلاة العصر", condolencesGeneral: "تُقبل التعازي في منزل الفقيدة" },
    relatives: [group("sons", "male", [["يوسف"], ["عمر"]]), group("daughters", "female", [["هدى"]])],
  }),

  // كثيفة جداً، بلا صورة
  showcase("modern-minimal", {
    deceased: { ...BASE_DECEASED, gender: "male", honorific: "الأستاذ", name: "إبراهيم حسن المولى", hasBasmala: true },
    funeral: {
      processionFrom: "منزله الكائن في حي الزيتون، بناية الأمل، الطابق الثاني",
      prayerLocation: "مسجد الرحمة", prayerTimeNote: "بعد صلاة الظهر", burialLocation: "جبانة العائلة",
      condolencesShared: true, condolencesMen: "في قاعة مسجد الرحمة بين صلاتي العصر والمغرب",
    },
    relatives: [
      parents(["حسن المولى", HAJJ_DECEASED], ["زينب قاسم", HAJJA_DECEASED]),
      group("wives", "female", [["ليلى منصور", { honorific: "الحاجة" }]]),
      group("sons", "male", [
        ["حسان", { honorific: "المهندس", spouseName: "نور حيدر" }], ["رامي", { honorific: "الدكتور", spouseName: "ريم صالح" }],
        ["باسم", { spouseName: "دانا فارس" }], ["ماهر", { isDeceased: true }],
      ]),
      group("daughters", "female", [
        ["سارة", { spouseName: "علي بدران", spouseHonorific: "الدكتور" }], ["مها", { spouseName: "زياد كريم" }],
        ["نادين", { spouseName: "فادي شمس" }], ["لينا", { spouseName: "هادي سعيد", spouseIsDeceased: true, widowStyle: "أرملة" }],
      ]),
      group("brothers", "male", [["محمود", HAJJ_DECEASED], ["جميل", { honorific: "الحاج" }], ["نبيل"], ["سمير", { isDeceased: true }]]),
      group("sisters", "female", [["وفاء", { honorific: "الحاجة" }], ["ابتسام", HAJJA_DECEASED], ["سهام"], ["منى"]]),
      group("grandchildren", "male", [["حسن"], ["كريم"], ["آدم"], ["زين"], ["يزن"], ["ليث"], ["جاد"], ["تيم"]]),
      group("inlaws_sons", "male", [["علي بدران"], ["زياد كريم"], ["فادي شمس"]]),
    ],
  }),

  // متوسطة، الصورة بجانب النص
  showcase("thuluth-focus", {
    deceased: {
      ...BASE_DECEASED, gender: "male", honorific: "الشيخ", name: "محمد سعيد العطار",
      quranVerseId: "wa-bashir-sabireen-1", photoDataUrl: PORTRAIT, photoSideBySide: true, photoSizeScale: 0.7,
    },
    funeral: {
      processionFrom: "منزله في محلة السوق القديم", prayerLocation: "الجامع الكبير", prayerTimeNote: "بعد صلاة الجمعة",
      burialLocation: "مقبرة البلدة", condolencesGeneral: "تُقبل التعازي في قاعة الجامع الكبير ثلاثة أيام",
    },
    relatives: [
      group("wives", "female", [["خديجة عمران", { honorific: "الحاجة" }]]),
      group("sons", "male", [["أنس", { honorific: "الشيخ" }], ["بلال"], ["معاذ"]]),
      group("daughters", "female", [["مريم", { spouseName: "حمزة النجار" }], ["صفية", { spouseName: "عمار السيد" }]]),
      group("brothers", "male", [["عبد الله", HAJJ_DECEASED], ["مصطفى", { honorific: "الحاج" }]]),
    ],
  }),

  // جهة ناعية، صورة، معلومات ميلاد
  showcase("royal-monogram", {
    deceased: {
      ...BASE_DECEASED, gender: "male", honorific: "الدكتور", name: "نزار فؤاد الأمين",
      quranVerseId: "wa-bashir-sabireen-2", quranVerseScale: 0.7, hasInnaLillah: true, innaLillahScale: 0.8, photoDataUrl: PORTRAIT, photoSizeScale: 0.6,
      showBirthInfo: true, birthCountry: "لبنان", birthDateISO: "1948-06-12",
    },
    funeral: {
      institutionHeader: "تنعى أسرة ثانوية الأمل", prayerLocation: "مسجد الهدى", prayerTimeNote: "بعد صلاة العصر",
      burialLocation: "جبانة العائلة", condolencesGeneral: "تُقبل التعازي في قاعة مسجد الهدى", funeralBoxBold: true,
    },
    relatives: [
      group("wives", "female", [["ناديا الجندي", { honorific: "الدكتورة" }]]),
      group("sons", "male", [["فؤاد", { honorific: "الدكتور", spouseName: "لمى رستم" }], ["كريم", { honorific: "المحامي" }]]),
      group("daughters", "female", [["هلا", { honorific: "المهندسة", spouseName: "ربيع الخوري" }]]),
      group("brothers", "male", [["فريد", HAJJ_DECEASED], ["عدنان", { honorific: "العميد المتقاعد" }]]),
    ],
  }),

  // كثافة متوسطة بطابع الصحف، بلا صورة
  showcase("traditional-press", {
    deceased: { ...BASE_DECEASED, gender: "male", honorific: "الحاج", name: "ياسر توفيق الحداد", quranVerseId: "inna-lillah" },
    funeral: {
      processionFrom: "منزله في شارع المدارس", prayerLocation: "مسجد التقوى", prayerTimeNote: "بعد صلاة الظهر", burialLocation: "جبانة المدينة",
      condolencesMen: "في مسجد التقوى بين صلاتي العصر والمغرب", condolencesWomen: "في منزل الفقيد من الثالثة حتى السادسة مساءً",
    },
    relatives: [
      parents(["توفيق الحداد", HAJJ_DECEASED], ["رقية سلام", HAJJA_DECEASED]),
      group("wives", "female", [["نجوى شعبان", { honorific: "الحاجة" }]]),
      group("sons", "male", [["توفيق", { spouseName: "منال درويش" }], ["جهاد", { spouseName: "عبير ياسين" }], ["رائد"]]),
      group("daughters", "female", [["ميساء", { spouseName: "خليل غانم" }], ["رولا", { spouseName: "نضال عثمان" }]]),
      group("sisters", "female", [["نعمت", { honorific: "الحاجة" }], ["سميرة", HAJJA_DECEASED]]),
    ],
  }),

  // قصيرة، بصورة، صيغة "الشهيد" مكبّرة
  showcase("midnight-elegant", {
    deceased: {
      ...BASE_DECEASED, gender: "male", name: "يوسف عمر الخطيب", marhoomStyle: "shaheed", marhoomEnlarged: true,
      hasBasmala: true, photoDataUrl: PORTRAIT, photoSizeScale: 0.75,
    },
    funeral: { prayerLocation: "مسجد الفتح", prayerTimeNote: "بعد صلاة العصر", condolencesGeneral: "تُقبل التعازي في منزل والده" },
    relatives: [
      parents(["عمر الخطيب", { honorific: "الحاج" }], ["هناء زيدان", { honorific: "الحاجة" }]),
      group("brothers", "male", [["مازن"], ["أيهم"]]),
    ],
  }),
]

export function templateShowcaseData(templateId: string): ObituaryData {
  return SHOWCASES.find((data) => data.templateId === templateId) ?? { ...SHOWCASES[0], templateId }
}
