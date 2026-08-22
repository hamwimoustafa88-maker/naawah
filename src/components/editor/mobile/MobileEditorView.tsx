"use client"

// تجربة الجوال الكاملة لصفحة /create: معاينة حية تملأ الشاشة دائماً (بلا تبويب
// "تعديل/معاينة" يُخفي أحدهما) + زر عائم يفتح بوب-أب (بوتوم-شيت) فوق المعاينة نفسها
// يحوي شبكة أقسام صغيرة سريعة. أي تعديل داخل القسم المفتوح ينعكس فوراً على المعاينة
// لأن كليهما يقرآن من نفس متجر Zustand (useEditorStore) — لا حاجة لأي مزامنة يدوية.
//
// لا يُعاد أي منطق حقول هنا: كل قسم يستدعي مباشرة نفس المكوّن المُصدَّر من ملفات
// الخطوات (Step1Deceased.tsx وغيره) عبر sectionRegistry.tsx — مصدر واحد للحقول
// يخدم سطح المكتب والجوال معاً.
//
// ملاحظة أداء مهمة: كل فرع أدناه يستدعي مكوّن القسم مباشرة كـ JSX (مثال: <C />
// حيث C مرجع مستورد ثابت، أو <GroupCard groupId={id} />) — وليس عبر تغليفه بدالة
// سهمية جديدة تُنشأ كل تصيير (render). إنشاء نوع مكوّن جديد كل تصيير يجعل React
// يُفكِّك (unmount) الشجرة الفرعية ويعيد تركيبها من الصفر في كل ضغطة مفتاح، فيفقد
// حقل الإدخال تركيزه (focus) فوراً بعد أول حرف — عطل تجربة مستخدم خطير وصامت.

import { useState, type ComponentType, type ReactNode } from "react"
import { Pencil, UserPlus } from "lucide-react"
import type { LucideProps } from "lucide-react"
import { ObituaryCanvas } from "@/components/canvas/ObituaryCanvas"
import { ResponsiveCanvasFrame } from "@/components/canvas/ResponsiveCanvasFrame"
import { useEditorStore } from "@/store/editorStore"
import { relativeCategoryLabel } from "@/lib/obituary/grammar"
import { cn } from "@/lib/utils/cn"
import { AddRelativeCategoryField, GroupCard } from "@/components/editor/steps/Step3Relatives"
import { BottomSheet } from "@/components/editor/mobile/BottomSheet"
import { SECTION_GROUPS, STATIC_SECTIONS, type SectionGroupId } from "@/components/editor/mobile/sectionRegistry"

const CHIP_CLASS =
  "relative flex flex-col items-center gap-1.5 rounded-xl bg-black/5 p-3 text-center text-[11px] font-medium leading-tight text-foreground transition-colors hover:bg-accent/10 active:bg-accent/15"

/** أول قسم يُنصَح المستخدم بالبدء منه — يُميَّز بصرياً في شبكة القائمة (راجع طلب
 * "علامة على الزر الأول" صراحة). ليس له أي أثر وظيفي، مجرّد إرشاد بصري. */
const FIRST_STEP_NAV_ID = "static:identity"

export function MobileEditorView() {
  const data = useEditorStore((s) => s.data)
  const relatives = data.relatives
  const deceasedGender = data.deceased.gender

  // اللائحة تُفتح تلقائياً فور دخول الصفحة على الجوال (بلا حاجة لضغط الزر العائم
  // أولاً) — طُلب صراحة أن تظهر "وكأنها مفتوحة" من البداية، لا مطفأة.
  const [sheetOpen, setSheetOpen] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  // آخر قسم فتحه المستخدم فعلياً — يبقى محفوظاً حتى بعد الرجوع للقائمة أو إغلاق
  // اللائحة بالكامل وإعادة فتحها، ليُعرَض عليه "أنت هنا" بدل "ابدأ هنا" فور العودة
  // (طُلب صراحة: يعرف المستخدم أين توقّف، لا يُعاد توجيهه لبداية القائمة في كل مرة).
  const [lastVisitedId, setLastVisitedId] = useState<string | null>(null)

  const openMenu = () => {
    setActiveId(null)
    setSheetOpen(true)
  }
  const closeSheet = () => setSheetOpen(false)
  const backToMenu = () => setActiveId(null)
  const goTo = (id: string) => {
    setActiveId(id)
    setLastVisitedId(id)
  }

  const staticFor = (groupId: SectionGroupId) =>
    STATIC_SECTIONS.filter((s) => s.group === groupId && (!s.requiresFemale || deceasedGender === "female"))

  // قائمة مُسطَّحة بترتيب كل الأقسام القابلة للتنقّل — تُبنى فرقة بفرقة بنفس ترتيب
  // SECTION_GROUPS (بيانات الفقيد ثم الجنازة والتعزية، فالأقارب، فالقالب) لضمان
  // تطابقها تماماً مع الترتيب المعروض فعلياً في شبكة القائمة — لا تُبنَ من مصفوفة
  // STATIC_SECTIONS الخام مباشرة (ترتيبها الداخلي لا يعكس التجميع البصري بالضرورة).
  //
  // استثناء متعمَّد: "ملء الفراغ"/"نصوص مخصّصة"/"تنسيق التاريخ" (آخر ثلاثة أقسام في
  // فرقة "funeral") تُنقَل هنا إلى ما *بعد* فرقة الأقارب (بطلب صريح) رغم بقائها
  // مُصنَّفة بصرياً تحت "الجنازة والتعزية" في شبكة القائمة نفسها (renderMenu أدناه) —
  // الفصل هنا بين *ترتيب التنقّل التالي/السابق* و*التجميع البصري في القائمة* مقصود.
  const AFTER_RELATIVES_FUNERAL_IDS = new Set(["fill-gap", "custom-texts", "date-format"])
  const funeralSections = staticFor("funeral")
  const funeralBeforeRelatives = funeralSections.filter((s) => !AFTER_RELATIVES_FUNERAL_IDS.has(s.id))
  const funeralAfterRelatives = funeralSections.filter((s) => AFTER_RELATIVES_FUNERAL_IDS.has(s.id))

  const orderedIds: string[] = [
    ...staticFor("deceased").map((s) => `static:${s.id}`),
    ...funeralBeforeRelatives.map((s) => `static:${s.id}`),
    ...relatives.map((g) => `relative:${g.id}`),
    "add-relative",
    // "العائلات" ثابتة مباشرة بعد "إضافة فئة قرابة" بطلب صريح — مُشتقّة تلقائياً من
    // أسماء الأقارب أعلاه (راجع FamiliesField/defaultFamiliesLine)، فمكانها الطبيعي
    // بعد فرقة الأقارب بأكملها لا قبلها.
    ...staticFor("relatives").map((s) => `static:${s.id}`),
    ...funeralAfterRelatives.map((s) => `static:${s.id}`),
    ...staticFor("template").map((s) => `static:${s.id}`),
  ]
  const activeIndex = activeId ? orderedIds.indexOf(activeId) : -1
  const prevId = activeIndex > 0 ? orderedIds[activeIndex - 1] : null
  const nextId = activeIndex >= 0 && activeIndex < orderedIds.length - 1 ? orderedIds[activeIndex + 1] : null

  // "ابدأ هنا" تظهر فقط قبل أول زيارة لأي قسم إطلاقاً؛ بعدها "أنت هنا" تحل محلها
  // على القسم الذي توقّف عنده المستخدم فعلياً (وليس بالضرورة أول قسم في القائمة).
  const badgeFor = (navId: string): "start" | "current" | undefined => {
    if (lastVisitedId) return navId === lastVisitedId ? "current" : undefined
    return navId === FIRST_STEP_NAV_ID ? "start" : undefined
  }

  const renderChip = (navId: string, Icon: ComponentType<LucideProps>, label: string) => {
    const badge = badgeFor(navId)
    return (
      <button key={navId} type="button" className={cn(CHIP_CLASS, badge && "border-2 border-accent bg-accent/10")} onClick={() => goTo(navId)}>
        {badge && (
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold text-white">
            {badge === "start" ? "ابدأ هنا" : "أنت هنا"}
          </span>
        )}
        <Icon size={18} className="text-accent" />
        <span className="line-clamp-2">{label}</span>
      </button>
    )
  }

  const renderMenu = (): ReactNode => (
    <div className="flex flex-col gap-5">
      {SECTION_GROUPS.map((group) => {
        if (group.id === "relatives") {
          return (
            <div key={group.id}>
              <p className="mb-2 text-xs font-bold text-black/50">{group.label}</p>
              <div className="grid grid-cols-4 gap-2.5">
                {relatives.map((g) =>
                  renderChip(
                    `relative:${g.id}`,
                    UserPlus,
                    relativeCategoryLabel(g.categoryKey, deceasedGender, g.members, g.customLabel)
                  )
                )}
                {renderChip("add-relative", UserPlus, "إضافة فئة")}
                {/* "العائلات" — قسم ثابت (لا فئة قرابة قابلة للحذف) يظهر دائماً هنا. */}
                {staticFor("relatives").map((s) => renderChip(`static:${s.id}`, s.icon, s.title))}
              </div>
            </div>
          )
        }
        const sections = staticFor(group.id)
        if (sections.length === 0) return null
        return (
          <div key={group.id}>
            <p className="mb-2 text-xs font-bold text-black/50">{group.label}</p>
            <div className="grid grid-cols-4 gap-2.5">
              {sections.map((s) => renderChip(`static:${s.id}`, s.icon, s.title))}
            </div>
          </div>
        )
      })}
    </div>
  )

  let sheetTitle = "تعديل البيانات"
  let sheetBody: ReactNode = renderMenu()
  let onBack: (() => void) | undefined

  if (activeId === "add-relative") {
    sheetTitle = "إضافة فئة قرابة"
    // onAdded ينقل مباشرة لشاشة الفئة الجديدة فور اختيارها — بدل البقاء على شاشة
    // "إضافة فئة قرابة" فارغة (عطل حقيقي: لم يكن يظهر أي أثر إلا بالنقر يدوياً على
    // "السابق"، لأن الفئة الجديدة تُدرَج في orderedIds قبل "add-relative" مباشرة).
    sheetBody = <AddRelativeCategoryField onAdded={(groupId) => goTo(`relative:${groupId}`)} />
    onBack = backToMenu
  } else if (activeId?.startsWith("static:")) {
    const id = activeId.slice("static:".length)
    const section = STATIC_SECTIONS.find((s) => s.id === id)
    if (section) {
      const Content = section.Content
      sheetTitle = section.title
      sheetBody = <Content />
      onBack = backToMenu
    }
  } else if (activeId?.startsWith("relative:")) {
    const groupId = activeId.slice("relative:".length)
    const group = relatives.find((g) => g.id === groupId)
    if (group) {
      sheetTitle = relativeCategoryLabel(group.categoryKey, deceasedGender, group.members, group.customLabel)
      sheetBody = <GroupCard groupId={groupId} />
      onBack = backToMenu
    }
  }

  // زرا السابق/التالي يظهران فقط داخل قسم مفتوح فعلياً (لا في شاشة القائمة نفسها)
  // — يسمحان بالتنقّل المباشر بين الأقسام المتتالية بلا رجوع للقائمة في كل مرة.
  const sheetFooter =
    activeId !== null ? (
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={!prevId}
          onClick={() => prevId && goTo(prevId)}
          className="text-sm font-medium text-black/55 disabled:opacity-30"
        >
          ← السابق
        </button>
        <button
          type="button"
          disabled={!nextId}
          onClick={() => nextId && goTo(nextId)}
          className="text-sm font-medium text-accent disabled:opacity-30"
        >
          التالي →
        </button>
      </div>
    ) : undefined

  return (
    <div className="flex flex-col gap-4 px-4 py-6 pb-28">
      <div className="w-full overflow-x-hidden overflow-y-auto rounded-lg">
        <ResponsiveCanvasFrame>
          <ObituaryCanvas data={data} />
        </ResponsiveCanvasFrame>
      </div>

      {/* شريط التصدير (PNG/PDF/مشاركة/إعدادات) محذوف عمداً هنا على الجوال — كله
          مكرَّر فعلياً كأيقونات في CreateHeader.tsx أعلى الصفحة (دائماً ظاهرة، بما
          فيها الجوال). زر "تعديل البيانات" العائم هو الزر الوحيد المطلوب هنا. */}

      <button
        type="button"
        onClick={openMenu}
        className="fixed inset-x-0 z-40 mx-auto flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 active:opacity-90"
        style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        <Pencil size={16} />
        تعديل البيانات
      </button>

      <BottomSheet open={sheetOpen} onClose={closeSheet} title={sheetTitle} onBack={onBack} footer={sheetFooter}>
        {sheetBody}
      </BottomSheet>
    </div>
  )
}
