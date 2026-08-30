"use client"

import { useState } from "react"
import {
  DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext, arrayMove, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import {
  CATEGORY_REQUIRES_DECEASED_GENDER, FIXED_GENDER_BY_CATEGORY, RELATIVE_CATEGORY_OPTIONS, SINGLE_HIDDEN_RELATIVE_CATEGORIES,
} from "@/lib/obituary/defaults"
import { relativeCategoryLabel } from "@/lib/obituary/grammar"
import { defaultFamiliesLine, visibleRelativeGroups } from "@/lib/obituary/render"
import { useEditorStore } from "@/store/editorStore"
import type { Person, RelativeCategoryKey } from "@/lib/obituary/types"
import { CustomTextOverride } from "@/components/editor/CustomTextOverride"
import { Card, CardTitle } from "@/components/ui/Card"
import { Checkbox, Input, Select } from "@/components/ui/Field"

/**
 * تلميحا مكان (placeholder) — لا سطر منفصل — يظهران فقط في فئة "الوالدين"
 * (categoryKey === "parents") — عضواها الثابتان (أب/أم) يُفرَّقان بجنس العضو نفسه
 * لا بالفهرس (المستخدم قد يقلب ترتيبهما بالسحب). hint.spouse يحلّ محلّ placeholder
 * حقل اسم الزوج/ة الافتراضي، موضّحاً أن هذا السطر خاص بزواج ثانٍ فعلي (زوجة أب
 * أخرى/زوج أم آخر)، لا بزوج/ة الوالد الأصلي (غير مطلوب ذكره أصلاً).
 */
function parentHints(gender: Person["gender"]): { name: string; spouse: string } {
  return gender === "male"
    ? { name: "اسم الأب", spouse: "زوجة الأب — في حال كان متزوجاً من امرأة ثانية" }
    : { name: "اسم الأم", spouse: "زوج الأم — في حال كانت متزوجة من رجل آخر" }
}

function PersonRow({
  groupId, person, fixedGender, isParentsCategory, allowSpouse = true,
}: {
  groupId: string
  person: Person
  fixedGender?: Person["gender"]
  isParentsCategory?: boolean
  /**
   * "زوجاته"/"زوجها" استثناء: عضو هذه الفئة هو زوج/ة الفقيد نفسه، فزوج/ته هو
   * الفقيد ذاته — لا معنى لحقل "اسم الزوج/ة" هنا إطلاقاً. GroupCard يمرّر false
   * حصراً لهاتين الفئتين، فتختفي خانة "زوج/ة" والسطر الثاني بالكامل معها.
   */
  allowSpouse?: boolean
}) {
  const updatePerson = useEditorStore((s) => s.updatePerson)
  const removePerson = useEditorStore((s) => s.removePerson)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: person.id })

  const patch = (p: Partial<Person>) => updatePerson(groupId, person.id, p)
  const hints = isParentsCategory ? parentHints(person.gender) : undefined

  // السطر الثاني (لقب/اسم الزوج/ة) مطويّ افتراضياً — تخفيفاً للتفاصيل الظاهرة دفعة
  // واحدة لكل قريب. يبدأ مفتوحاً فقط إن كانت بيانات زوج/ة محفوظة سلفاً (بيانات
  // مستوردة أو مُدخَلة قبل هذا التعديل)؛ إلغاء التفعيل يطوي السطر فقط ولا يمسح قيمه.
  const [showSpouse, setShowSpouse] = useState(allowSpouse && Boolean(person.spouseName || person.spouseHonorific))

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex flex-col gap-1.5 rounded-lg border border-black/10 bg-white p-2.5"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <button type="button" {...attributes} {...listeners} className="cursor-grab text-black/30 hover:text-black/60">
          <GripVertical size={16} />
        </button>
        <Input placeholder="اللقب" value={person.honorific ?? ""} onChange={(e) => patch({ honorific: e.target.value })} className="w-24 min-w-24" />
        <Input placeholder={hints?.name ?? "الاسم"} value={person.name} onChange={(e) => patch({ name: e.target.value })} className="min-w-32 flex-1" />
        {/* محدِّد الجنس يظهر فقط في الفئات المختلطة — فئة ثابتة الجنس (بناته مثلاً) لا تحتاجه */}
        {!fixedGender && (
          <Select value={person.gender} onChange={(e) => patch({ gender: e.target.value as Person["gender"] })} className="w-20 shrink-0">
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </Select>
        )}
        <Checkbox label="متوفى" checked={person.isDeceased} onChange={(e) => patch({ isDeceased: e.target.checked })} className="shrink-0" />
        {allowSpouse && (
          <Checkbox label="زوج/ة" checked={showSpouse} onChange={(e) => setShowSpouse(e.target.checked)} className="shrink-0" />
        )}
        <button type="button" onClick={() => removePerson(groupId, person.id)} className="shrink-0 text-black/30 hover:text-red-600">
          <Trash2 size={16} />
        </button>
      </div>
      {allowSpouse && showSpouse && (
        <div className="flex flex-wrap items-center gap-1.5 pr-6">
          <Input placeholder="لقب الزوج/ة" value={person.spouseHonorific ?? ""} onChange={(e) => patch({ spouseHonorific: e.target.value })} className="w-24 min-w-24" />
          <Input
            placeholder={hints?.spouse ?? "اسم الزوج/ة (اختياري)"}
            value={person.spouseName ?? ""}
            onChange={(e) => patch({ spouseName: e.target.value || undefined })}
            className="min-w-32 flex-1"
          />
          <Checkbox label="الزوج/ة متوفى/ة" checked={person.spouseIsDeceased ?? false} onChange={(e) => patch({ spouseIsDeceased: e.target.checked })} className="shrink-0" />
        </div>
      )}
    </div>
  )
}

/**
 * أزرار إضافة فئة قرابة — مُصدَّرة لإعادة استعمالها كقسم جوال مستقل صغير
 * (mobile/sectionRegistry.tsx) بجانب استعمالها أسفل قائمة الفئات في سطح المكتب.
 * `onAdded` اختياري: يُستدعى بـ id الفئة الجديدة فور إضافتها — تستهلكه واجهة
 * الجوال (MobileEditorView.tsx) للتنقّل مباشرة إلى شاشة الفئة الجديدة بدل البقاء
 * على شاشة "إضافة فئة قرابة" فارغة (عطل حقيقي: لم يكن يظهر أي أثر للإضافة إلا
 * بالنقر يدوياً على "السابق"). سطح المكتب لا يمرّر هذا الـprop، فيبقى سلوكه كما هو.
 */
export function AddRelativeCategoryField({ onAdded }: { onAdded?: (groupId: string) => void } = {}) {
  const relatives = useEditorStore((s) => s.data.relatives)
  const addRelativeGroup = useEditorStore((s) => s.addRelativeGroup)
  const deceasedGender = useEditorStore((s) => s.data.deceased.gender)
  const isSingle = useEditorStore((s) => s.data.deceased.isSingle ?? false)

  const usedKeys = new Set(relatives.map((g) => g.categoryKey))
  const available = RELATIVE_CATEGORY_OPTIONS.filter((o) => {
    if (o.key !== "custom" && usedKeys.has(o.key)) return false
    if (isSingle && SINGLE_HIDDEN_RELATIVE_CATEGORIES.includes(o.key)) return false
    const requiredGender = CATEGORY_REQUIRES_DECEASED_GENDER[o.key]
    return !requiredGender || requiredGender === deceasedGender
  })

  return (
    <div className="flex items-center gap-3">
      <Plus size={16} className="shrink-0 text-black/40" />
      <Select
        value=""
        onChange={(e) => {
          if (!e.target.value) return
          const groupId = addRelativeGroup(e.target.value as RelativeCategoryKey)
          onAdded?.(groupId)
        }}
        className="flex-1"
      >
        <option value="">إضافة فئة قرابة…</option>
        {available.map((o) => (
          <option key={o.key} value={o.key}>
            {deceasedGender === "male" ? o.labelMale : o.labelFemale}
          </option>
        ))}
      </Select>
    </div>
  )
}

/**
 * سطر "العائلات" — انتقل إلى هنا من (١. بيانات الفقيد) بطلب صريح ليظهر مباشرة بعد
 * (إضافة فئة قرابة)، وصار مُشتقّاً تلقائياً من أسماء عائلة كل الأقارب المُدخَلين
 * أعلاه (آخر كلمة من كل اسم، بلا تكرار) بدل الإدخال اليدوي البحت — راجع
 * defaultFamiliesLine في render.ts. يبقى قابلاً للتخصيص الحرّ عبر نفس آلية
 * "نصوص مخصّصة" المستعملة لبقية الجمل المحسوبة (CustomTextOverride).
 */
export function FamiliesField() {
  const data = useEditorStore((s) => s.data)
  const updateCustomText = useEditorStore((s) => s.updateCustomText)

  return (
    <CustomTextOverride
      label="العائلات"
      computedDefault={defaultFamiliesLine(data) || "الراضون بقضاء الله وقدره: —"}
      value={data.customTexts?.familiesLine}
      onChange={(v) => updateCustomText("familiesLine", v)}
    />
  )
}

export function GroupCard({ groupId }: { groupId: string }) {
  const group = useEditorStore((s) => s.data.relatives.find((g) => g.id === groupId))
  const deceasedGender = useEditorStore((s) => s.data.deceased.gender)
  const addPerson = useEditorStore((s) => s.addPerson)
  const removeRelativeGroup = useEditorStore((s) => s.removeRelativeGroup)
  const updateRelativeGroup = useEditorStore((s) => s.updateRelativeGroup)
  const reorderPersons = useEditorStore((s) => s.reorderPersons)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: groupId })

  if (!group) return null
  const fixedGender = FIXED_GENDER_BY_CATEGORY[group.categoryKey]

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIndex = group.members.findIndex((m) => m.id === active.id)
    const newIndex = group.members.findIndex((m) => m.id === over.id)
    reorderPersons(groupId, arrayMove(group.members, oldIndex, newIndex))
  }

  return (
    <Card
      ref={setNodeRef}
      className="p-3"
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab text-black/30 hover:text-black/60"
            aria-label="ترتيب فئة القرابة"
          >
            <GripVertical size={16} />
          </button>
          <span className="text-sm font-bold">
            {relativeCategoryLabel(group.categoryKey, deceasedGender, group.members, group.customLabel)}
          </span>
        </div>
        {/* "إضافة اسم" انتقل إلى هنا (أيقونة فقط) بجانب حذف الفئة — بدل زر نصّي
            منفصل أسفل البطاقة، تجميعاً لأزرار الفعل في زاوية واحدة وتخفيفاً للتفاصيل. */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => addPerson(groupId)}
            aria-label="إضافة اسم"
            title="إضافة اسم"
            className="text-black/30 hover:text-accent"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            onClick={() => removeRelativeGroup(groupId)}
            aria-label="حذف فئة القرابة"
            title="حذف فئة القرابة"
            className="text-black/30 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {group.categoryKey === "custom" && (
        <Input
          className="mb-2"
          placeholder="تسمية الفئة المخصّصة"
          value={group.customLabel ?? ""}
          onChange={(e) => updateRelativeGroup(groupId, { customLabel: e.target.value })}
        />
      )}

      {/*
        id صريح وثابت (لا افتراضي) — بلا هذا، @dnd-kit/core يولّد
        aria-describedby ("DndDescribedBy-N") عبر عدّاد على مستوى الوحدة (module-level)
        يتزايد مع كل DndContext يُركَّب؛ عدّاد الخادم (طويل العمر عبر طلبات/إعادات
        تحميل ساخنة كثيرة أثناء dev) وعدّاد المتصفح (يبدأ من صفر عند كل تحميل صفحة)
        لا يتطابقان أبداً إلا صدفة — عطل hydration mismatch حقيقي واجهناه هنا تحديداً
        (بطاقة قرابة واحدة من عدة بطاقات، كل بطاقة تُركِّب DndContext خاصاً بها).
        تمرير id ثابت (هنا مشتقّ من groupId نفسه — نفس القيمة حتماً في كل بيئة لأنه
        جزء من بيانات المتجر لا رقماً مولَّداً وقت العرض) يجعل useUniqueId يتجاوز
        العدّاد كليّاً (dnd-kit/core: useUniqueId(prefix, value) يُعيد value مباشرة
        إن وُجدت). راجع نفس المنطق على DndContext الخارجي أسفل (إعادة ترتيب الفئات).
      */}
      <DndContext id={`relatives-dnd-${groupId}`} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={group.members.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1.5">
            {group.members.map((m) => (
              <PersonRow
                key={m.id}
                groupId={groupId}
                person={m}
                fixedGender={fixedGender}
                isParentsCategory={group.categoryKey === "parents"}
                allowSpouse={group.categoryKey !== "wives" && group.categoryKey !== "husband"}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Card>
  )
}

export function Step3Relatives() {
  const data = useEditorStore((s) => s.data)
  const reorderRelativeGroups = useEditorStore((s) => s.reorderRelativeGroups)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  // إعادة الترتيب تعمل دائماً على المصفوفة الكاملة (data.relatives) — لا على
  // النسخة المرئية وحدها — حتى لا تُفقَد فئات مخفيّة بخيار "عازب/ة" (تُستبدَل
  // relatives بالكامل في reorderRelativeGroups، فتمريرها مبتورة يحذفها فعلياً).
  // المعروض فعلياً (visibleGroups) نسخة مُصفّاة للعرض فقط.
  const relatives = data.relatives
  const visibleGroups = visibleRelativeGroups(data)

  const onGroupsDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIndex = relatives.findIndex((g) => g.id === active.id)
    const newIndex = relatives.findIndex((g) => g.id === over.id)
    reorderRelativeGroups(arrayMove(relatives, oldIndex, newIndex))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* id ثابت — نفس سبب id على DndContext داخل GroupCard أعلاه (تفادي عدّاد
          aria-describedby المُولِّد لعطل hydration mismatch). نسخة واحدة هنا فقط
          (لا تتكرر لكل فئة)، فسلسلة حرفية ثابتة تكفي بلا اشتقاق من أي شيء. */}
      <DndContext id="relatives-groups-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={onGroupsDragEnd}>
        <SortableContext items={visibleGroups.map((g) => g.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2.5">
            {visibleGroups.map((g) => (
              <GroupCard key={g.id} groupId={g.id} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* اختيار فئة من اللائحة يضيفها فوراً — بلا زر منفصل — تسريعاً للعملية.
          إن لم يرغب المستخدم بما اختاره، يحذفه بسهولة عبر أيقونة السلة في بطاقة الفئة.
          خلفية مميّزة (لون التمييز الفاتح) عمداً — بطلب صريح: تبرز كبطاقة "فعل"
          مختلفة عن بطاقات الفئات (بيضاء) بدل الاندماج بصرياً معها. */}
      <Card className="border-accent/30 bg-accent/5 p-3">
        <AddRelativeCategoryField />
      </Card>

      {/* "العائلات" — بعد إضافة فئة القرابة مباشرة بطلب صريح، مُشتقّة تلقائياً من الأقارب أعلاه. */}
      <Card>
        <CardTitle>العائلات</CardTitle>
        <FamiliesField />
      </Card>
    </div>
  )
}
