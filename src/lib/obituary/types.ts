// أنواع بيانات النعوة — النموذج المصدري الوحيد الذي يشتق منه كل نص في الصفحة.

export type Gender = "male" | "female"

export type NumeralSystem = "arabic-indic" | "western"
export type MonthStyle = "levantine" | "egyptian"
export type DateOrder = "hijri-first" | "gregorian-first"

/**
 * موضع/تكبير صورة داخل إطار ثابت الأبعاد (object-fit: cover كأساس، ثم تكبير/تحريك
 * إضافيان فوقه). offsetXFrac/offsetYFrac كسور من عرض/طول الإطار نفسه (لا بكسل
 * مطلق) — محايدة تماماً تجاه الحجم الفعلي للإطار وقت العرض. راجع lib/obituary/photoCrop.ts.
 */
export interface PhotoCrop {
  /** ١ = الحد الأدنى (الصورة تملأ الإطار تماماً بلا هامش تحريك) — لا حدّ تحريك عنده. */
  zoom: number
  offsetXFrac: number
  offsetYFrac: number
}

/** شخص واحد — الفقيد نفسه، أو أحد أقاربه. */
export interface Person {
  id: string
  name: string
  /** الحاج، الدكتور، المهندس، الشيخ العلامة، العميد المتقاعد… */
  honorific?: string
  isDeceased: boolean
  gender: Gender
  spouseName?: string
  spouseHonorific?: string
  /** الزوج/ة متوفى/ة أيضاً (يُذكر كـ"المرحوم/ة") */
  spouseIsDeceased?: boolean
}

/**
 * مفاتيح فئات القرابة الثابتة — النص المعروض يُشتق من هذه عبر grammar.ts.
 * "parents" فئة واحدة تضمّ الأب والأم معاً (بدل فئتين منفصلتين) — كل منهما عضو
 * بجنسه الخاص داخل نفس المجموعة، ويُفصلان مجدداً إلى سطرين عند الطباعة
 * (راجع relativesBlocks في render.ts).
 */
export type RelativeCategoryKey =
  | "parents"
  | "wives"
  | "husband"
  | "sons"
  | "daughters"
  | "brothers"
  | "sisters"
  | "grandchildren"
  | "uncles_paternal"
  | "uncles_maternal"
  | "aunts_paternal"
  | "aunts_maternal"
  | "cousins_paternal"
  | "cousins_maternal"
  | "nephews_brothers"
  | "nephews_sisters"
  | "inlaws_sons"
  | "inlaws_daughters"
  | "inlaws_sisters"
  | "custom"

export interface RelativeGroup {
  id: string
  categoryKey: RelativeCategoryKey
  /** يُستعمل فقط حين categoryKey === "custom" */
  customLabel?: string
  members: Person[]
}

export interface DeceasedInfo {
  gender: Gender
  name: string
  honorific?: string
  /**
   * عازب/عازبة — لم يتزوّج قط. تُخفي فئات القرابة التي لا معنى لها بلا زواج/أبناء
   * (الزوجات/الزوج، الأبناء، البنات، الأحفاد) من قائمة "إضافة فئة قرابة" ومن العرض
   * والطباعة أيضاً — بلا حذف بياناتها إن كانت مُدخَلة سلفاً (إلغاء التفعيل يُعيدها
   * كما كانت). راجع SINGLE_HIDDEN_RELATIVE_CATEGORIES في defaults.ts وvisibleRelativeGroups
   * في render.ts.
   */
  isSingle?: boolean
  /** إن كانت الفقيدة أنثى وزوجها متوفى: "حرم المرحوم …" */
  spouseName?: string
  spouseHonorific?: string
  spouseIsDeceased?: boolean
  /**
   * صيغة سطر الهوية لفقيدة زوجها متوفٍّ. "زوجة"/"أرملة" كلاهما مستعمل فعلياً في
   * نعوات حقيقية. "حرم المغفور له" صيغة تقليدية تُغني عن ذكر "المرحوم" لاحقاً —
   * العبارة نفسها تحمل معنى الوفاة، فلا تُكرَّر (راجع identityLine في render.ts).
   */
  widowStyle?: "زوجة" | "أرملة" | "حرم المغفور له"
  /**
   * إظهار تاريخ ومكان الوفاة معاً كسطر في النعوة (بنفس نمط showBirthInfo أسفل) —
   * إن أُلغي، الحقلان أدناه مخفيّان من واجهة التحرير ومحفوظان لكن غير مطبوعين.
   * قبل هذا الحقل، كان مكان الوفاة يُطبع دائماً بلا أي تحكّم (وتاريخ الوفاة لا
   * يُطبع إطلاقاً) — عطل حقيقي واجهناه (راجع identityLine في render.ts).
   */
  showDeathInfo?: boolean
  /** مكان الوفاة إن اختلف عن مكان الإقامة، مثل: "كاليفورنيا" → "المتوفي/المتوفاة في كاليفورنيا" */
  deathPlaceNote?: string
  deathDateISO: string
  /** إزاحة يدوية بالأيام للتحويل الهجري (±) */
  hijriOffsetDays: number
  /** إظهار معلومات الميلاد (بلد الأصل + التاريخ) كسطر في النعوة — إن أُلغي، الحقلان أدناه محفوظان لكن غير مطبوعين. */
  showBirthInfo?: boolean
  birthDateISO?: string
  /** بلد المولد الأصلي — يظهر فقط إن showBirthInfo مفعّل، ومنفصل عن بلد الوفاة (للإحصاءات). */
  birthCountry?: string
  country: string
  quranVerseId?: string
  /** مضاعف حجم المخطوطة القرآنية الرئيسية — تكبير/تصغير يدوي بخطوات ١٠٪ (افتراضياً ١). */
  quranVerseScale?: number
  /**
   * نص حر يستبدل الآية القرآنية أعلى النعوة — يُستعمل فقط حين quranVerseId === "custom".
   * يُعرض كنص حيّ (لا صورة) بخط فني قابل للاختيار عبر customTopTextFontFamily، مستقل
   * تماماً عن bodyFontFamily ونمط الاسم. راجع Calligraphy.tsx (customText prop).
   */
  customTopText?: string
  /** خط النص المخصص أعلاه — cssVar من نفس كتالوج TEXT_FONT_OPTIONS (lib/textFonts.ts)
   * المستعمل في "إعدادات النصوص". فارغ/غائب يعني استعمال خط المخطوطة الافتراضي للقالب. */
  customTopTextFontFamily?: string
  hasBasmala: boolean
  /** مضاعف حجم البسملة (٠.٨-١.٢، افتراضياً ١) — نفس نمط quranVerseScale. */
  basmalaScale?: number
  hasInnaLillah: boolean
  /** مضاعف حجم علامة "إنّا لله وإنّا إليه راجعون" الختامية (٠.٨-١.٢، افتراضياً ١). */
  innaLillahScale?: number
  /**
   * عبارة الترحّم الظاهرة مباشرة فوق اسم الفقيد — "المرحوم/ة" (افتراضي) أو
   * "الشهيد/ة" أو نص حر (`marhoomCustomText`) عند "custom". راجع marhoomWord في render.ts.
   */
  marhoomStyle?: "marhoom" | "shaheed" | "custom"
  marhoomCustomText?: string
  /**
   * تكبير عبارة الترحّم ("المرحوم" مثلاً) لتصبح بنفس حجم اسم الفقيد — افتراضياً
   * أصغر بكثير (١.١٥em ثابت). زر تبديل واحد في (١. بيانات الفقيد)، لا حقل مقاس
   * حرّ — إمّا الحجم الصغير المعتاد أو مطابقة حجم الاسم بالضبط. راجع nameSizeEm
   * في ObituaryBlocks.tsx (المستعمل هنا أيضاً حين مفعّل).
   */
  marhoomEnlarged?: boolean
  /**
   * صورة الفقيد كـ data URL (base64) — تبقى في الذاكرة/المتصفح فقط، لا تُرسل
   * لأي خادم إطلاقاً (لا توجد في أي حمولة API بهذا المشروع). تُعرض دائماً داخل
   * إطار ثابت طولي ٧×١٠سم (object-fit: cover — لا contain) بصرف النظر عن اتجاه
   * الصورة الأصلية (عرضية أو طولية)، مع تحكّم المستخدم بالتكبير/التحريك داخل
   * الإطار عبر photoCrop. راجع PhotoUpload.tsx (التعديل التفاعلي) و
   * ObituaryBlocks.tsx (العرض النهائي) وليب lib/obituary/photoCrop.ts (الحساب المشترك).
   */
  photoDataUrl?: string
  /**
   * موضع/تكبير صورة الفقيد داخل الإطار الثابت — يُنشأ افتراضياً (DEFAULT_PHOTO_CROP)
   * عند أول رفع، ويُحدَّث من سحب/تصغير المستخدم في PhotoUpload.tsx. الإزاحة كسور
   * من أبعاد الإطار (لا بكسل مطلق) لتبقى صحيحة بصرياً بصرف النظر عن حجم الإطار
   * الفعلي وقت العرض (معاينة المحرّر مقابل الكانفاس المصغَّر بـauto-fit).
   */
  photoCrop?: PhotoCrop
  /**
   * تخطيط الصورة: مفعّل افتراضياً (undefined يُعامل كـtrue) — الصورة جهة اليسار
   * والنص (جملة النعي + سطر الترحّم + المرحوم + الاسم) جهة اليمين في صفّ واحد،
   * بدل الاستهلاك الرأسي للمساحة الذي يُفعِّل تصغير auto-fit بسرعة أكبر. إيقافه
   * يعيد التخطيط المتوسِّط/المكدَّس الرأسي السابق تماماً. راجع ObituaryBlocks.tsx.
   */
  photoSideBySide?: boolean
}

export interface FuneralInfo {
  institutionHeader?: string
  /** خط عريض للجهة الناعية — افتراضياً مفعّل (undefined يُعامل كـ true)، قابل للإلغاء. */
  institutionHeaderBold?: boolean
  processionFrom?: string
  prayerLocation: string
  prayerTimeNote?: string
  /** تاريخ الدفن/الصلاة — قد يختلف عن تاريخ الوفاة. افتراضياً تاريخ اليوم. */
  burialDateISO?: string
  burialLocation?: string
  condolencesGeneral?: string
  /** التعزية بمكان واحد للرجال والنساء معاً — إن مفعّل، condolencesGeneral2 وحده يُستعمل بعنوان "للرجال والنساء". */
  condolencesShared?: boolean
  condolencesMen?: string
  condolencesWomen?: string
  /**
   * إطار (stroke) مربع حول قسم "التشييع والصلاة والدفن والتعزية" بالكامل (من
   * جملة التشييع حتى نهاية التعزية، بلا "ملاحظات إضافية")، لتركيز الانتباه على
   * المعلومات المهمة. مفعّل افتراضياً (undefined يُعامل كـ true) — راجع
   * ObituaryBlocks.tsx للتطبيق الفعلي.
   */
  emphasizeFuneralBox?: boolean
  extraNotes?: string
  /** بلا هذا الحقل: يُستعمل اقتراح القالب الافتراضي (template.showPrintFooter). */
  printFooterEnabled?: boolean
  /** مسافة إضافية أسفل النعوة (بوحدة em) لملء الفراغ في نعوة قصيرة النص. */
  extraBottomSpacingEm?: number
  /** خط فاصل زخرفي إضافي فوق الفقرات الثلاث الأخيرة الثابتة أسفل الصفحة. */
  extraDividerLine?: boolean
}

/**
 * مفاتيح النصوص الثابتة القابلة للتخصيص — كل مفتاح يقابل جملة واحدة مبنية على
 * جنس الفقيد افتراضياً، ويمكن للمستخدم استبدالها بنص حرّ من "نصوص مخصّصة".
 * إضافة سطر قابل للتخصيص جديد = مفتاح واحد هنا + دالة تقرأه في render.ts.
 */
export type CustomTextKey = "mourningLine" | "closingDua" | "printFooterText" | "familiesLine"

export interface FormatPrefs {
  numerals: NumeralSystem
  months: MonthStyle
  dateOrder: DateOrder
}

/** تخصيص خط ووزن اسم الفقيد تحديداً — يتجاوز خط/حجم القالب الافتراضي إن حُدِّد. */
export interface NameStyleOverride {
  fontFamily?: string
  /** مضاعف حجم بالنسبة لحجم الاسم الافتراضي في القالب (1 = بلا تغيير). */
  sizeMultiplier?: number
  bold?: boolean
}

export interface ObituaryData {
  deceased: DeceasedInfo
  funeral: FuneralInfo
  relatives: RelativeGroup[]
  format: FormatPrefs
  templateId: string
  /** تخصيص حرّ لأي من CustomTextKey — إن غاب المفتاح يُستعمل النص المحسوب افتراضياً. */
  customTexts?: Partial<Record<CustomTextKey, string>>
  /** خط جميع نصوص النعوة (عدا اسم الفقيد الذي له تحكّمه الخاص عبر nameStyle) —
   * إن غاب يُستعمل tokens.bodyFont الخاص بالقالب المختار. */
  bodyFontFamily?: string
  nameStyle?: NameStyleOverride
}
