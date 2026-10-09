"use client"

// كل قسم هنا مُصدَّر (export) كمكوّن مستقل بجانب استعماله في التركيبة الافتراضية
// أسفل الملف (Step1Deceased لسطح المكتب) — نفس الحقول تُعاد استعمالها حرفياً في
// أقسام الجوال الصغيرة (mobile/sectionRegistry.tsx) بلا أي تكرار للمنطق أو الحقول.

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { honorificsFor, QURAN_VERSES, todayISO } from "@/lib/obituary/defaults"
import { formatDualDate } from "@/lib/obituary/hijri"
import { detectWriterPlaceAr } from "@/lib/location/detectPlace"
import { useEditorStore } from "@/store/editorStore"
import { Checkbox, FieldGroup, Input, Select, Textarea } from "@/components/ui/Field"
import { Card, CardTitle } from "@/components/ui/Card"
import { PhotoUpload } from "@/components/editor/PhotoUpload"
import { FontPicker } from "@/components/editor/FontPicker"
import { CountryPicker } from "@/components/editor/CountryPicker"

export function IdentityFields() {
  const deceased = useEditorStore((s) => s.data.deceased)
  const update = useEditorStore((s) => s.updateDeceased)

  return (
    <div className="grid grid-cols-2 gap-4">
      <FieldGroup label="الجنس">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => update({ gender: "male" })}
            aria-pressed={deceased.gender === "male"}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              deceased.gender === "male"
                ? "border-accent bg-accent text-white"
                : "border-black/15 bg-white text-foreground hover:bg-black/5"
            )}
          >
            ذكر
          </button>
          <button
            type="button"
            onClick={() => update({ gender: "female" })}
            aria-pressed={deceased.gender === "female"}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              deceased.gender === "female"
                ? "border-accent bg-accent text-white"
                : "border-black/15 bg-white text-foreground hover:bg-black/5"
            )}
          >
            أنثى
          </button>
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
        <FieldGroup label="الاسم الكامل">
          <Input value={deceased.name} onChange={(e) => update({ name: e.target.value })} placeholder="محمود محمد شهاب" />
        </FieldGroup>
      </div>
      {/* حقل "العائلات" اليدوي انتقل من هنا — صار مُشتقّاً تلقائياً من أسماء
          الأقارب المُدخَلين في (٣. الأقارب)، فظهر هناك (FamiliesField في
          Step3Relatives.tsx) لا هنا. راجع defaultFamiliesLine في render.ts. */}

      <div className="col-span-2">
        <Checkbox
          label={deceased.gender === "male" ? "عازب (لم يتزوّج قط)" : "عازبة (لم تتزوّج قط)"}
          checked={deceased.isSingle ?? false}
          onChange={(e) => update({ isSingle: e.target.checked })}
        />
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
          <div className="flex items-center gap-2">
            <Select
              className="flex-1"
              value={deceased.marhoomStyle ?? "marhoom"}
              onChange={(e) => update({ marhoomStyle: e.target.value as NonNullable<typeof deceased.marhoomStyle> })}
            >
              <option value="marhoom">{deceased.gender === "male" ? "المرحوم" : "المرحومة"}</option>
              <option value="shaheed">{deceased.gender === "male" ? "الشهيد" : "الشهيدة"}</option>
              <option value="custom">أخرى (نص مخصّص)</option>
            </Select>
            {/* تبديل واحد: تكبير العبارة لحجم اسم الفقيد، أو إعادتها لحجمها الصغير
                المعتاد — بلا نص/خانة اختيار، فقط أيقونة تتبدّل مع الحالة. */}
            <button
              type="button"
              onClick={() => update({ marhoomEnlarged: !(deceased.marhoomEnlarged ?? false) })}
              aria-pressed={deceased.marhoomEnlarged ?? false}
              title={deceased.marhoomEnlarged ? "تصغير إلى الحجم المعتاد" : "تكبير لحجم اسم الفقيد"}
              aria-label={deceased.marhoomEnlarged ? "تصغير عبارة الترحّم إلى الحجم المعتاد" : "تكبير عبارة الترحّم لحجم اسم الفقيد"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-black/15 hover:bg-black/5"
            >
              {deceased.marhoomEnlarged ? <Minus size={16} /> : <Plus size={16} />}
            </button>
          </div>
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

  // كشف مكان الكاتب (لا الفقيد) عبر IP — مرة واحدة فقط لكل تركيب لهذا المكوّن،
  // حتى لا يُعاد الاستعلام في كل تركيز لاحق على الحقل بلا فائدة (خاصة بعد فشل
  // أول محاولة). راجع lib/location/detectPlace.ts لتفاصيل الخصوصية والدقّة.
  const [placeDetectState, setPlaceDetectState] = useState<"idle" | "detecting" | "done">("idle")

  const hijriDisplay = deceased.deathDateISO
    ? formatDualDate(deceased.deathDateISO, {
      hijriOffsetDays: deceased.hijriOffsetDays,
      order: "hijri-first",
      numerals: format.numerals,
      months: format.months,
    }).split("، الموافق")[0] // السطر الهجري فقط، بلا الميلادي المكرَّر هنا
    : null

  return (
    <div className="flex flex-col gap-4">
      {/* حقل "بلد الوفاة" مخفيّ من الواجهة بطلب صريح — القيمة الافتراضية (createEmptyData)
          تبقى محفوظة في البيانات لأغراض الإحصاءات المجهولة فقط، بلا واجهة تعديل. */}

      {/*
        تاريخ ومكان الوفاة (والتاريخ الهجري المرافق لهما) مخفيّة من الطباعة
        افتراضياً (بنفس نمط "إظهار معلومات الميلاد" في BirthInfoFields أسفل) —
        عطل حقيقي واجهناه: مكان الوفاة كان يُطبع دائماً بلا أي تحكّم، وتاريخ
        الوفاة لا يُطبع إطلاقاً، بصرف النظر عن رغبة المستخدم. الحقول الثلاثة
        تختفي معاً كليّاً حين إلغاء التفعيل (لا حقل ظاهر فارغ فقط) — نفس سلوك
        BirthInfoFields تماماً، بلا مسح أي قيمة محفوظة.
        ملاحظة: التاريخ الهجري (hijriOffsetDays) يُستهلَك أيضاً في تحويل تاريخ
        الصلاة والدفن (funeralSentence في render.ts)، المطبوع دائماً بلا علاقة
        بهذا الخيار — إخفاء الأداة هنا لا يمسح القيمة المخزَّنة (تبقى مُستعملة
        لذلك الغرض)، فقط تصبح غير قابلة للتعديل من الواجهة ما لم يُفعَّل هذا
        الخيار. طُلب صراحةً تجميعها هنا رغم هذا الاستهلاك المزدوج.
      */}
      <Checkbox
        label="إظهار تاريخ ومكان الوفاة في النعوة"
        checked={deceased.showDeathInfo ?? false}
        onChange={(e) => update({ showDeathInfo: e.target.checked })}
      />

      {deceased.showDeathInfo && (
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

          <div className="col-span-2">
            <FieldGroup
              label="مكان وفاة (اختياري)"
              hint={
                placeDetectState === "detecting"
                  ? "جارٍ اكتشاف موقعك تلقائياً…"
                  : "فارغ افتراضياً — انقر على الحقل ليُقتَرح مكانك الحالي تلقائياً (قابل للتعديل الكامل). مثال: كاليفورنيا ← يظهر «المتوفي/المتوفاة في كاليفورنيا»"
              }
            >
              <Input
                value={deceased.deathPlaceNote ?? ""}
                onFocus={async () => {
                  // نحاول مرة واحدة فقط لكل تركيب — لا نُعيد المحاولة عند كل تركيز
                  // لاحق (خصوصاً بعد فشل أول محاولة: بلا اتصال، أو تعذّر ترجمة الاسم للعربية).
                  if (deceased.deathPlaceNote || placeDetectState !== "idle") return
                  setPlaceDetectState("detecting")
                  const place = await detectWriterPlaceAr()
                  setPlaceDetectState("done")
                  if (place) update({ deathPlaceNote: place })
                }}
                onChange={(e) => update({ deathPlaceNote: e.target.value })}
              />
            </FieldGroup>
          </div>
        </div>
      )}
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
            <CountryPicker value={deceased.birthCountry ?? ""} onChange={(v) => update({ birthCountry: v })} />
          </FieldGroup>
        </div>
      )}
    </div>
  )
}

export function SpouseFields() {
  const deceased = useEditorStore((s) => s.data.deceased)
  const update = useEditorStore((s) => s.updateDeceased)
  const widowStyle = deceased.widowStyle ?? "زوجة"
  // "أرملة"/"حرم المغفور له" تعنيان بالتعريف أن الزوج متوفٍّ فعلاً — لا داعي لخانة
  // منفصلة تكرّر معنى محسوماً أصلاً بالعبارة نفسها. "زوجة" وحدها تبقى غامضة (الزوج
  // قد يكون حيّاً أو متوفى)، فتبقى الخانة ظاهرة لهذا الأسلوب حصراً. راجع أيضاً
  // identityLine في render.ts — تفرض "أرملة" هذا المعنى في النص المطبوع نفسه أيضاً،
  // بصرف النظر عن قيمة spouseIsDeceased المخزَّنة، فلا يعتمد الناتج على إخفاء الخانة فقط.
  const showSpouseDeceasedToggle = widowStyle === "زوجة"

  return (
    <div className="grid grid-cols-2 gap-4">
      <FieldGroup label="لقب الزوج">
        <Input
          list="honorifics-male"
          value={deceased.spouseHonorific ?? ""}
          onChange={(e) => update({ spouseHonorific: e.target.value })}
          placeholder="الحاج، الدكتور…"
        />
        {/* الزوج ذكر دائماً بصرف النظر عن جنس الفقيدة — datalist مستقلة عن "honorifics"
            في IdentityFields (تلك تتبع جنس الفقيد/ة نفسه/ها) حتى لا تظهر ألقاب مؤنّثة
            هنا (عطل حقيقي: كان يتشارك الحقلان نفس القائمة، فتظهر "الحاجة"/"الدكتورة"
            لِلَقب زوج ذكر). */}
        <datalist id="honorifics-male">
          {honorificsFor("male").map((h) => (
            <option key={h} value={h} />
          ))}
        </datalist>
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
          value={widowStyle}
          onChange={(e) => update({ widowStyle: e.target.value as NonNullable<typeof deceased.widowStyle> })}
        >
          <option value="زوجة">زوجة</option>
          <option value="أرملة">أرملة المرحوم</option>
          <option value="حرم المغفور له">حرم المغفور له</option>
        </Select>
      </FieldGroup>
      {showSpouseDeceasedToggle && (
        <div className="flex items-end pb-2">
          <Checkbox
            label="الزوج متوفٍّ"
            checked={deceased.spouseIsDeceased ?? false}
            onChange={(e) => update({ spouseIsDeceased: e.target.checked })}
          />
        </div>
      )}
    </div>
  )
}

/**
 * حدود تكبير/تصغير المخطوطات القرآنية — كل نقرة ١٠٪. الحد الأدنى/الأقصى واسعان
 * عمداً (لم يعودا ٠.٨-١.٢ كما كانا، بحدّ درجتين فقط في كل اتجاه — ضيّق جداً
 * فعلياً). الحد الأقصى الحقيقي على الشاشة يُفرَض بقيد CSS نسبي (min(widthPx,100%)
 * في Calligraphy.tsx) لا برقم ثابت هنا — فالتكبير يستمر فعلياً "حتى حدود الصفحة"
 * بصرياً، وMAX هنا مجرّد سقف عددي بعيد يمنع استمرار الرقم بلا معنى بعد بلوغ ذلك
 * القيد المرئي فعلياً.
 */
const CALLIGRAPHY_SCALE_MIN = 0.1
const CALLIGRAPHY_SCALE_MAX = 5
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
            <option value="custom">نص مخصّص</option>
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

      {deceased.quranVerseId === "custom" && (
        <div className="flex flex-col gap-3 rounded-lg border border-black/10 bg-black/2 p-3">
          <FieldGroup label="النص المخصّص" hint="يحلّ محلّ الآية أعلى النعوة — يُعرض بخط فني قابل للاختيار أدناه">
            <Textarea
              value={deceased.customTopText ?? ""}
              onChange={(e) => update({ customTopText: e.target.value })}
              placeholder="اكتب النص الذي تريد ظهوره أعلى النعوة…"
            />
          </FieldGroup>
          <FieldGroup label="خط النص المخصّص">
            <FontPicker
              value={deceased.customTopTextFontFamily ?? ""}
              onChange={(v) => update({ customTopTextFontFamily: v })}
            />
          </FieldGroup>
        </div>
      )}
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
  const isSingle = useEditorStore((s) => s.data.deceased.isSingle ?? false)

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

      {/* تختفي أيضاً حين "عازبة" مفعّل — لا هوية زوج لفقيدة لم تتزوّج قط، بنفس
          منطق إخفاء فئات القرابة المرتبطة بالزواج (راجع IdentityFields أعلاه
          وSINGLE_HIDDEN_RELATIVE_CATEGORIES في defaults.ts). */}
      {deceasedGender === "female" && !isSingle && (
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
