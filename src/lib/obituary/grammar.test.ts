// اختبارات تحقّق ضد نصوص حقيقية من المرفقات الخمسة — لا يجوز كسرها بلا مراجعة الصورة الأصلية.

import { describe, expect, it } from "vitest"
import { joinWithWaw, relativeCategoryLabel, renderPersonCore, renderRelativeList } from "./grammar"
import { calculateAge, formatDualDate, formatWeekdayName, toNumerals } from "./hijri"
import {
  closingDua, deceasedNameLine, defaultFamiliesLine, familiesLine, funeralSentence, identityLine, maghfoorLine, relativesBlocks,
} from "./render"
import { SAMPLE_OBITUARY_DATA } from "./defaults"
import type { ObituaryData, Person } from "./types"

describe("joinWithWaw", () => {
  it("يربط بحرف الواو الملتصق بلا فواصل", () => {
    expect(joinWithWaw(["ابراهيم", "أحمد", "عبدالله"])).toBe("ابراهيم وأحمد وعبدالله")
  })
  it("يتجاهل العناصر الفارغة", () => {
    expect(joinWithWaw(["أ", "", "ب"])).toBe("أ وب")
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

  it("بلا زوج/ة: الاسم فقط مع اللقب", () => {
    const p: Person = { id: "3", name: "ابراهيم", honorific: "الحاج", isDeceased: false, gender: "male" }
    expect(renderPersonCore(p)).toBe("الحاج ابراهيم")
  })
})

describe("renderRelativeList — القاعدة ٥: تجميع الوفاة المتتالية", () => {
  it("يجمع سلسلة متتالية تحت (المرحومين) مرة واحدة (المرفق ١: الأشقاء)", () => {
    const members: Person[] = [
      { id: "b1", name: "ابراهيم", honorific: "الحاج", isDeceased: false, gender: "male" },
      { id: "b2", name: "أحمد", honorific: "الحاج", isDeceased: true, gender: "male" },
      { id: "b3", name: "عبدالله", honorific: "الحاج", isDeceased: true, gender: "male" },
    ]
    expect(renderRelativeList(members)).toBe(
      "الحاج ابراهيم والمرحومين الحاج أحمد والحاج عبدالله"
    )
  })

  it("يستعمل صيغة المؤنث (المرحومات) لسلسلة إناث متتالية", () => {
    const members: Person[] = [
      { id: "s1", name: "سعاد", honorific: "الحاجة", isDeceased: true, gender: "female" },
      { id: "s2", name: "خانم", honorific: "الحاجة", isDeceased: true, gender: "female" },
    ]
    expect(renderRelativeList(members)).toBe("المرحومات الحاجة سعاد والحاجة خانم")
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

  it("زوجة واحدة ← زوجته لا زوجاته", () => {
    expect(relativeCategoryLabel("wives", "male", [female("w1")])).toBe("زوجته")
  })
  it("زوجتان ← تبقى زوجاته (صيغة الجمع)", () => {
    expect(relativeCategoryLabel("wives", "male", [female("w1"), female("w2")])).toBe("زوجاته")
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

  it("ذكر توفي في الخارج (المرفق ٥)", () => {
    const line = identityLine({
      gender: "male", name: "عثمان عزالدين عيتاني",
      deathDateISO: "2026-07-14", hijriOffsetDays: 0, country: "لبنان",
      hasBasmala: false, hasInnaLillah: false, deathPlaceNote: "كاليفورنيا",
    })
    expect(line).toBe("المتوفي في كاليفورنيا")
  })
})

describe("maghfoorLine و deceasedNameLine و closingDua — تصريف حسب جنس الفقيد", () => {
  it("ذكر", () => {
    expect(maghfoorLine(SAMPLE_OBITUARY_DATA)).toBe("المغفور له بإذن الله")
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

describe("defaultFamiliesLine — يُشتق تلقائياً من آخر كلمة في اسم كل قريب", () => {
  const baseData: Omit<ObituaryData, "relatives"> = {
    deceased: {
      gender: "male", name: "فلان الفلاني", deathDateISO: "2026-01-01", hijriOffsetDays: 0,
      country: "لبنان", hasBasmala: false, hasInnaLillah: false,
    },
    funeral: { prayerLocation: "" },
    format: { numerals: "arabic-indic", months: "levantine", dateOrder: "hijri-first" },
    templateId: "modern-minimal",
  }

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
    expect(defaultFamiliesLine(data)).toBe("")
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
    expect(defaultFamiliesLine(data)).toBe("الراضون بقضاء الله وقدره: آل شهاب")
  })

  it("بلا أي قريب مُدخَل ← نص فارغ", () => {
    expect(defaultFamiliesLine({ ...baseData, relatives: [] })).toBe("")
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
