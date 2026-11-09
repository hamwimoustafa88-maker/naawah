// اختبارات تحقّق ضد نصوص حقيقية من المرفقات الخمسة — لا يجوز كسرها بلا مراجعة الصورة الأصلية.

import { describe, expect, it } from "vitest"
import { relativeCategoryLabel, renderPersonCore, renderRelativeList, renderRelativeParts } from "./grammar"
import { guideFieldValues } from "./guideFill"
import { calculateAge, formatDualDate, formatWeekdayName, toNumerals } from "./hijri"
import {
  closingDua, deceasedNameLine, defaultFamiliesLine, familiesLine, funeralSentence, identityLine, marhoomWord, mourningLine, relativesBlocks, shareMessage,
} from "./render"
import { parseBulkNames } from "./bulkNames"
import { exportIssues } from "./exportChecks"
import { SAMPLE_OBITUARY_DATA } from "./defaults"
import type { ObituaryData, Person } from "./types"

describe("guideFieldValues — تعبئة صيغ الأدلّة من نعوة محفوظة", () => {
  const data: ObituaryData = {
    deceased: {
      gender: "male", honorific: "الحاج", name: "محمد علاء الدين", deathDateISO: "2026-03-24", birthDateISO: "1950-01-10",
      hijriOffsetDays: 0, country: "لبنان", hasBasmala: false, hasInnaLillah: false,
    },
    funeral: { prayerLocation: "مسجد النور", prayerTimeNote: "بعد صلاة الظهر", burialLocation: "جبانة البلدة" },
    format: { numerals: "western", months: "levantine", dateOrder: "hijri-first" },
    templateId: "modern-minimal",
    relatives: [
      { id: "s", categoryKey: "sons", members: [
        { id: "1", name: "سامي", isDeceased: false, gender: "male" },
        { id: "2", name: "وليد", isDeceased: true, gender: "male" },
      ] },
    ],
  }

  it("يبني القيم من بيانات النعوة", () => {
    const values = guideFieldValues(data)
    expect(values.fullName).toBe("الحاج محمد علاء الدين")
    expect(values.age).toBe("76")
    expect(values.mosque).toBe("مسجد النور")
    expect(values.relatives).toBe("أولاده: سامي والمرحوم وليد، وعموم آل علاء الدين وأصهارهم.")
    expect(values.timeAndPlace).toBe("بعد صلاة الظهر يوم الثلاثاء في مسجد النور")
  })

  it("الحقول غير المُدخلة تبقى فارغة ليظهر قالبها الأصلي", () => {
    const empty: ObituaryData = {
      ...data,
      deceased: { ...data.deceased, name: "", honorific: undefined, birthDateISO: undefined, deathDateISO: "" },
      funeral: { prayerLocation: "" },
      relatives: [],
    }
    const values = guideFieldValues(empty)
    expect(values.fullName).toBe("")
    expect(values.age).toBe("")
    expect(values.deathDate).toBe("")
    expect(values.relatives).toBeUndefined()
    expect(values.timeAndPlace).toBe("")
  })
})

describe("renderRelativeParts — تمييز الأسماء عن الصفات والروابط", () => {
  it("الأسماء فقط isName، ولا تدخل فيها (المرحوم) و(زوجته) وحرف الواو", () => {
    const members: Person[] = [
      { id: "1", name: "كمال", isDeceased: false, gender: "male" },
      { id: "2", name: "أحمد", honorific: "الحاج", isDeceased: true, gender: "male", spouseName: "رلى دوغان", spouseHonorific: "الحاجة" },
    ]
    expect(renderRelativeParts(members).filter((p) => p.isName).map((p) => p.text)).toEqual([
      "كمال", "الحاج أحمد", "الحاجة رلى دوغان",
    ])
    expect(renderRelativeList(members)).toBe("كمال والمرحوم الحاج أحمد زوجته الحاجة رلى دوغان")
  })
})

describe("renderPersonCore — القاعدة ٦: صيغة الزوج تتصرّف حسب جنس القريب", () => {
  it("قريب ذكر ← زوجته + اسم الزوجة (المرفق ١: كمال)", () => {
    const p: Person = {
      id: "1", name: "كمال", isDeceased: false, gender: "male",
      spouseName: "رلى دوغان", spouseHonorific: "الحاجة",
    }
    expect(renderPersonCore(p)).toBe("كمال زوجته الحاجة رلى دوغان")
  })

  it("قريبة أنثى ← زوجة + اسم الزوج (المرفق ١: هنا)", () => {
    const p: Person = {
      id: "2", name: "هنا", isDeceased: false, gender: "female",
      spouseName: "توفيق شهاب", spouseHonorific: "الحاج",
    }
    expect(renderPersonCore(p)).toBe("هنا زوجة الحاج توفيق شهاب")
  })

  const hana: Person = {
    id: "2", name: "هنا", isDeceased: false, gender: "female",
    spouseName: "توفيق شهاب", spouseHonorific: "الحاج",
  }

  it("قريبة توفي زوجها بلا اختيار ← زوجة المرحوم (الافتراضي)", () => {
    expect(renderPersonCore({ ...hana, spouseIsDeceased: true })).toBe("هنا زوجة المرحوم الحاج توفيق شهاب")
  })

  it("قريبة توفي زوجها واختيرت (أرملة) ← أرملة المرحوم", () => {
    expect(renderPersonCore({ ...hana, spouseIsDeceased: true, widowStyle: "أرملة" })).toBe(
      "هنا أرملة المرحوم الحاج توفيق شهاب"
    )
  })

  it("(أرملة) محفوظة لكن الزوج غير متوفى ← تبقى زوجة", () => {
    expect(renderPersonCore({ ...hana, spouseIsDeceased: false, widowStyle: "أرملة" })).toBe(
      "هنا زوجة الحاج توفيق شهاب"
    )
  })

  it("بلا زوج/ة: الاسم فقط مع اللقب", () => {
    const p: Person = { id: "3", name: "ابراهيم", honorific: "الحاج", isDeceased: false, gender: "male" }
    expect(renderPersonCore(p)).toBe("الحاج ابراهيم")
  })
})

describe("renderRelativeList — كل متوفى تسبقه (المرحوم/المرحومة) منفردة", () => {
  it("سلسلة ذكور متوفين ← (المرحوم) قبل كل اسم، بلا (المرحومين)", () => {
    const members: Person[] = [
      { id: "b1", name: "ابراهيم", honorific: "الحاج", isDeceased: false, gender: "male" },
      { id: "b2", name: "أحمد", honorific: "الحاج", isDeceased: true, gender: "male" },
      { id: "b3", name: "عبدالله", honorific: "الحاج", isDeceased: true, gender: "male" },
    ]
    expect(renderRelativeList(members)).toBe(
      "الحاج ابراهيم والمرحوم الحاج أحمد والمرحوم الحاج عبدالله"
    )
  })

  it("سلسلة إناث متوفيات ← (المرحومة) قبل كل اسم، بلا (المرحومات)", () => {
    const members: Person[] = [
      { id: "s1", name: "سعاد", honorific: "الحاجة", isDeceased: true, gender: "female" },
      { id: "s2", name: "خانم", honorific: "الحاجة", isDeceased: true, gender: "female" },
    ]
    expect(renderRelativeList(members)).toBe("المرحومة الحاجة سعاد والمرحومة الحاجة خانم")
  })

  it("مفرد متوفى واحد ← (المرحوم) قبل الاسم مباشرة، بلا صيغة جمع", () => {
    const members: Person[] = [
      { id: "w1", name: "سميرة زكريا نعوس", honorific: "الحاجة", isDeceased: true, gender: "female" },
      { id: "w2", name: "ناريمان دعبول", honorific: "الحاجة", isDeceased: false, gender: "female" },
    ]
    expect(renderRelativeList(members)).toBe(
      "المرحومة الحاجة سميرة زكريا نعوس والحاجة ناريمان دعبول"
    )
  })

  it("متوفيات تتبعهن حيّة ← الحيّة بلا (المرحومة) وبلا فاصلة", () => {
    const members: Person[] = [
      { id: "w1", name: "سارة غسان سنجر", isDeceased: true, gender: "female" },
      { id: "w2", name: "جنى سعيدون", isDeceased: true, gender: "female" },
      { id: "w3", name: "كاملة البزري", isDeceased: false, gender: "female" },
    ]
    expect(renderRelativeList(members)).toBe(
      "المرحومة سارة غسان سنجر والمرحومة جنى سعيدون وكاملة البزري"
    )
  })

  it("فئة مختلطة الجنس ← كل متوفى بصيغة جنسه هو", () => {
    const members: Person[] = [
      { id: "g1", name: "علي", isDeceased: true, gender: "male" },
      { id: "g2", name: "ليلى", isDeceased: true, gender: "female" },
    ]
    expect(renderRelativeList(members)).toBe("المرحوم علي والمرحومة ليلى")
  })
})

describe("marhoomWord — عبارة الترحّم فوق اسم الفقيد", () => {
  const deceased = SAMPLE_OBITUARY_DATA.deceased

  it("الافتراضي ← المرحوم/ة بجنس الفقيد", () => {
    expect(marhoomWord({ ...deceased, gender: "female", marhoomStyle: undefined })).toBe("المرحومة")
  })

  it("(none) ← نص فارغ، حتى مع نص مخصّص محفوظ", () => {
    expect(marhoomWord({ ...deceased, marhoomStyle: "none", marhoomCustomText: "الفقيد الغالي" })).toBe("")
  })
})

describe("relativeCategoryLabel — يتصرّف حسب جنس الفقيد", () => {
  it("sons لفقيد ذكر ← أولاده", () => {
    expect(relativeCategoryLabel("sons", "male")).toBe("أولاده")
  })
  it("sons لفقيدة أنثى ← أولادها", () => {
    expect(relativeCategoryLabel("sons", "female")).toBe("أولادها")
  })
})

describe("relativeCategoryLabel — صيغة المفرد عند عضو واحد فقط", () => {
  const male = (id: string): Person => ({ id, name: "-", isDeceased: false, gender: "male" })
  const female = (id: string): Person => ({ id, name: "-", isDeceased: false, gender: "female" })

  it("أرملة واحدة ← أرملته لا أرامله", () => {
    expect(relativeCategoryLabel("wives", "male", [female("w1")])).toBe("أرملته")
  })
  it("أرملتان ← تبقى أرامله (صيغة الجمع)", () => {
    expect(relativeCategoryLabel("wives", "male", [female("w1"), female("w2")])).toBe("أرامله")
  })
  it("ابن واحد ← ولده لا أولاده", () => {
    expect(relativeCategoryLabel("sons", "male", [male("s1")])).toBe("ولده")
  })
  it("ابنة واحدة لفقيدة أنثى ← ابنتها لا بناتها", () => {
    expect(relativeCategoryLabel("daughters", "female", [female("d1")])).toBe("ابنتها")
  })
  it("فئة مختلطة الجنس (أحفاد): حفيد ذكر واحد ← حفيده", () => {
    expect(relativeCategoryLabel("grandchildren", "male", [male("g1")])).toBe("حفيده")
  })
  it("فئة مختلطة الجنس (أحفاد): حفيدة أنثى واحدة ← حفيدته", () => {
    expect(relativeCategoryLabel("grandchildren", "male", [female("g1")])).toBe("حفيدته")
  })
  it("بلا معلومات أعضاء (استدعاء قديم بلا members) ← تبقى صيغة الجمع", () => {
    expect(relativeCategoryLabel("sons", "male")).toBe("أولاده")
  })
})

describe("identityLine — القاعدة: زوجة/أرملة تتغيّر حسب البيانات", () => {
  it("أنثى بزوج متوفٍّ، أسلوب 'زوجة' (المرفق ٢)", () => {
    const line = identityLine({
      gender: "female", name: "سعاد محمد معروف المصري",
      deathDateISO: "2026-06-02", hijriOffsetDays: 0, country: "لبنان",
      hasBasmala: false, hasInnaLillah: false,
      spouseName: "يحيى زكريا عيتاني", spouseHonorific: "الحاج", spouseIsDeceased: true,
      widowStyle: "زوجة",
    })
    expect(line).toBe("زوجة المرحوم الحاج يحيى زكريا عيتاني")
  })

  it("لا يكرّر 'المرحوم' إن كتبه المستخدم مسبقاً داخل حقل لقب الزوج", () => {
    const line = identityLine({
      gender: "female", name: "فلانة",
      deathDateISO: "2026-06-02", hijriOffsetDays: 0, country: "لبنان",
      hasBasmala: false, hasInnaLillah: false,
      spouseName: "يحيى زكريا عيتاني", spouseHonorific: "المرحوم", spouseIsDeceased: true,
      widowStyle: "زوجة",
    })
    expect(line).toBe("زوجة المرحوم يحيى زكريا عيتاني")
  })

  it("أسلوب 'حرم المغفور له' لا يُضيف 'المرحوم' بعده — العبارة نفسها تحمل معنى الوفاة", () => {
    const line = identityLine({
      gender: "female", name: "فلانة",
      deathDateISO: "2026-06-02", hijriOffsetDays: 0, country: "لبنان",
      hasBasmala: false, hasInnaLillah: false,
      spouseName: "يحيى زكريا عيتاني", spouseHonorific: "الحاج", spouseIsDeceased: true,
      widowStyle: "حرم المغفور له",
    })
    expect(line).toBe("حرم المغفور له الحاج يحيى زكريا عيتاني")
  })

  it("أنثى بزوج متوفٍّ، أسلوب 'أرملة' (المرفق ٣)", () => {
    const line = identityLine({
      gender: "female", name: "وفاء عبد الرحمن عيتاني",
      deathDateISO: "2026-03-19", hijriOffsetDays: 0, country: "لبنان",
      hasBasmala: false, hasInnaLillah: false,
      spouseName: "عبد الكريم عيتاني", spouseIsDeceased: true, widowStyle: "أرملة",
    })
    expect(line).toContain("أرملة")
    expect(line).toContain("عبد الكريم عيتاني")
  })

  it("'أرملة' تفرض 'المرحوم' في الناتج حتى لو spouseIsDeceased غير مُحدَّدة — الخانة نفسها مخفيّة عن المستخدم لهذا الأسلوب", () => {
    const line = identityLine({
      gender: "female", name: "وفاء عبد الرحمن عيتاني",
      deathDateISO: "2026-03-19", hijriOffsetDays: 0, country: "لبنان",
      hasBasmala: false, hasInnaLillah: false,
      spouseName: "عبد الكريم عيتاني", widowStyle: "أرملة",
      // spouseIsDeceased غائبة عمداً — القيمة الافتراضية عند تبديل الأسلوب من "زوجة"
    })
    expect(line).toBe("أرملة المرحوم عبد الكريم عيتاني")
  })

  it("ذكر توفي في الخارج، بلا تفعيل إظهار تاريخ/مكان الوفاة ← لا يُطبع شيء (عطل حقيقي سابق: كان المكان يُطبع دائماً بلا تحكّم)", () => {
    const line = identityLine({
      gender: "male", name: "عثمان عزالدين عيتاني",
      deathDateISO: "2026-07-14", hijriOffsetDays: 0, country: "لبنان",
      hasBasmala: false, hasInnaLillah: false, deathPlaceNote: "كاليفورنيا",
    })
    expect(line).toBeNull()
  })

  it("ذكر توفي في الخارج (المرفق ٥)، بعد تفعيل showDeathInfo ← المكان والتاريخ معاً", () => {
    const line = identityLine({
      gender: "male", name: "عثمان عزالدين عيتاني",
      deathDateISO: "2026-07-14", hijriOffsetDays: 0, country: "لبنان",
      hasBasmala: false, hasInnaLillah: false, deathPlaceNote: "كاليفورنيا",
      showDeathInfo: true,
    })
    expect(line).toContain("المتوفى في كاليفورنيا")
    expect(line).toContain("بتاريخ")
  })

  it("عازبة: لا يُطبع سطر الزوج حتى لو بقي اسمه مخزَّناً من قبل تفعيل الخيار", () => {
    const line = identityLine({
      gender: "female", name: "فلانة", deathDateISO: "2026-07-14", hijriOffsetDays: 0, country: "لبنان",
      hasBasmala: false, hasInnaLillah: false, spouseName: "كمال قباني", spouseIsDeceased: true, isSingle: true,
    })
    expect(line).toBeNull()
  })
})

describe("visibleRelativeGroups — الفئات المرتبطة بجنس الفقيد", () => {
  const withGroup = (gender: ObituaryData["deceased"]["gender"]): ObituaryData => ({
    deceased: { gender, name: "فلان", deathDateISO: "", hijriOffsetDays: 0, country: "لبنان", hasBasmala: false, hasInnaLillah: false },
    funeral: { prayerLocation: "" },
    format: { numerals: "arabic-indic", months: "levantine", dateOrder: "hijri-first" },
    templateId: "modern-minimal",
    relatives: [{ id: "w", categoryKey: "wives", members: [{ id: "m", name: "سعاد كرم", isDeceased: false, gender: "female" }] }],
  })

  it("لا تُطبع 'أرملته' لفقيدة أنثى", () => {
    expect(relativesBlocks(withGroup("female"))).toEqual([])
  })

  it("تبقى الفئة مطبوعة لفقيد ذكر", () => {
    expect(relativesBlocks(withGroup("male")).map((b) => b.label)).toEqual(["أرملته"])
  })
})

describe("shareMessage", () => {
  it("يفصل جملة التشييع عن جملة الصلاة بنقطة", () => {
    const message = shareMessage({
      deceased: { gender: "male", name: "فلان", deathDateISO: "", hijriOffsetDays: 0, country: "لبنان", hasBasmala: false, hasInnaLillah: false },
      funeral: { prayerLocation: "", processionFrom: "منزله" },
      format: { numerals: "arabic-indic", months: "levantine", dateOrder: "hijri-first" },
      templateId: "modern-minimal",
      relatives: [],
    })
    expect(message).toContain("سيُشيَّع الجثمان من منزله. سيصلى")
  })
})

describe("parseBulkNames — لصق عدة أسماء دفعة واحدة", () => {
  it("يفصل بالأسطر والفواصل و' و ' بلا كسر الأسماء التي تبدأ بالواو", () => {
    expect(parseBulkNames("خالد\nوليد، وسام و عمر").map((e) => e.name)).toEqual(["خالد", "وليد", "وسام", "عمر"])
  })

  it("يزيل ترقيم القوائم ويلتقط المرحوم/المرحومة كمتوفى", () => {
    expect(parseBulkNames("١- خالد\n2. والمرحوم عمر شهاب\n• المرحومة هالة")).toEqual([
      { name: "خالد", isDeceased: false },
      { name: "عمر شهاب", isDeceased: true },
      { name: "هالة", isDeceased: true },
    ])
  })

  it("يتجاهل الأسطر الفارغة", () => {
    expect(parseBulkNames(" \n،،\n")).toEqual([])
  })
})

describe("exportIssues — التحقق قبل التصدير", () => {
  const base: ObituaryData = {
    deceased: { gender: "male", name: "فلان", deathDateISO: "2026-01-01", hijriOffsetDays: 0, country: "لبنان", hasBasmala: false, hasInnaLillah: false },
    funeral: { prayerLocation: "مسجد" },
    format: { numerals: "arabic-indic", months: "levantine", dateOrder: "hijri-first" },
    templateId: "modern-minimal",
    relatives: [],
  }

  it("نعوة مكتملة بلا تنبيهات", () => {
    expect(exportIssues(base, "ok")).toEqual([])
  })

  it("ينبّه لغياب الاسم ومكان الصلاة والتاريخ والفيض", () => {
    const empty = { ...base, deceased: { ...base.deceased, name: " ", deathDateISO: "" }, funeral: { prayerLocation: "" } }
    expect(exportIssues(empty, "overflow")).toHaveLength(4)
  })
})

describe("mourningLine و deceasedNameLine و closingDua — تصريف حسب جنس الفقيد", () => {
  it("ذكر — جملة النعي وسطر الترحّم مدمجان في سطر واحد", () => {
    expect(mourningLine(SAMPLE_OBITUARY_DATA)).toBe(
      "بمزيد من الرضا والتسليم بقضاء الله وقدره ننعي إليكم وفاة المغفور له بإذن الله"
    )
    expect(deceasedNameLine(SAMPLE_OBITUARY_DATA.deceased)).toBe("الحاج محمود محمد شهاب")
  })

  it("closingDua للفقيد (ذكر)", () => {
    expect(closingDua(SAMPLE_OBITUARY_DATA)).toBe("للفقيد الرحمة ولكم الأجر والثواب")
  })

  it("closingDua للفقيدة (أنثى)", () => {
    const data = { ...SAMPLE_OBITUARY_DATA, deceased: { ...SAMPLE_OBITUARY_DATA.deceased, gender: "female" as const } }
    expect(closingDua(data)).toBe("للفقيدة الرحمة ولكم الأجر والثواب")
  })
})

describe("familiesLine", () => {
  it("يبدأ بصيغة الرضا الثابتة", () => {
    expect(familiesLine(SAMPLE_OBITUARY_DATA)).toMatch(/^الراضون بقضاء الله وقدره: /)
  })
})

describe("defaultFamiliesLine — يُشتق تلقائياً: عائلة الفقيد أولاً ثم عائلات الأقارب", () => {
  const baseData: Omit<ObituaryData, "relatives"> = {
    deceased: {
      gender: "male", name: "فلان الحموي", deathDateISO: "2026-01-01", hijriOffsetDays: 0,
      country: "لبنان", hasBasmala: false, hasInnaLillah: false,
    },
    funeral: { prayerLocation: "" },
    format: { numerals: "arabic-indic", months: "levantine", dateOrder: "hijri-first" },
    templateId: "modern-minimal",
  }
  const withDeceasedName = (name: string): Omit<ObituaryData, "relatives"> => ({
    ...baseData,
    deceased: { ...baseData.deceased, name },
  })

  it("عائلة الفقيد تتصدّر السطر حتى لو خالفت عائلات الأقارب", () => {
    const data: ObituaryData = {
      ...withDeceasedName("محمد شهاب"),
      relatives: [{
        id: "g1", categoryKey: "wives",
        members: [{ id: "w", name: "ناهد ضومط", isDeceased: false, gender: "female" }],
      }],
    }
    expect(defaultFamiliesLine(data)).toBe("الراضون بقضاء الله وقدره: آل شهاب، ضومط")
  })

  it.each([
    ["أحمد علاء الدين", "علاء الدين"],
    ["أحمد ابو علي", "ابو علي"],
    ["أحمد أبي خليل", "أبي خليل"],
    ["أحمد بو صعب", "بو صعب"],
    ["أحمد عبد النور", "عبد النور"],
    ["أحمد نصر الله", "نصر الله"],
    ["أحمد الحاج حسن", "الحاج حسن"],
    ["أحمد قره علي", "قره علي"],
    ["أحمد بني طعمة", "بني طعمة"],
  ])("عائلة مركّبة: %s ← آل %s", (name, family) => {
    expect(defaultFamiliesLine({ ...withDeceasedName(name), relatives: [] })).toBe(`الراضون بقضاء الله وقدره: آل ${family}`)
  })

  it.each([["نور الدين"], ["عبد الله"], ["أبو علي"]])("%s وحده اسم أول، لا عائلة", (name) => {
    expect(defaultFamiliesLine({ ...withDeceasedName(name), relatives: [] })).toBe("")
  })

  it("اسم من كلمتين يطابق عائلة معروفة يبقى اسماً ولقباً (حسين علي ← علي)", () => {
    expect(defaultFamiliesLine({ ...withDeceasedName("حسين علي"), relatives: [] })).toBe("الراضون بقضاء الله وقدره: آل علي")
  })

  it("مثال المستخدم: والده أحمد الحموي ووالدته نازك قباني ← آل الحموي، قباني", () => {
    const data: ObituaryData = {
      ...baseData,
      relatives: [
        {
          id: "g1", categoryKey: "parents",
          members: [
            { id: "f", name: "أحمد الحموي", isDeceased: true, gender: "male" },
            { id: "m", name: "نازك قباني", isDeceased: true, gender: "female" },
          ],
        },
      ],
    }
    expect(defaultFamiliesLine(data)).toBe("الراضون بقضاء الله وقدره: آل الحموي، قباني")
  })

  it("يستبعد اسم العائلة المكرَّر — لا تتكرر (الحموي) لو تعدّد الأقارب من نفس العائلة", () => {
    const data: ObituaryData = {
      ...baseData,
      relatives: [
        {
          id: "g1", categoryKey: "parents",
          members: [
            { id: "f", name: "أحمد الحموي", isDeceased: true, gender: "male" },
            { id: "m", name: "نازك قباني", isDeceased: true, gender: "female" },
          ],
        },
        {
          id: "g2", categoryKey: "brothers",
          members: [{ id: "b1", name: "علي الحموي", isDeceased: false, gender: "male" }],
        },
      ],
    }
    expect(defaultFamiliesLine(data)).toBe("الراضون بقضاء الله وقدره: آل الحموي، قباني")
  })

  it("يتجاهل الكنية بين قوسين ولا يحتسبها اسم عائلة (مثال: نازك محي الدين قباني (أبو نادر))", () => {
    const data: ObituaryData = {
      ...baseData,
      relatives: [
        {
          id: "g1", categoryKey: "parents",
          members: [
            { id: "f", name: "أحمد الحموي", isDeceased: true, gender: "male" },
            { id: "m", name: "نازك محي الدين قباني (أبو نادر)", isDeceased: true, gender: "female" },
          ],
        },
      ],
    }
    expect(defaultFamiliesLine(data)).toBe("الراضون بقضاء الله وقدره: آل الحموي، قباني")
  })

  it("يتجاهل الأسماء من كلمة واحدة (لا لقب عائلة فعلي فيها)", () => {
    const data: ObituaryData = {
      ...baseData,
      relatives: [{ id: "g1", categoryKey: "sons", members: [{ id: "s1", name: "كمال", isDeceased: false, gender: "male" }] }],
    }
    expect(defaultFamiliesLine(data)).toBe("الراضون بقضاء الله وقدره: آل الحموي")
  })

  it("يشمل اسم عائلة زوج/ة القريب أيضاً (الأصهار)", () => {
    const data: ObituaryData = {
      ...baseData,
      relatives: [
        {
          id: "g1", categoryKey: "daughters",
          members: [{ id: "d1", name: "هنا", isDeceased: false, gender: "female", spouseName: "توفيق شهاب" }],
        },
      ],
    }
    expect(defaultFamiliesLine(data)).toBe("الراضون بقضاء الله وقدره: آل الحموي، شهاب")
  })

  it("الأبناء الذكور لفقيد ذكر والإخوة لا يضيفون اسم أبيهم كعائلة", () => {
    const data: ObituaryData = {
      ...baseData,
      relatives: [
        { id: "g1", categoryKey: "sons", members: [{ id: "s1", name: "عمر خالد", isDeceased: false, gender: "male" }] },
        { id: "g2", categoryKey: "brothers", members: [{ id: "b1", name: "يوسف أحمد", isDeceased: false, gender: "male" }] },
      ],
    }
    expect(defaultFamiliesLine(data)).toBe("الراضون بقضاء الله وقدره: آل الحموي")
  })

  it("أبناء الفقيدة يضيفون عائلتهم لأنهم يحملون لقب زوجها", () => {
    const data: ObituaryData = {
      ...withDeceasedName("فلانة الحموي"),
      deceased: { ...baseData.deceased, name: "فلانة الحموي", gender: "female" },
      relatives: [{ id: "g1", categoryKey: "sons", members: [{ id: "s1", name: "عمر قباني", isDeceased: false, gender: "male" }] }],
    }
    expect(defaultFamiliesLine(data)).toBe("الراضون بقضاء الله وقدره: آل الحموي، قباني")
  })

  it("بلا أي اسم عائلة ← نص فارغ", () => {
    expect(defaultFamiliesLine({ ...withDeceasedName("فلان"), relatives: [] })).toBe("")
  })

  describe("وعموم أهالي", () => {
    const withArea = (funeral: Partial<ObituaryData["funeral"]>, customTexts?: ObituaryData["customTexts"]): ObituaryData => ({
      ...baseData,
      relatives: [],
      customTexts,
      funeral: { ...baseData.funeral, ...funeral },
    })

    it("تُلحق بآخر السطر عند التفعيل", () => {
      expect(familiesLine(withArea({ includeAreaResidents: true, areaResidentsName: "شحيم" }))).toBe(
        "الراضون بقضاء الله وقدره: آل الحموي، وعموم أهالي شحيم"
      )
    })

    it("تُلحق بالنص المخصّص أيضاً", () => {
      expect(familiesLine(withArea({ includeAreaResidents: true, areaResidentsName: "شحيم" }, { familiesLine: "نص حر" }))).toBe(
        "نص حر، وعموم أهالي شحيم"
      )
    })

    it("لا تُطبع بلا تفعيل أو بلا اسم منطقة", () => {
      expect(familiesLine(withArea({ includeAreaResidents: false, areaResidentsName: "شحيم" }))).not.toContain("عموم")
      expect(familiesLine(withArea({ includeAreaResidents: true, areaResidentsName: "  " }))).not.toContain("عموم")
    })
  })
})

describe("funeralSentence", () => {
  it("يركّب جملة الصلاة كاملة بلا مسافات مزدوجة", () => {
    const sentence = funeralSentence(SAMPLE_OBITUARY_DATA)
    expect(sentence).not.toMatch(/\s{2,}/)
    expect(sentence).toContain("سيصلى على جثمانه الطاهر")
    expect(sentence).toContain(SAMPLE_OBITUARY_DATA.funeral.prayerLocation)
  })

  it("يلحق «ويوارى الثرى في…» بفاصلة كسطر مكمّل، لا فقرة منفصلة", () => {
    const data: ObituaryData = {
      ...SAMPLE_OBITUARY_DATA,
      funeral: { ...SAMPLE_OBITUARY_DATA.funeral, burialLocation: "جبانة الثرى" },
    }
    const sentence = funeralSentence(data)
    expect(sentence).toContain("في مسجد الشهداء، ويوارى الثرى في جبانة الثرى")
  })

  it("بلا مكان دفن: الجملة تنتهي عادياً بلا فاصلة معلّقة", () => {
    const data: ObituaryData = {
      ...SAMPLE_OBITUARY_DATA,
      funeral: { ...SAMPLE_OBITUARY_DATA.funeral, burialLocation: undefined },
    }
    const sentence = funeralSentence(data)
    expect(sentence).not.toContain("ويوارى")
    expect(sentence).not.toMatch(/،\s*$/)
  })
})

describe("formatDualDate — القاعدة ١: الترتيب متغيّر", () => {
  it("هجري أولاً", () => {
    const s = formatDualDate("2026-03-24", {
      hijriOffsetDays: 0, order: "hijri-first", numerals: "arabic-indic", months: "levantine",
    })
    expect(s).toMatch(/هـ، الموافق/)
    expect(s).toContain("آذار")
  })

  it("ميلادي أولاً", () => {
    const s = formatDualDate("2026-06-02", {
      hijriOffsetDays: 0, order: "gregorian-first", numerals: "arabic-indic", months: "levantine",
    })
    expect(s).toMatch(/م، الموافق/)
  })

  it("إزاحة هجرية يدوية تغيّر اليوم الهجري فقط", () => {
    const base = formatDualDate("2026-03-24", {
      hijriOffsetDays: 0, order: "hijri-first", numerals: "western", months: "levantine",
    })
    const shifted = formatDualDate("2026-03-24", {
      hijriOffsetDays: 1, order: "hijri-first", numerals: "western", months: "levantine",
    })
    expect(shifted).not.toBe(base)
    // الجزء الميلادي (آذار) يبقى كما هو رغم إزاحة الهجري
    expect(shifted).toContain("آذار")
  })
})

describe("formatWeekdayName", () => {
  it("يرجع اسم يوم عربياً", () => {
    const day = formatWeekdayName("2026-03-24")
    expect(day.length).toBeGreaterThan(0)
    expect(day).not.toMatch(/[0-9]/)
  })
})

describe("toNumerals — القاعدة ٢: نظامان للأرقام", () => {
  it("يحوّل إلى عربي-هندي", () => {
    expect(toNumerals("2026", "arabic-indic")).toBe("٢٠٢٦")
  })
  it("يحوّل إلى غربي", () => {
    expect(toNumerals("١٤٤٧", "western")).toBe("1447")
  })
})

describe("calculateAge", () => {
  it("يحسب العمر بدقة مع مراعاة الشهر واليوم", () => {
    expect(calculateAge("1950-05-10", "2026-03-24")).toBe(75)
    expect(calculateAge("1950-01-10", "2026-03-24")).toBe(76)
  })
})

describe("relativesBlocks — فئة 'الوالدين' الموحّدة تُطبع كسطرين منفصلين", () => {
  it("يفصل الأب والأم إلى سطرين بلقبيهما الصحيحين رغم أنهما فئة واحدة في المحرر", () => {
    const data: ObituaryData = {
      ...SAMPLE_OBITUARY_DATA,
      relatives: [
        {
          id: "parents",
          categoryKey: "parents",
          members: [
            { id: "f", name: "محمد شهاب", honorific: "الحاج", isDeceased: true, gender: "male" },
            { id: "m", name: "خديجة عيتاني", honorific: "الحاجة", isDeceased: true, gender: "female" },
          ],
        },
      ],
    }
    const blocks = relativesBlocks(data)
    expect(blocks).toHaveLength(2)
    expect(blocks[0].label).toBe("والده")
    expect(blocks[0].text).toBe("المرحوم الحاج محمد شهاب")
    expect(blocks[1].label).toBe("والدته")
    expect(blocks[1].text).toBe("المرحومة الحاجة خديجة عيتاني")
  })

  it("يعرض سطراً واحداً فقط إن غاب أحد الوالدين", () => {
    const data: ObituaryData = {
      ...SAMPLE_OBITUARY_DATA,
      relatives: [
        {
          id: "parents",
          categoryKey: "parents",
          members: [{ id: "f", name: "محمد شهاب", honorific: "الحاج", isDeceased: false, gender: "male" }],
        },
      ],
    }
    const blocks = relativesBlocks(data)
    expect(blocks).toHaveLength(1)
    expect(blocks[0].label).toBe("والده")
  })
})
