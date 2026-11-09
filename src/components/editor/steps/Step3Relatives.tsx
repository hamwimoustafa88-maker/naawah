"use client"

import { useState } from "react"
import {
  DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext, arrayMove, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ClipboardList, GripVertical, Plus, Trash2 } from "lucide-react"
import {
  CATEGORY_REQUIRES_DECEASED_GENDER, FIXED_GENDER_BY_CATEGORY, RELATIVE_CATEGORY_OPTIONS, SINGLE_HIDDEN_RELATIVE_CATEGORIES,
  honorificForGender,
} from "@/lib/obituary/defaults"
import { parseBulkNames } from "@/lib/obituary/bulkNames"
import { relativeCategoryLabel } from "@/lib/obituary/grammar"
import { defaultFamiliesLine, FAMILIES_LINE_PREFIX, visibleRelativeGroups } from "@/lib/obituary/render"
import { useEditorStore } from "@/store/editorStore"
import type { Person, RelativeCategoryKey } from "@/lib/obituary/types"
import { CustomTextOverride } from "@/components/editor/CustomTextOverride"
import { HonorificSelect } from "@/components/editor/HonorificSelect"
import { Card, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Checkbox, Input, Select, Textarea, Toggle } from "@/components/ui/Field"

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

/** "متوفى" أو "متوفاة" بجنس الشخص نفسه — بلا صيغة "مذكر/مؤنث" مدمَجة، بطلب صريح. */
function deceasedWordFor(gender: Person["gender"]): "متوفى" | "متوفاة" {
  return gender === "male" ? "متوفى" : "متوفاة"
}

/**
 * كلمتا "الزوج/ة" (اسم/لقب الزوج-ة) و"متوفى/ة" الخاصتَين بالزوج-ة نفسه/ها —
 * بجنس *الزوج المُدخَل*، أي عكس جنس الشخص صاحب السطر (الأب رجل فزوجه امرأة
 * "زوجة"، والأم امرأة فزوجها رجل "زوج") — لا بجنس الشخص نفسه. بلا صيغة مدمَجة،
 * بطلب صريح: "أريد كل جنس أن يكون له زر خاص به بدون عبارة (مذكر/مؤنث)".
 */
function spouseTerms(personGender: Person["gender"]): { gender: Person["gender"]; noun: "زوجة" | "زوج"; deceasedWord: "متوفاة" | "متوفى" } {
  return personGender === "male"
    ? { gender: "female", noun: "زوجة", deceasedWord: "متوفاة" }
    : { gender: "male", noun: "زوج", deceasedWord: "متوفى" }
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
  const spouse = spouseTerms(person.gender)

  // السطر الثاني (لقب/اسم الزوج/ة) مطويّ افتراضياً — تخفيفاً للتفاصيل الظاهرة دفعة
  // واحدة لكل قريب. يبدأ مفتوحاً فقط إن كانت بيانات زوج/ة محفوظة سلفاً (بيانات
  // مستوردة أو مُدخَلة قبل هذا التعديل)؛ إلغاء التفعيل يطوي السطر فقط ولا يمسح قيمه.
  const [showSpouse, setShowSpouse] = useState(allowSpouse && Boolean(person.spouseName || person.spouseHonorific))

  const setGender = (gender: Person["gender"]) =>
    patch({
      gender,
      honorific: honorificForGender(person.honorific, gender),
      spouseHonorific: honorificForGender(person.spouseHonorific, spouseTerms(gender).gender),
    })

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
        <HonorificSelect
          value={person.honorific}
          gender={person.gender}
          onChange={(honorific) => patch({ honorific })}
          emptyLabel="اللقب"
          className="w-28 shrink-0"
          customClassName="w-24 min-w-24"
        />
        <Input placeholder={hints?.name ?? "الاسم"} value={person.name} onChange={(e) => patch({ name: e.target.value })} className="min-w-32 flex-1" />
        {/* محدِّد الجنس يظهر فقط في الفئات المختلطة — فئة ثابتة الجنس (بناته مثلاً) لا تحتاجه.
            "الوالدين" مستثناة أيضاً بطلب صريح رغم كونها فئة مختلطة تقنياً — عضواها الاثنان
            محسومان دائماً (أب ذكر/أم أنثى) عند الإنشاء، فلا داعي لمحدِّد جنس ظاهر. */}
        {!fixedGender && !isParentsCategory && (
          <Select value={person.gender} onChange={(e) => setGender(e.target.value as Person["gender"])} className="w-20 shrink-0">
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </Select>
        )}
        <Toggle label={deceasedWordFor(person.gender)} checked={person.isDeceased} onChange={(checked) => patch({ isDeceased: checked })} className="shrink-0" />
        {allowSpouse && (
          <Toggle label={spouse.noun} checked={showSpouse} onChange={setShowSpouse} className="shrink-0" />
        )}
        <button type="button" onClick={() => removePerson(groupId, person.id)} className="shrink-0 text-black/30 hover:text-red-600">
          <Trash2 size={16} />
        </button>
      </div>
      {allowSpouse && showSpouse && (
        <div className="flex flex-wrap items-center gap-1.5 pr-6">
          <HonorificSelect
            value={person.spouseHonorific}
            gender={spouse.gender}
            onChange={(spouseHonorific) => patch({ spouseHonorific })}
            emptyLabel={`لقب ${spouse.noun}`}
            className="w-28 shrink-0"
            customClassName="w-24 min-w-24"
          />
          <Input
            placeholder={hints?.spouse ?? `اسم ${spouse.noun} (اختياري)`}
            value={person.spouseName ?? ""}
            onChange={(e) => patch({ spouseName: e.target.value || undefined })}
            className="min-w-32 flex-1"
          />
          <Toggle label={`${spouse.noun} ${spouse.deceasedWord}`} checked={person.spouseIsDeceased ?? false} onChange={(checked) => patch({ spouseIsDeceased: checked })} className="shrink-0" />
          {person.gender === "female" && person.spouseIsDeceased && (
            <Select
              value={person.widowStyle ?? "زوجة"}
              onChange={(e) => patch({ widowStyle: e.target.value as NonNullable<Person["widowStyle"]> })}
              className="w-36 shrink-0"
              aria-label="صيغة ذكر الزوج المتوفى"
            >
              <option value="زوجة">زوجة المرحوم</option>
              <option value="أرملة">أرملة المرحوم</option>
            </Select>
          )}
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
 * أعلاه (بلا تكرار) بدل الإدخال اليدوي البحت — راجع defaultFamiliesLine في
 * render.ts. يبقى قابلاً للتخصيص الحرّ عبر نفس آلية "نصوص مخصّصة" المستعملة لبقية
 * الجمل المحسوبة (CustomTextOverride).
 */
export function FamiliesField() {
  const data = useEditorStore((s) => s.data)
  const updateCustomText = useEditorStore((s) => s.updateCustomText)
  const updateFuneral = useEditorStore((s) => s.updateFuneral)
  const { includeAreaResidents, areaResidentsName } = data.funeral

  return (
    <div className="flex flex-col gap-3">
      <CustomTextOverride
        label="العائلات"
        computedDefault={defaultFamiliesLine(data) || FAMILIES_LINE_PREFIX}
        value={data.customTexts?.familiesLine}
        onChange={(v) => updateCustomText("familiesLine", v)}
      />
      <Checkbox
        label="إضافة «وعموم أهالي…» في آخر الأسماء"
        checked={includeAreaResidents ?? false}
        onChange={(e) => updateFuneral({ includeAreaResidents: e.target.checked })}
      />
      {includeAreaResidents && (
        <Input
          aria-label="اسم المنطقة"
          placeholder="اسم المنطقة، مثال: شحيم"
          value={areaResidentsName ?? ""}
          onChange={(e) => updateFuneral({ areaResidentsName: e.target.value })}
        />
      )}
    </div>
  )
}

/** صندوق لصق عدة أسماء — يُطوى بعد الإضافة، ويبقى النص إن لم يُستخرج منه أي اسم. */
function BulkNamesBox({ groupId, onDone }: { groupId: string; onDone: () => void }) {
  const addPersons = useEditorStore((s) => s.addPersons)
  const [text, setText] = useState("")

  const submit = () => {
    const entries = parseBulkNames(text)
    if (entries.length === 0) return
    addPersons(groupId, entries)
    onDone()
  }

  return (
    <div className="mb-2 flex flex-col gap-1.5">
      <Textarea
        aria-label="أسماء متعددة"
        rows={4}
        placeholder={"اكتب كل اسم في سطر أو افصل بفاصلة\nاكتب «المرحوم» قبل اسم المتوفى"}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={submit} disabled={text.trim() === ""} size="sm" className="self-start">
        إضافة الأسماء
      </Button>
    </div>
  )
}

export function GroupCard({ groupId }: { groupId: string }) {
  const group = useEditorStore((s) => s.data.relatives.find((g) => g.id === groupId))
  const deceasedGender = useEditorStore((s) => s.data.deceased.gender)
  const addPerson = useEditorStore((s) => s.addPerson)
  const [showBulk, setShowBulk] = useState(false)
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
          {group.categoryKey !== "parents" && (
            <button
              type="button"
              onClick={() => setShowBulk((open) => !open)}
              aria-label="لصق عدة أسماء"
              aria-expanded={showBulk}
              title="لصق عدة أسماء"
              className="text-black/30 hover:text-accent"
            >
              <ClipboardList size={16} />
            </button>
          )}
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

      {showBulk && <BulkNamesBox groupId={groupId} onDone={() => setShowBulk(false)} />}

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
