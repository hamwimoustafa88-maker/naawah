"use client"

import { create } from "zustand"
import { FIXED_GENDER_BY_CATEGORY, SAMPLE_OBITUARY_DATA, createEmptyPerson, createEmptyRelativeGroup } from "@/lib/obituary/defaults"
import type { BulkNameEntry } from "@/lib/obituary/bulkNames"
import type { FitStatus } from "@/lib/obituary/exportChecks"
import type { CustomTextKey, DeceasedInfo, FormatPrefs, FuneralInfo, NameStyleOverride, ObituaryData, Person, RelativeCategoryKey, RelativeGroup, RelativeNameStyle } from "@/lib/obituary/types"

interface EditorState {
  data: ObituaryData

  /** سجل التراجع — لقطات من data تُدار بالتجميع الزمني في useObituaryHistory. */
  past: ObituaryData[]
  future: ObituaryData[]
  undo: () => void
  redo: () => void

  /** ملاءمة المحتوى لصفحة A4 — حالة واجهة يحدّثها ObituaryCanvas. */
  fitStatus: FitStatus
  setFitStatus: (status: FitStatus) => void

  /**
   * معرّف النعوة الحالية — هو نفسه معرّفها في التخزين المحلي (lib/drafts) وأساس منع
   * التكرار عند أرشفة التصدير في Google Drive (راجع src/lib/export/archive.ts
   * وsrc/app/api/archive/route.ts): تصدير نفس النعوة، ولو بعد إعادة فتحها لاحقاً،
   * يُحدِّث ملف Drive نفسه بدل تكراره. **خارج ObituaryData عمداً** — ليس بياناً للنعوة.
   * قيمته الابتدائية هنا ثابتة (بلا crypto.randomUUID()) لنفس سبب معرّفات فئات
   * القرابة الثابتة في createEmptyData() أسفل — تقييم الوحدة يحدث في بيئتين
   * (SSR + hydration)، فمعرّف عشوائي هنا يُنتج قيمتين مختلفتين ويكسر hydration.
   * القيمة الحقيقية تُحسم بعد التركيب في useObituaryAutosave (معرّف آخر نعوة محفوظة،
   * أو regenerateArchiveKey() إن لم توجد) ثم تتجدّد مع كل نعوة جديدة (reset/loadData/loadSample).
   */
  archiveKey: string
  regenerateArchiveKey: () => void

  /** انتهت محاولة استعادة آخر نعوة محفوظة — TemplateFromQuery ينتظرها كي لا تُلغي الاستعادة قالب الرابط. */
  draftsReady: boolean
  /** فشل آخر حفظ في المتصفح (امتلاء المساحة أو تخزين معطّل) — يظهر تنبيه في CreateHeader. */
  draftSaveFailed: boolean
  /** يفتح نعوة محفوظة في المحرر — راجع useObituaryAutosave وSavedObituaries.tsx. */
  openObituary: (id: string, data: ObituaryData) => void

  /**
   * معاينة خط عابرة (hover) — منفصلة عمداً عن data.bodyFontFamily/nameStyle.fontFamily
   * الفعليَّين: تُطبَّق فوراً على الكانفاس بأولوية أعلى منهما (راجع ObituaryBlocks.tsx)
   * أثناء تمرير المؤشر فوق اسم خط في FontPicker.tsx فقط، بلا أي تعديل على البيانات
   * الفعلية. تُمسَح (undefined) عند مغادرة المؤشر أو عند اختيار خط فعلياً بالنقر —
   * "لا يعني شيئاً" ما لم يُنقَر عليه صراحةً، كما طُلب حرفياً. ليست جزءاً من
   * ObituaryData عمداً — لا تُصدَّر ولا تُستورَد ولا تُحفَظ، مجرّد حالة واجهة عابرة.
   */
  previewBodyFontFamily?: string
  previewNameFontFamily?: string
  setPreviewBodyFontFamily: (fontFamily: string | undefined) => void
  setPreviewNameFontFamily: (fontFamily: string | undefined) => void

  updateDeceased: (patch: Partial<DeceasedInfo>) => void
  updateFuneral: (patch: Partial<FuneralInfo>) => void
  updateFormat: (patch: Partial<FormatPrefs>) => void
  updateCustomText: (key: CustomTextKey, value: string | undefined) => void
  updateNameStyle: (patch: Partial<NameStyleOverride>) => void
  updateRelativeNameStyle: (patch: Partial<RelativeNameStyle>) => void
  setBodyFontFamily: (fontFamily: string | undefined) => void
  setTemplate: (templateId: string) => void

  /** يُعيد id الفئة المُنشأة — يُستهلَك في mobile/MobileEditorView.tsx للتنقّل
   * التلقائي إلى شاشة الفئة الجديدة فور إضافتها (راجع AddRelativeCategoryField). */
  addRelativeGroup: (categoryKey: RelativeCategoryKey) => string
  removeRelativeGroup: (groupId: string) => void
  updateRelativeGroup: (groupId: string, patch: Partial<RelativeGroup>) => void
  reorderRelativeGroups: (groups: RelativeGroup[]) => void

  addPerson: (groupId: string) => void
  /** يملأ الصفوف الفارغة أولاً، ثم يضيف الباقي — لصق عدة أسماء دفعة واحدة. */
  addPersons: (groupId: string, entries: BulkNameEntry[]) => void
  updatePerson: (groupId: string, personId: string, patch: Partial<Person>) => void
  removePerson: (groupId: string, personId: string) => void
  reorderPersons: (groupId: string, members: Person[]) => void

  loadSample: () => void
  reset: () => void
  /** يستبدل بيانات النعوة بالكامل — مؤقت، يخدم استيراد JSON للاختبار عبر
   * lib/export/tempDataIO.ts وCreateHeader.tsx. احذفه معها لاحقاً. */
  loadData: (data: ObituaryData) => void
}

/**
 * الحالة الافتراضية: بلا أي قيم مسبقة تُطبع في النعوة (كل نص في المحرر هو placeholder
 * فقط). **ست فئات قرابة شائعة مُفعَّلة سلفاً بطلب صريح** (الوالدين، زوجته، ولده،
 * ابنته، شقيقه، شقيقته) — عكس قرار سابق كان يبقيها فارغة تماماً؛ كل فئة تبدأ بعضو
 * واحد فارغ (بلا اسم) فلا تُطبع كسطر في النعوة قبل تعبئتها فعلاً (راجع الفلترة على
 * الاسم الفارغ في relativesBlocks بـrender.ts). ترتيبها هنا ثابت دائماً في مقدّمة
 * `relatives[]`؛ أي فئة أخرى يضيفها المستخدم لاحقاً عبر "إضافة فئة قرابة" تُلحَق
 * بعدها (Append-only في addRelativeGroup) بلا تعارض في الترتيب.
 * تاريخ الوفاة وتاريخ الصلاة والدفن كلاهما بلا قيمة افتراضية — يُملآن بتاريخ اليوم
 * عند أول تركيز على الحقل المعني فقط (راجع Step1Deceased.tsx وStep2Funeral.tsx)، لا تلقائياً هنا.
 */
export function createEmptyData(): ObituaryData {
  return {
    deceased: {
      gender: "male",
      name: "",
      deathDateISO: "",
      hijriOffsetDays: 0,
      country: "لبنان",
      hasBasmala: false,
      hasInnaLillah: false,
    },
    funeral: {
      prayerLocation: "",
      // مفعّل افتراضياً بطلب صريح — بلا اعتماد على اقتراح القالب (template.showPrintFooter)
      // كما كان سابقاً (راجع printFooterText في render.ts: printFooterEnabled ?? templateSuggestsFooter).
      printFooterEnabled: true,
    },
    // id ثابت صريح (لا crypto.randomUUID() الافتراضي) لكل فئة من الست — إلزامي هنا
    // تحديداً لأن createEmptyData() تُستدعى عند تقييم الوحدة (module) في تعريف متجر
    // Zustand أسفل، والذي يُنفَّذ مرتين مستقلّتين (خادم SSR + عميل hydration)؛ معرّف
    // عشوائي هنا يُنتج قيمتين مختلفتين بين البيئتين ويُسبّب عطل hydration mismatch
    // حقيقياً واجهناه فعلاً. راجع تعليق createEmptyRelativeGroup في defaults.ts.
    relatives: [
      createEmptyRelativeGroup("parents", "default-parents"),
      createEmptyRelativeGroup("wives", "default-wives"),
      createEmptyRelativeGroup("sons", "default-sons"),
      createEmptyRelativeGroup("daughters", "default-daughters"),
      createEmptyRelativeGroup("brothers", "default-brothers"),
      createEmptyRelativeGroup("sisters", "default-sisters"),
    ],
    format: {
      numerals: "arabic-indic",
      months: "levantine",
      dateOrder: "hijri-first",
    },
    templateId: "modern-minimal",
  }
}

export const useEditorStore = create<EditorState>((set) => ({
  data: createEmptyData(),

  past: [],
  future: [],
  undo: () =>
    set((s) => {
      const previous = s.past.at(-1)
      return previous ? { data: previous, past: s.past.slice(0, -1), future: [...s.future, s.data] } : s
    }),
  redo: () =>
    set((s) => {
      const next = s.future.at(-1)
      return next ? { data: next, future: s.future.slice(0, -1), past: [...s.past, s.data] } : s
    }),

  fitStatus: "ok",
  setFitStatus: (fitStatus) => set((s) => (s.fitStatus === fitStatus ? s : { fitStatus })),

  archiveKey: "",
  regenerateArchiveKey: () => set({ archiveKey: crypto.randomUUID() }),

  draftsReady: false,
  draftSaveFailed: false,
  openObituary: (id, data) => set({ data, archiveKey: id }),

  previewBodyFontFamily: undefined,
  previewNameFontFamily: undefined,
  setPreviewBodyFontFamily: (fontFamily) => set({ previewBodyFontFamily: fontFamily }),
  setPreviewNameFontFamily: (fontFamily) => set({ previewNameFontFamily: fontFamily }),

  updateDeceased: (patch) =>
    set((s) => ({ data: { ...s.data, deceased: { ...s.data.deceased, ...patch } } })),

  updateFuneral: (patch) =>
    set((s) => ({ data: { ...s.data, funeral: { ...s.data.funeral, ...patch } } })),

  updateFormat: (patch) =>
    set((s) => ({ data: { ...s.data, format: { ...s.data.format, ...patch } } })),

  updateCustomText: (key, value) =>
    set((s) => {
      const customTexts = { ...s.data.customTexts }
      if (value === undefined) delete customTexts[key]
      else customTexts[key] = value
      return { data: { ...s.data, customTexts } }
    }),

  updateNameStyle: (patch) =>
    set((s) => ({ data: { ...s.data, nameStyle: { ...s.data.nameStyle, ...patch } } })),

  updateRelativeNameStyle: (patch) =>
    set((s) => ({ data: { ...s.data, relativeNameStyle: { ...s.data.relativeNameStyle, ...patch } } })),

  setBodyFontFamily: (fontFamily) => set((s) => ({ data: { ...s.data, bodyFontFamily: fontFamily } })),

  setTemplate: (templateId) => set((s) => ({ data: { ...s.data, templateId } })),

  addRelativeGroup: (categoryKey) => {
    // كل فئة تُضاف تبدأ بعضو واحد جاهز للتعديل مباشرة (لا زر "إضافة اسم" فارغ) —
    // createEmptyRelativeGroup تتكفّل بهذا (بعضوين جاهزين لـ"الوالدين" تحديداً).
    const group = createEmptyRelativeGroup(categoryKey)
    set((s) => ({ data: { ...s.data, relatives: [...s.data.relatives, group] } }))
    return group.id
  },

  removeRelativeGroup: (groupId) =>
    set((s) => ({ data: { ...s.data, relatives: s.data.relatives.filter((g) => g.id !== groupId) } })),

  updateRelativeGroup: (groupId, patch) =>
    set((s) => ({
      data: { ...s.data, relatives: s.data.relatives.map((g) => (g.id === groupId ? { ...g, ...patch } : g)) },
    })),

  reorderRelativeGroups: (groups) => set((s) => ({ data: { ...s.data, relatives: groups } })),

  addPerson: (groupId) =>
    set((s) => ({
      data: {
        ...s.data,
        relatives: s.data.relatives.map((g) =>
          g.id === groupId
            ? { ...g, members: [...g.members, createEmptyPerson(FIXED_GENDER_BY_CATEGORY[g.categoryKey] ?? "male")] }
            : g
        ),
      },
    })),

  addPersons: (groupId, entries) =>
    set((s) => ({
      data: {
        ...s.data,
        relatives: s.data.relatives.map((g) => {
          if (g.id !== groupId) return g
          const queue = [...entries]
          const members = g.members.map((m) => (m.name.trim() === "" && queue.length > 0 ? { ...m, ...queue.shift() } : m))
          const gender = FIXED_GENDER_BY_CATEGORY[g.categoryKey] ?? "male"
          return { ...g, members: [...members, ...queue.map((entry) => ({ ...createEmptyPerson(gender), ...entry }))] }
        }),
      },
    })),

  updatePerson: (groupId, personId, patch) =>
    set((s) => ({
      data: {
        ...s.data,
        relatives: s.data.relatives.map((g) =>
          g.id === groupId
            ? { ...g, members: g.members.map((m) => (m.id === personId ? { ...m, ...patch } : m)) }
            : g
        ),
      },
    })),

  removePerson: (groupId, personId) =>
    set((s) => ({
      data: {
        ...s.data,
        relatives: s.data.relatives.map((g) =>
          g.id === groupId ? { ...g, members: g.members.filter((m) => m.id !== personId) } : g
        ),
      },
    })),

  reorderPersons: (groupId, members) =>
    set((s) => ({
      data: { ...s.data, relatives: s.data.relatives.map((g) => (g.id === groupId ? { ...g, members } : g)) },
    })),

  // نعوة جديدة = ملف أرشيف جديد في Drive — تجديد archiveKey مع كل استبدال كامل للبيانات.
  loadSample: () => set({ data: SAMPLE_OBITUARY_DATA, archiveKey: crypto.randomUUID() }),
  reset: () => set({ data: createEmptyData(), archiveKey: crypto.randomUUID() }),
  loadData: (data) => set({ data, archiveKey: crypto.randomUUID() }),
}))
