"use client"

import { create } from "zustand"
import { FIXED_GENDER_BY_CATEGORY, SAMPLE_OBITUARY_DATA, createEmptyPerson, createEmptyRelativeGroup } from "@/lib/obituary/defaults"
import type { CustomTextKey, DeceasedInfo, FormatPrefs, FuneralInfo, NameStyleOverride, ObituaryData, Person, RelativeCategoryKey, RelativeGroup } from "@/lib/obituary/types"

interface EditorState {
  data: ObituaryData
  step: number

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

  setStep: (step: number) => void
  updateDeceased: (patch: Partial<DeceasedInfo>) => void
  updateFuneral: (patch: Partial<FuneralInfo>) => void
  updateFormat: (patch: Partial<FormatPrefs>) => void
  updateCustomText: (key: CustomTextKey, value: string | undefined) => void
  updateNameStyle: (patch: Partial<NameStyleOverride>) => void
  setBodyFontFamily: (fontFamily: string | undefined) => void
  setTemplate: (templateId: string) => void

  /** يُعيد id الفئة المُنشأة — يُستهلَك في mobile/MobileEditorView.tsx للتنقّل
   * التلقائي إلى شاشة الفئة الجديدة فور إضافتها (راجع AddRelativeCategoryField). */
  addRelativeGroup: (categoryKey: RelativeCategoryKey) => string
  removeRelativeGroup: (groupId: string) => void
  updateRelativeGroup: (groupId: string, patch: Partial<RelativeGroup>) => void
  reorderRelativeGroups: (groups: RelativeGroup[]) => void

  addPerson: (groupId: string) => void
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
 * فقط). **بلا أي فئة قرابة مُفعَّلة سلفاً** (بطلب صريح) — المستخدم يضيف كل فئة بنفسه
 * عبر "إضافة فئة قرابة"، فيبقى ترتيب `relatives[]` مطابقاً تماماً لترتيب إضافته
 * الفعلي (Append-only في addRelativeGroup) بلا أي فئة "خفية" تُخِلّ بهذا الترتيب.
 * تاريخ الوفاة وتاريخ الصلاة والدفن كلاهما بلا قيمة افتراضية — يُملآن بتاريخ اليوم
 * عند أول تركيز على الحقل المعني فقط (راجع Step1Deceased.tsx وStep2Funeral.tsx)، لا تلقائياً هنا.
 */
function createEmptyData(): ObituaryData {
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
    relatives: [],
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
  step: 1,

  previewBodyFontFamily: undefined,
  previewNameFontFamily: undefined,
  setPreviewBodyFontFamily: (fontFamily) => set({ previewBodyFontFamily: fontFamily }),
  setPreviewNameFontFamily: (fontFamily) => set({ previewNameFontFamily: fontFamily }),

  setStep: (step) => set({ step }),

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

  setBodyFontFamily: (fontFamily) => set((s) => ({ data: { ...s.data, bodyFontFamily: fontFamily } })),

  setTemplate: (templateId) => set((s) => ({ data: { ...s.data, templateId } })),

  addRelativeGroup: (categoryKey) => {
    const group = createEmptyRelativeGroup(categoryKey)
    // كل فئة تُضاف تبدأ باسم واحد جاهز للتعديل مباشرة، لا بزر "إضافة اسم" فارغ.
    // "الوالدين" حالة خاصة تصل بعضوين جاهزين سلفاً من createEmptyRelativeGroup.
    if (group.members.length === 0) {
      group.members.push(createEmptyPerson(FIXED_GENDER_BY_CATEGORY[categoryKey] ?? "male"))
    }
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

  loadSample: () => set({ data: SAMPLE_OBITUARY_DATA }),
  reset: () => set({ data: createEmptyData(), step: 1 }),
  loadData: (data) => set({ data }),
}))
