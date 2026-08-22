"use client"

import {
  DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext, arrayMove, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import { FIXED_GENDER_BY_CATEGORY, RELATIVE_CATEGORY_OPTIONS } from "@/lib/obituary/defaults"
import { relativeCategoryLabel } from "@/lib/obituary/grammar"
import { useEditorStore } from "@/store/editorStore"
import type { Person, RelativeCategoryKey } from "@/lib/obituary/types"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Checkbox, Input, Select } from "@/components/ui/Field"

function PersonRow({ groupId, person, fixedGender }: { groupId: string; person: Person; fixedGender?: Person["gender"] }) {
  const updatePerson = useEditorStore((s) => s.updatePerson)
  const removePerson = useEditorStore((s) => s.removePerson)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: person.id })

  const patch = (p: Partial<Person>) => updatePerson(groupId, person.id, p)

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex flex-col gap-2 rounded-lg border border-black/10 bg-white p-3"
    >
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" {...attributes} {...listeners} className="cursor-grab text-black/30 hover:text-black/60">
          <GripVertical size={16} />
        </button>
        <Input placeholder="اللقب" value={person.honorific ?? ""} onChange={(e) => patch({ honorific: e.target.value })} className="w-24 min-w-24" />
        <Input placeholder="الاسم" value={person.name} onChange={(e) => patch({ name: e.target.value })} className="min-w-32 flex-1" />
        {/* محدِّد الجنس يظهر فقط في الفئات المختلطة — فئة ثابتة الجنس (بناته مثلاً) لا تحتاجه */}
        {!fixedGender && (
          <Select value={person.gender} onChange={(e) => patch({ gender: e.target.value as Person["gender"] })} className="w-20 shrink-0">
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </Select>
        )}
        <Checkbox label="متوفى" checked={person.isDeceased} onChange={(e) => patch({ isDeceased: e.target.checked })} className="shrink-0" />
        <button type="button" onClick={() => removePerson(groupId, person.id)} className="shrink-0 text-black/30 hover:text-red-600">
          <Trash2 size={16} />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2 pr-6">
        <Input placeholder="لقب الزوج/ة" value={person.spouseHonorific ?? ""} onChange={(e) => patch({ spouseHonorific: e.target.value })} className="w-24 min-w-24" />
        <Input placeholder="اسم الزوج/ة (اختياري)" value={person.spouseName ?? ""} onChange={(e) => patch({ spouseName: e.target.value || undefined })} className="min-w-32 flex-1" />
        <Checkbox label="الزوج/ة متوفى/ة" checked={person.spouseIsDeceased ?? false} onChange={(e) => patch({ spouseIsDeceased: e.target.checked })} className="shrink-0" />
      </div>
    </div>
  )
}

/** أزرار إضافة فئة قرابة — مُصدَّرة لإعادة استعمالها كقسم جوال مستقل صغير
 * (mobile/sectionRegistry.tsx) بجانب استعمالها أسفل قائمة الفئات في سطح المكتب. */
export function AddRelativeCategoryField() {
  const relatives = useEditorStore((s) => s.data.relatives)
  const addRelativeGroup = useEditorStore((s) => s.addRelativeGroup)
  const deceasedGender = useEditorStore((s) => s.data.deceased.gender)

  const usedKeys = new Set(relatives.map((g) => g.categoryKey))
  const available = RELATIVE_CATEGORY_OPTIONS.filter((o) => o.key === "custom" || !usedKeys.has(o.key))

  return (
    <div className="flex items-center gap-3">
      <Plus size={16} className="shrink-0 text-black/40" />
      <Select
        value=""
        onChange={(e) => {
          if (e.target.value) addRelativeGroup(e.target.value as RelativeCategoryKey)
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
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="mb-3 flex items-center justify-between">
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
        <button type="button" onClick={() => removeRelativeGroup(groupId)} className="text-black/30 hover:text-red-600">
          <Trash2 size={16} />
        </button>
      </div>

      {group.categoryKey === "custom" && (
        <Input
          className="mb-3"
          placeholder="تسمية الفئة المخصّصة"
          value={group.customLabel ?? ""}
          onChange={(e) => updateRelativeGroup(groupId, { customLabel: e.target.value })}
        />
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={group.members.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {group.members.map((m) => (
              <PersonRow key={m.id} groupId={groupId} person={m} fixedGender={fixedGender} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button variant="ghost" size="sm" className="mt-3" onClick={() => addPerson(groupId)}>
        <Plus size={14} /> إضافة اسم
      </Button>
    </Card>
  )
}

export function Step3Relatives() {
  const relatives = useEditorStore((s) => s.data.relatives)
  const reorderRelativeGroups = useEditorStore((s) => s.reorderRelativeGroups)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const onGroupsDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIndex = relatives.findIndex((g) => g.id === active.id)
    const newIndex = relatives.findIndex((g) => g.id === over.id)
    reorderRelativeGroups(arrayMove(relatives, oldIndex, newIndex))
  }

  return (
    <div className="flex flex-col gap-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onGroupsDragEnd}>
        <SortableContext items={relatives.map((g) => g.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {relatives.map((g) => (
              <GroupCard key={g.id} groupId={g.id} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* اختيار فئة من اللائحة يضيفها فوراً — بلا زر منفصل — تسريعاً للعملية.
          إن لم يرغب المستخدم بما اختاره، يحذفه بسهولة عبر أيقونة السلة في بطاقة الفئة. */}
      <Card>
        <AddRelativeCategoryField />
      </Card>
    </div>
  )
}
