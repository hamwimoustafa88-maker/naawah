// قائمة أقسام التعديل الصغيرة الخاصة بواجهة الجوال — كل قسم يفتح كبوب-أب (بوتوم-شيت)
// مستقل فوق المعاينة الحية بدل نموذج طويل واحد. كل Content هنا هو نفس مكوّنات الحقول
// المُصدَّرة من ملفات الخطوات الأربع لسطح المكتب (Step1Deceased.tsx وغيره) — مصدر واحد
// للحقول، بلا أي تكرار منطق أو نسخ حرفي. لا تُضِف حقلاً هنا مباشرة؛ أضفه في ملف الخطوة
// المصدر ثم اربطه من هنا.

import type { ComponentType } from "react"
import type { LucideProps } from "lucide-react"
import {
  BookOpen, Building2, Calendar, Cake, Hash, ImagePlus, MapPin, MessageSquare,
  PenLine, Quote, Ruler, User, Users,
} from "lucide-react"
import {
  BirthInfoFields, DeathDateFields, IdentityFields, MarhoomFields, QuranFields, SpouseFields,
} from "@/components/editor/steps/Step1Deceased"
import {
  CondolencesFields, CustomTextsFields, DateFormatFields, FillGapFields, InstitutionFields, PrayerBurialFields,
} from "@/components/editor/steps/Step2Funeral"
import { PhotoUpload } from "@/components/editor/PhotoUpload"

export type SectionGroupId = "deceased" | "funeral" | "relatives" | "template"

export const SECTION_GROUPS: { id: SectionGroupId; label: string }[] = [
  { id: "deceased", label: "بيانات الفقيد" },
  { id: "funeral", label: "الجنازة والتعزية" },
  { id: "relatives", label: "الأقارب" },
  { id: "template", label: "القالب" },
]

export interface StaticSectionDescriptor {
  id: string
  title: string
  icon: ComponentType<LucideProps>
  group: SectionGroupId
  Content: ComponentType
  /** بعض الأقسام شرطية (هوية الزوج تظهر فقط للفقيدة الأنثى) — تُفلتَر بقراءة هذه القيمة
   * من المتجر في مكوّن القائمة نفسه (راجع MobileSectionMenu)، لا هنا (الملف ثابت بلا hooks). */
  requiresFemale?: boolean
}

export const STATIC_SECTIONS: StaticSectionDescriptor[] = [
  { id: "identity", title: "الاسم والهوية", icon: User, group: "deceased", Content: IdentityFields },
  { id: "marhoom", title: "عبارة الترحّم", icon: Quote, group: "deceased", Content: MarhoomFields },
  { id: "death-date", title: "تاريخ الوفاة", icon: Calendar, group: "deceased", Content: DeathDateFields },
  { id: "birth-info", title: "معلومات الميلاد", icon: Cake, group: "deceased", Content: BirthInfoFields },
  { id: "photo", title: "صورة الفقيد", icon: ImagePlus, group: "deceased", Content: PhotoUpload },
  { id: "spouse", title: "هوية الزوج", icon: Users, group: "deceased", Content: SpouseFields, requiresFemale: true },
  { id: "quran", title: "المخطوطة القرآنية", icon: BookOpen, group: "deceased", Content: QuranFields },

  { id: "institution", title: "الجهة الناعية", icon: Building2, group: "funeral", Content: InstitutionFields },
  { id: "prayer-burial", title: "الصلاة والدفن", icon: MapPin, group: "funeral", Content: PrayerBurialFields },
  { id: "condolences", title: "التعزية", icon: MessageSquare, group: "funeral", Content: CondolencesFields },
  { id: "fill-gap", title: "ملء الفراغ", icon: Ruler, group: "funeral", Content: FillGapFields },
  { id: "custom-texts", title: "نصوص مخصّصة", icon: PenLine, group: "funeral", Content: CustomTextsFields },
  { id: "date-format", title: "تنسيق التاريخ", icon: Hash, group: "funeral", Content: DateFormatFields },
]
