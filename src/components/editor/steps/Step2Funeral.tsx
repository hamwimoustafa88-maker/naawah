"use client"

import { CustomTextOverride } from "@/components/editor/CustomTextOverride"
import { todayISO } from "@/lib/obituary/defaults"
import {
  defaultClosingDua, defaultMaghfoorLine, defaultMourningSentence, defaultPrintFooterText,
} from "@/lib/obituary/render"
import { getTemplate } from "@/lib/templates/registry"
import { useEditorStore } from "@/store/editorStore"
import { Checkbox, FieldGroup, Input, Select, Textarea } from "@/components/ui/Field"
import { Card, CardTitle } from "@/components/ui/Card"

/** نص افتراضي جاهز للتعديل — يُملأ فعلياً (لا مجرد placeholder رمادي) عند أول
 * تركيز على حقل "التعزية العامة" إن كان فارغاً، فيتمكّن المستخدم من تعديله مباشرة. */
const DEFAULT_CONDOLENCES_GENERAL = "تُقبل التعازي في (إسم المكان) قبل الدفن وبعده في منزل الفقيد"

export function Step2Funeral() {
  const deceased = useEditorStore((s) => s.data.deceased)
  const funeral = useEditorStore((s) => s.data.funeral)
  const format = useEditorStore((s) => s.data.format)
  const customTexts = useEditorStore((s) => s.data.customTexts)
  const templateId = useEditorStore((s) => s.data.templateId)
  const updateFuneral = useEditorStore((s) => s.updateFuneral)
  const updateFormat = useEditorStore((s) => s.updateFormat)
  const updateCustomText = useEditorStore((s) => s.updateCustomText)

  // نفس منطق printFooterText() في render.ts: الحالة الفعلية = قيمة صريحة، وإلا اقتراح القالب.
  const templateSuggestsFooter = getTemplate(templateId).showPrintFooter
  const printFooterChecked = funeral.printFooterEnabled ?? templateSuggestsFooter

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardTitle>الجنازة والتعزية</CardTitle>
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
              onChange={(e) => updateFuneral({ processionFrom: e.target.value })}
              placeholder="منزله الكائن في محلة …"
            />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-4">
            <FieldGroup label="مكان صلاة الجنازة">
              <Input value={funeral.prayerLocation} onChange={(e) => updateFuneral({ prayerLocation: e.target.value })} placeholder="مسجد الشهداء" />
            </FieldGroup>
            <FieldGroup label="ملاحظة الوقت" hint="مثال: عصر، أو بعد صلاة الظهر/العصر">
              <Input
                value={funeral.prayerTimeNote ?? ""}
                onChange={(e) => updateFuneral({ prayerTimeNote: e.target.value })}
                placeholder="عصر"
              />
            </FieldGroup>
          </div>

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

          <FieldGroup label="مكان الدفن (اختياري)">
            <Input value={funeral.burialLocation ?? ""} onChange={(e) => updateFuneral({ burialLocation: e.target.value })} />
          </FieldGroup>

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

          <FieldGroup label="ملاحظات إضافية (اختياري)">
            <Textarea value={funeral.extraNotes ?? ""} onChange={(e) => updateFuneral({ extraNotes: e.target.value })} />
          </FieldGroup>
        </div>
      </Card>

      <Card>
        <CardTitle>ملء الفراغ (للنعوة القصيرة)</CardTitle>
        <p className="mb-3 -mt-2 text-xs text-black/45">
          الفقرات الثلاث الأخيرة (الراضون بقضاء الله وقدره، إنّا لله وإنّا إليه راجعون، للفقيد الرحمة ولكم الأجر والثواب)
          تبقى ثابتة أسفل الصفحة دائماً. إن كانت النعوة قصيرة، أضف مسافة أو خطاً فاصلاً فوقها لملء الفراغ بشكل أنيق.
        </p>
        <div className="flex flex-col gap-3">
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
      </Card>

      <Card>
        <CardTitle>نصوص مخصّصة</CardTitle>
        <p className="mb-3 -mt-2 text-xs text-black/45">
          كل جملة ثابتة في النعوة قابلة للتحكم — فعّل &quot;تخصيص&quot; لتغيير أي منها بنصّك الخاص.
        </p>
        <div className="flex flex-col gap-4">
          <CustomTextOverride
            label="جملة النعي"
            computedDefault={defaultMourningSentence()}
            value={customTexts?.mourningSentence}
            onChange={(v) => updateCustomText("mourningSentence", v)}
          />
          <CustomTextOverride
            label="سطر الترحّم"
            computedDefault={defaultMaghfoorLine(deceased.gender)}
            value={customTexts?.maghfoorLine}
            onChange={(v) => updateCustomText("maghfoorLine", v)}
          />
          <CustomTextOverride
            label="خاتمة الدعاء"
            computedDefault={defaultClosingDua(deceased.gender)}
            value={customTexts?.closingDua}
            onChange={(v) => updateCustomText("closingDua", v)}
          />

          <div className="border-t border-black/10 pt-4">
            <Checkbox
              label="إظهار فوتر المطبعة أسفل النعوة"
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
      </Card>

      <Card>
        <CardTitle>تنسيق التاريخ والأرقام</CardTitle>
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
              <option value="levantine">شامية (آذار)</option>
              <option value="egyptian">مصرية (مارس)</option>
            </Select>
          </FieldGroup>
        </div>
      </Card>
    </div>
  )
}
