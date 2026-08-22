"use client"

// كل قسم هنا مُصدَّر (export) كمكوّن مستقل بجانب استعماله في التركيبة الافتراضية
// أسفل الملف (Step1Deceased لسطح المكتب) — نفس الحقول تُعاد استعمالها حرفياً في
// أقسام الجوال الصغيرة (mobile/sectionRegistry.tsx) بلا أي تكرار للمنطق أو الحقول.

import { ARAB_COUNTRIES, honorificsFor, QURAN_VERSES, todayISO } from "@/lib/obituary/defaults"
import { formatDualDate } from "@/lib/obituary/hijri"
import { useEditorStore } from "@/store/editorStore"
import { Checkbox, FieldGroup, Input, Select } from "@/components/ui/Field"
import { Card, CardTitle } from "@/components/ui/Card"
import { PhotoUpload } from "@/components/editor/PhotoUpload"

export function IdentityFields() {
  const deceased = useEditorStore((s) => s.data.deceased)
  const update = useEditorStore((s) => s.updateDeceased)

  return (
    <div className="grid grid-cols-2 gap-4">
      <FieldGroup label="الجنس">
        <div className="flex gap-4 pt-1.5">
          <label className="flex items-center gap-1.5 text-sm">
            <input type="radio" checked={deceased.gender === "male"} onChange={() => update({ gender: "male" })} />
            ذكر
          </label>
          <label className="flex items-center gap-1.5 text-sm">
            <input type="radio" checked={deceased.gender === "female"} onChange={() => update({ gender: "female" })} />
            أنثى
          </label>
        </div>
      </FieldGroup>

      <FieldGroup label="اللقب / الصفة">
        <Input
          list="honorifics"
          value={deceased.honorific ?? ""}
          onChange={(e) => update({ honorific: e.target.value })}
          placeholder={deceased.gender === "male" ? "الحاج، الدكتور…" : "الحاجة، الدكتورة…"}
        />
        {/* قائمة الألقاب تتغيّر مع الجنس — لا يظهر لقب مؤنّث لذكر أو العكس */}
        <datalist id="honorifics">
          {honorificsFor(deceased.gender).map((h) => (
            <option key={h} value={h} />
          ))}
        </datalist>
      </FieldGroup>

      <div className="col-span-2">
        <FieldGroup label="الاسم الثلاثي/الرباعي">
          <Input value={deceased.name} onChange={(e) => update({ name: e.target.value })} placeholder="محمود محمد شهاب" />
        </FieldGroup>
      </div>

      <div className="col-span-2">
        <FieldGroup label="العائلات" hint="مثال: آل شهاب وحكيم ونعوس">
          <Input value={deceased.families} onChange={(e) => update({ families: e.target.value })} />
        </FieldGroup>
      </div>
    </div>
  )
}

export function MarhoomFields() {
  const deceased = useEditorStore((s) => s.data.deceased)
  const update = useEditorStore((s) => s.updateDeceased)

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className={deceased.marhoomStyle === "custom" ? "col-span-1" : "col-span-2"}>
        <FieldGroup label="عبارة الترحّم" hint="تظهر مباشرة فوق اسم الفقيد">
          <Select
            value={deceased.marhoomStyle ?? "marhoom"}
            onChange={(e) => update({ marhoomStyle: e.target.value as NonNullable<typeof deceased.marhoomStyle> })}
          >
            <option value="marhoom">{deceased.gender === "male" ? "المرحوم" : "المرحومة"}</option>
            <option value="shaheed">{deceased.gender === "male" ? "الشهيد" : "الشهيدة"}</option>
            <option value="custom">أخرى (نص مخصّص)</option>
          </Select>
        </FieldGroup>
      </div>
      {deceased.marhoomStyle === "custom" && (
        <FieldGroup label="النص المخصّص">
          <Input
            value={deceased.marhoomCustomText ?? ""}
            onChange={(e) => update({ marhoomCustomText: e.target.value })}
            placeholder="مثال: الفقيد الغالي"
          />
        </FieldGroup>
      )}
    </div>
  )
}

export function DeathDateFields() {
  const deceased = useEditorStore((s) => s.data.deceased)
  const format = useEditorStore((s) => s.data.format)
  const update = useEditorStore((s) => s.updateDeceased)

  const hijriDisplay = deceased.deathDateISO
    ? formatDualDate(deceased.deathDateISO, {
      hijriOffsetDays: deceased.hijriOffsetDays,
      order: "hijri-first",
      numerals: format.numerals,
      months: format.months,
    }).split("، الموافق")[0] // السطر الهجري فقط، بلا الميلادي المكرَّر هنا
    : null

  return (
    <div className="grid grid-cols-2 gap-4">
      <FieldGroup label="تاريخ الوفاة" hint="فارغ افتراضياً — انقر على الحقل ليُملأ بتاريخ اليوم مباشرة">
        <Input
          type="date"
          value={deceased.deathDateISO}
          onFocus={() => {
            if (!deceased.deathDateISO) update({ deathDateISO: todayISO() })
          }}
          onChange={(e) => update({ deathDateISO: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup label="التاريخ الهجري">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-9 w-9 shrink-0 rounded-md border border-black/15 hover:bg-black/5"
            onClick={() => update({ hijriOffsetDays: deceased.hijriOffsetDays - 1 })}
            aria-label="تأخير يوم"
          >
            −
          </button>
          <div className="flex-1 rounded-lg border border-black/15 bg-white px-3 py-2 text-center text-sm">
            {hijriDisplay ?? "—"}
          </div>
          <button
            type="button"
            className="h-9 w-9 shrink-0 rounded-md border border-black/15 hover:bg-black/5"
            onClick={() => update({ hijriOffsetDays: deceased.hijriOffsetDays + 1 })}
            aria-label="تقديم يوم"
          >
            +
          </button>
        </div>
        <p className="mt-1 text-xs text-black/45">لضبط اختلاف الرؤية ±يوم</p>
      </FieldGroup>

      {/* حقل "بلد الوفاة" مخفيّ من الواجهة بطلب صريح — القيمة الافتراضية (createEmptyData)
          تبقى محفوظة في البيانات لأغراض الإحصاءات المجهولة فقط، بلا واجهة تعديل. */}

      <div className="col-span-2">
        <FieldGroup label="مكان وفاة (اختياري)" hint="مثال: كاليفورنيا ← يظهر «المتوفي/المتوفاة في كاليفورنيا»">
          <Input value={deceased.deathPlaceNote ?? ""} onChange={(e) => update({ deathPlaceNote: e.target.value })} />
        </FieldGroup>
      </div>
    </div>
  )
}

export function BirthInfoFields() {
  const deceased = useEditorStore((s) => s.data.deceased)
  const update = useEditorStore((s) => s.updateDeceased)

  return (
    <div className="flex flex-col gap-4">
      <Checkbox
        label="إظهار معلومات الميلاد في النعوة (بلد الأصل وتاريخ الميلاد)"
        checked={deceased.showBirthInfo ?? false}
        onChange={(e) => update({ showBirthInfo: e.target.checked })}
      />

      {deceased.showBirthInfo && (
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="تاريخ الميلاد">
            <Input type="date" value={deceased.birthDateISO ?? ""} onChange={(e) => update({ birthDateISO: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="بلد الأصل">
            <Select value={deceased.birthCountry ?? ""} onChange={(e) => update({ birthCountry: e.target.value })}>
              <option value="">—</option>
              {ARAB_COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </FieldGroup>
        </div>
      )}
    </div>
  )
}

export function SpouseFields() {
  const deceased = useEditorStore((s) => s.data.deceased)
  const update = useEditorStore((s) => s.updateDeceased)

  return (
    <div className="grid grid-cols-2 gap-4">
      <FieldGroup label="لقب الزوج">
        <Input
          list="honorifics"
          value={deceased.spouseHonorific ?? ""}
          onChange={(e) => update({ spouseHonorific: e.target.value })}
          placeholder="الحاج، الدكتور…"
        />
      </FieldGroup>
      <FieldGroup label="اسم الزوج">
        <Input
          value={deceased.spouseName ?? ""}
          onChange={(e) => update({ spouseName: e.target.value })}
          placeholder="يحيى زكريا عيتاني"
        />
      </FieldGroup>
      <FieldGroup label="أسلوب سطر الهوية">
        <Select
          value={deceased.widowStyle ?? "زوجة"}
          onChange={(e) => update({ widowStyle: e.target.value as NonNullable<typeof deceased.widowStyle> })}
        >
          <option value="زوجة">زوجة المرحوم</option>
          <option value="أرملة">أرملة المرحوم</option>
          <option value="حرم المغفور له">حرم المغفور له</option>
        </Select>
      </FieldGroup>
      <div className="flex items-end pb-2">
        <Checkbox
          label="الزوج متوفٍّ"
          checked={deceased.spouseIsDeceased ?? false}
          onChange={(e) => update({ spouseIsDeceased: e.target.checked })}
        />
      </div>
    </div>
  )
}

/** أقصى/أدنى تكبير للمخطوطات القرآنية: درجتان (٪١٠ لكل درجة) في أي من الاتجاهين. */
const CALLIGRAPHY_SCALE_MIN = 0.8
const CALLIGRAPHY_SCALE_MAX = 1.2
const CALLIGRAPHY_SCALE_STEP = 0.1

/** زرا تكبير/تصغير صغيران لمخطوطة قرآنية واحدة — يظهران فقط أثناء عرضها فعلياً. */
function CalligraphyScaleStepper({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const clamp = (v: number) => Math.min(CALLIGRAPHY_SCALE_MAX, Math.max(CALLIGRAPHY_SCALE_MIN, +v.toFixed(2)))
  return (
    <div className="flex items-center gap-1" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(clamp(value - CALLIGRAPHY_SCALE_STEP))}
        disabled={value <= CALLIGRAPHY_SCALE_MIN}
        aria-label={`تصغير ${label}`}
        className="h-7 w-7 shrink-0 rounded-md border border-black/15 text-sm hover:bg-black/5 disabled:opacity-30"
      >
        −
      </button>
      <span className="w-11 shrink-0 text-center text-xs tabular-nums text-black/60">{Math.round(value * 100)}%</span>
      <button
        type="button"
        onClick={() => onChange(clamp(value + CALLIGRAPHY_SCALE_STEP))}
        disabled={value >= CALLIGRAPHY_SCALE_MAX}
        aria-label={`تكبير ${label}`}
        className="h-7 w-7 shrink-0 rounded-md border border-black/15 text-sm hover:bg-black/5 disabled:opacity-30"
      >
        +
      </button>
    </div>
  )
}

export function QuranFields() {
  const deceased = useEditorStore((s) => s.data.deceased)
  const update = useEditorStore((s) => s.updateDeceased)

  return (
    <div className="flex flex-col gap-3">
      <FieldGroup label="الآية / العبارة أعلى النعوة">
        <div className="flex items-center gap-2">
          <Select
            className="flex-1"
            value={deceased.quranVerseId ?? ""}
            onChange={(e) => update({ quranVerseId: e.target.value || undefined })}
          >
            <option value="">بلا</option>
            {QURAN_VERSES.map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </Select>
          {deceased.quranVerseId && (
            <CalligraphyScaleStepper
              label="المخطوطة"
              value={deceased.quranVerseScale ?? 1}
              onChange={(v) => update({ quranVerseScale: v })}
            />
          )}
        </div>
      </FieldGroup>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="flex items-center gap-2">
          <Checkbox label="إظهار البسملة" checked={deceased.hasBasmala} onChange={(e) => update({ hasBasmala: e.target.checked })} />
          {deceased.hasBasmala && (
            <CalligraphyScaleStepper label="البسملة" value={deceased.basmalaScale ?? 1} onChange={(v) => update({ basmalaScale: v })} />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            label="إظهار «إنّا لله وإنّا إليه راجعون»"
            checked={deceased.hasInnaLillah}
            onChange={(e) => update({ hasInnaLillah: e.target.checked })}
          />
          {deceased.hasInnaLillah && (
            <CalligraphyScaleStepper
              label="إنّا لله وإنّا إليه راجعون"
              value={deceased.innaLillahScale ?? 1}
              onChange={(v) => update({ innaLillahScale: v })}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export function Step1Deceased() {
  const deceasedGender = useEditorStore((s) => s.data.deceased.gender)

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardTitle>بيانات الفقيد</CardTitle>
        <div className="flex flex-col gap-4">
          <IdentityFields />
          <MarhoomFields />
          <DeathDateFields />
          <div className="border-t border-black/10 pt-4">
            <BirthInfoFields />
          </div>
          <div className="border-t border-black/10 pt-4">
            <PhotoUpload />
          </div>
        </div>
      </Card>

      {deceasedGender === "female" && (
        <Card>
          <CardTitle>هوية الزوج (اختياري)</CardTitle>
          <SpouseFields />
        </Card>
      )}

      <Card>
        <CardTitle>المخطوطة القرآنية</CardTitle>
        <QuranFields />
      </Card>
    </div>
  )
}
