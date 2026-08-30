"use client"

// كل قسم هنا مُصدَّر (export) كمكوّن مستقل بجانب استعماله في التركيبة الافتراضية
// أسفل الملف (Step2Funeral لسطح المكتب) — نفس الحقول تُعاد استعمالها حرفياً في
// أقسام الجوال الصغيرة (mobile/sectionRegistry.tsx) بلا أي تكرار للمنطق أو الحقول.

import { CustomTextOverride } from "@/components/editor/CustomTextOverride"
import { todayISO } from "@/lib/obituary/defaults"
import { formatDualDate } from "@/lib/obituary/hijri"
import {
  defaultClosingDua, defaultMourningLine, defaultPrintFooterText,
} from "@/lib/obituary/render"
import { getTemplate } from "@/lib/templates/registry"
import { useEditorStore } from "@/store/editorStore"
import { Checkbox, FieldGroup, Input, Select, Textarea } from "@/components/ui/Field"
import { Card, CardTitle } from "@/components/ui/Card"

/** نص افتراضي جاهز للتعديل — يُملأ فعلياً (لا مجرد placeholder رمادي) عند أول
 * تركيز على حقل "التعزية العامة" إن كان فارغاً، فيتمكّن المستخدم من تعديله مباشرة. */
const DEFAULT_CONDOLENCES_GENERAL = "تُقبل التعازي قبل الدفن وبعده في منزل الفقيد"

/** نفس نمط DEFAULT_CONDOLENCES_GENERAL — يُملأ فعلياً (لا placeholder رمادي فقط)
 * عند أول تركيز على حقل "من أين سيُشيَّع الجثمان"، فيتابع المستخدم الكتابة مباشرة
 * بعد "محلة" بدل الحاجة لمسح النص الرمادي وكتابة الجملة كاملة من الصفر. */
const DEFAULT_PROCESSION_FROM = "منزله الكائن في محلة "

/**
 * "ملاحظة الوقت" — كانت حقل نص حرّ (بطلب صريح صارت لائحة اختيار ثابتة بدل ذلك).
 * القيمة تتضمّن "بعد صلاة" صراحةً (بطلب صريح) — تُدرَج كما هي مباشرة داخل
 * funeralSentence (راجع render.ts) فتُطبع حرفياً "...جثمانه الطاهر بعد صلاة
 * الفجر يوم...". هذا يخالف عمداً صيغة SAMPLE_OBITUARY_DATA المنفصلة ("عصر" وحدها
 * بلا بادئة) — تلك مطابقة حرفية لمرفق مرجعي حقيقي مختلف، تبقى كما هي بلا تغيير.
 */
const PRAYER_TIME_NOTE_OPTIONS = [
  "بعد صلاة الفجر", "بعد صلاة الظهر", "بعد صلاة العصر", "بعد صلاة المغرب", "بعد صلاة العشاء", "بعد صلاة الجمعة",
]

export function InstitutionFields() {
  const funeral = useEditorStore((s) => s.data.funeral)
  const updateFuneral = useEditorStore((s) => s.updateFuneral)

  return (
    <div className="flex flex-col gap-4">
      <FieldGroup label="الجهة الناعية (اختياري)" hint="مثال: تنعي وزارة التربية…">
        <Input value={funeral.institutionHeader ?? ""} onChange={(e) => updateFuneral({ institutionHeader: e.target.value })} />
        <Checkbox
          className="mt-2"
          label="خط عريض (Bold)"
          checked={funeral.institutionHeaderBold ?? true}
          onChange={(e) => updateFuneral({ institutionHeaderBold: e.target.checked })}
        />
      </FieldGroup>

      <FieldGroup label="من أين سيُشيَّع الجثمان" hint="يُضاف تلقائياً في المقدمة: «سيُشيَّع الجثمان من …»">
        <Input
          value={funeral.processionFrom ?? ""}
          onFocus={() => {
            if (!funeral.processionFrom) updateFuneral({ processionFrom: DEFAULT_PROCESSION_FROM })
          }}
          onChange={(e) => updateFuneral({ processionFrom: e.target.value })}
          placeholder={DEFAULT_PROCESSION_FROM}
        />
      </FieldGroup>
    </div>
  )
}

export function PrayerBurialFields() {
  const funeral = useEditorStore((s) => s.data.funeral)
  const deceased = useEditorStore((s) => s.data.deceased)
  const format = useEditorStore((s) => s.data.format)
  const updateFuneral = useEditorStore((s) => s.updateFuneral)
  const updateDeceased = useEditorStore((s) => s.updateDeceased)

  // نفس منطق funeralSentence() في render.ts بالضبط: تاريخ الدفن إن حُدِّد، وإلا
  // تاريخ الوفاة احتياطياً — الهجري المعروض هنا يطابق ما يُطبع فعلياً في النعوة.
  const effectiveBurialDate = funeral.burialDateISO || deceased.deathDateISO
  const hijriDisplay = effectiveBurialDate
    ? formatDualDate(effectiveBurialDate, {
      hijriOffsetDays: deceased.hijriOffsetDays,
      order: "hijri-first",
      numerals: format.numerals,
      months: format.months,
    }).split("، الموافق")[0] // السطر الهجري فقط، بلا الميلادي المكرَّر هنا
    : null

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="مكان صلاة الجنازة">
          <Input value={funeral.prayerLocation} onChange={(e) => updateFuneral({ prayerLocation: e.target.value })} placeholder="مسجد الشهداء" />
        </FieldGroup>
        <FieldGroup label="ملاحظة الوقت">
          <Select value={funeral.prayerTimeNote ?? ""} onChange={(e) => updateFuneral({ prayerTimeNote: e.target.value || undefined })}>
            <option value="">بلا</option>
            {PRAYER_TIME_NOTE_OPTIONS.map((label) => (
              <option key={label} value={label}>{label}</option>
            ))}
          </Select>
        </FieldGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="تاريخ الصلاة والدفن" hint="فارغ افتراضياً (يُعتمد تاريخ الوفاة) — انقر على الحقل ليُملأ بتاريخ اليوم مباشرة">
          <Input
            type="date"
            value={funeral.burialDateISO ?? ""}
            onFocus={() => {
              if (!funeral.burialDateISO) updateFuneral({ burialDateISO: todayISO() })
            }}
            onChange={(e) => updateFuneral({ burialDateISO: e.target.value })}
          />
        </FieldGroup>

        {/* نفس فكرة "التاريخ الهجري" في (بيانات الفقيد ← إظهار تاريخ ومكان الوفاة)
            بالضبط — وتستهلك نفس حقل deceased.hijriOffsetDays المشترك عمداً (لا
            حقل مستقل خاص بتاريخ الدفن)، فتعديل يوم (+/-) من أيّ من الموضعين
            ينعكس فوراً في الموضع الآخر أيضاً، كما طُلب صراحةً. */}
        <FieldGroup label="التاريخ الهجري">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-9 w-9 shrink-0 rounded-md border border-black/15 hover:bg-black/5"
              onClick={() => updateDeceased({ hijriOffsetDays: deceased.hijriOffsetDays - 1 })}
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
              onClick={() => updateDeceased({ hijriOffsetDays: deceased.hijriOffsetDays + 1 })}
              aria-label="تقديم يوم"
            >
              +
            </button>
          </div>
          <p className="mt-1 text-xs text-black/45">لضبط اختلاف الرؤية ±يوم — نفس الضبط في (إظهار تاريخ ومكان الوفاة)</p>
        </FieldGroup>
      </div>

      <FieldGroup label="مكان الدفن (اختياري)">
        <Input value={funeral.burialLocation ?? ""} onChange={(e) => updateFuneral({ burialLocation: e.target.value })} />
      </FieldGroup>
    </div>
  )
}

export function CondolencesFields() {
  const funeral = useEditorStore((s) => s.data.funeral)
  const updateFuneral = useEditorStore((s) => s.updateFuneral)

  return (
    <div className="flex flex-col gap-4">
      <FieldGroup label="التعزية العامة">
        <Textarea
          value={funeral.condolencesGeneral ?? ""}
          onFocus={() => {
            if (!funeral.condolencesGeneral) updateFuneral({ condolencesGeneral: DEFAULT_CONDOLENCES_GENERAL })
          }}
          onChange={(e) => updateFuneral({ condolencesGeneral: e.target.value })}
          placeholder={DEFAULT_CONDOLENCES_GENERAL}
        />
      </FieldGroup>

      <Checkbox
        label="نفس المكان للرجال والنساء"
        checked={funeral.condolencesShared ?? false}
        onChange={(e) => updateFuneral({ condolencesShared: e.target.checked })}
      />

      {funeral.condolencesShared ? (
        <FieldGroup label="التعزية للرجال والنساء (اختياري)">
          <Textarea value={funeral.condolencesMen ?? ""} onChange={(e) => updateFuneral({ condolencesMen: e.target.value })} />
        </FieldGroup>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="تعزية الرجال (اختياري)">
            <Textarea value={funeral.condolencesMen ?? ""} onChange={(e) => updateFuneral({ condolencesMen: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="تعزية النساء (اختياري)">
            <Textarea value={funeral.condolencesWomen ?? ""} onChange={(e) => updateFuneral({ condolencesWomen: e.target.value })} />
          </FieldGroup>
        </div>
      )}

      <div>
        <Checkbox
          label="إطار مربع حول التشييع والصلاة والدفن والتعزية"
          checked={funeral.emphasizeFuneralBox ?? true}
          onChange={(e) => updateFuneral({ emphasizeFuneralBox: e.target.checked })}
        />
        <p className="mt-1 text-xs text-black/45">للتركيز على المعلومات المهمة بداخله</p>
      </div>

      <FieldGroup label="ملاحظات إضافية (اختياري)">
        <Textarea value={funeral.extraNotes ?? ""} onChange={(e) => updateFuneral({ extraNotes: e.target.value })} />
      </FieldGroup>
    </div>
  )
}

export function FillGapFields() {
  const funeral = useEditorStore((s) => s.data.funeral)
  const updateFuneral = useEditorStore((s) => s.updateFuneral)

  return (
    <div className="flex flex-col gap-3">
      <p className="-mt-1 text-xs text-black/45">
        الفقرات الثلاث الأخيرة (الراضون بقضاء الله وقدره، إنّا لله وإنّا إليه راجعون، للفقيد الرحمة ولكم الأجر والثواب)
        تبقى ثابتة أسفل الصفحة دائماً. إن كانت النعوة قصيرة، أضف مسافة أو خطاً فاصلاً فوقها لملء الفراغ بشكل أنيق.
      </p>
      <FieldGroup label="مسافة إضافية قبل الفقرات الأخيرة (اختياري)">
        <Input
          type="number"
          min={0}
          max={20}
          step={0.5}
          value={funeral.extraBottomSpacingEm ?? ""}
          onChange={(e) => updateFuneral({ extraBottomSpacingEm: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="0"
        />
      </FieldGroup>
      <Checkbox
        label="إضافة خط فاصل فوق الفقرات الأخيرة"
        checked={funeral.extraDividerLine ?? false}
        onChange={(e) => updateFuneral({ extraDividerLine: e.target.checked })}
      />
    </div>
  )
}

export function CustomTextsFields() {
  const deceased = useEditorStore((s) => s.data.deceased)
  const funeral = useEditorStore((s) => s.data.funeral)
  const customTexts = useEditorStore((s) => s.data.customTexts)
  const templateId = useEditorStore((s) => s.data.templateId)
  const updateFuneral = useEditorStore((s) => s.updateFuneral)
  const updateCustomText = useEditorStore((s) => s.updateCustomText)

  // نفس منطق printFooterText() في render.ts: الحالة الفعلية = قيمة صريحة، وإلا اقتراح القالب.
  const templateSuggestsFooter = getTemplate(templateId).showPrintFooter
  const printFooterChecked = funeral.printFooterEnabled ?? templateSuggestsFooter

  return (
    <div className="flex flex-col gap-4">
      <p className="-mt-1 text-xs text-black/45">
        كل جملة ثابتة في النعوة قابلة للتحكم — فعّل &quot;تخصيص&quot; لتغيير أي منها بنصّك الخاص.
      </p>
      <div>
        <CustomTextOverride
          label="جملة النعي"
          computedDefault={defaultMourningLine(deceased.gender)}
          value={customTexts?.mourningLine}
          onChange={(v) => updateCustomText("mourningLine", v)}
        />
        <p className="mt-1 text-xs text-black/45">
          مدمجة الآن مع سطر الترحّم في سطر واحد — عبارة الترحّم (المرحوم/الشهيد) في (١. بيانات الفقيد) منفصلة تماماً عن هذا السطر.
        </p>
      </div>
      <CustomTextOverride
        label="خاتمة الدعاء"
        computedDefault={defaultClosingDua(deceased.gender)}
        value={customTexts?.closingDua}
        onChange={(v) => updateCustomText("closingDua", v)}
      />

      <div className="border-t border-black/10 pt-4">
        <Checkbox
          label="إظهار فوتر سطر أسفل النعوة"
          checked={printFooterChecked}
          onChange={(e) => updateFuneral({ printFooterEnabled: e.target.checked })}
        />
        {printFooterChecked && (
          <div className="mt-3">
            <CustomTextOverride
              label="نص فوتر المطبعة"
              computedDefault={defaultPrintFooterText()}
              value={customTexts?.printFooterText}
              onChange={(v) => updateCustomText("printFooterText", v)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export function DateFormatFields() {
  const format = useEditorStore((s) => s.data.format)
  const updateFormat = useEditorStore((s) => s.updateFormat)

  return (
    <div className="grid grid-cols-3 gap-4">
      <FieldGroup label="ترتيب التاريخ">
        <Select value={format.dateOrder} onChange={(e) => updateFormat({ dateOrder: e.target.value as typeof format.dateOrder })}>
          <option value="hijri-first">هجري ثم ميلادي</option>
          <option value="gregorian-first">ميلادي ثم هجري</option>
        </Select>
      </FieldGroup>
      <FieldGroup label="نظام الأرقام">
        <Select value={format.numerals} onChange={(e) => updateFormat({ numerals: e.target.value as typeof format.numerals })}>
          <option value="arabic-indic">عربي-هندي (٢٠٢٦)</option>
          <option value="western">غربي (2026)</option>
        </Select>
      </FieldGroup>
      <FieldGroup label="أسماء الأشهر">
        <Select value={format.months} onChange={(e) => updateFormat({ months: e.target.value as typeof format.months })}>
          <option value="levantine">بلاد الشام (آذار)</option>
          <option value="egyptian">اللاتينية (مارس)</option>
        </Select>
      </FieldGroup>
    </div>
  )
}

export function Step2Funeral() {
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardTitle>الجنازة والتعزية</CardTitle>
        <div className="flex flex-col gap-4">
          <InstitutionFields />
          <PrayerBurialFields />
          <CondolencesFields />
        </div>
      </Card>

      <Card>
        <CardTitle>ملء الفراغ (للنعوة القصيرة)</CardTitle>
        <FillGapFields />
      </Card>

      <Card>
        <CardTitle>نصوص مخصّصة</CardTitle>
        <CustomTextsFields />
      </Card>

      <Card>
        <CardTitle>تنسيق التاريخ والأرقام</CardTitle>
        <DateFormatFields />
      </Card>
    </div>
  )
}
