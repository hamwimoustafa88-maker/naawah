// كشف تقريبي لمكان الكاتب (لا الفقيد) عبر عنوان IP — بلا أي إذن من المتصفّح
// (بخلاف الموقع الدقيق GPS)، لتسهيل تعبئة حقل "مكان وفاة" بتخمين معقول قابل
// للتعديل اليدوي الكامل. يُستهلَك من Step1Deceased.tsx (DeathDateFields).
//
// **لا علاقة لهذا ببيانات الفقيد/النعوة نفسها** — لا يُرسَل أي شيء لخادم هذا
// التطبيق إطلاقاً؛ الطلب الوحيد هو استعلام IP الكاتب نفسه (لا الفقيد ولا أي بيان
// عنه) مباشرة من متصفحه إلى خدمة IP-geolocation مجانية خارجية (ipapi.co)، تماماً
// كما يفعل أي موقع يعرض "مرحباً بزوّار لبنان" دون أن يُعتبر هذا تسريب بيانات.
//
// دقّة IP تقريبية دائماً (مدينة/محافظة عادةً، ونادراً قرية صغيرة بعينها) — هذا
// تخمين مبدئي سريع لا كشف موقع دقيق (ذاك يحتاج GPS + إذن صريح، خيار لم يُختر هنا).

/**
 * ترجمة الأسماء الإنجليزية الشائعة التي تُعيدها خدمات IP-geolocation لمدن/محافظات
 * لبنانية ودول عربية إلى العربية. **الهدف نص عربي حصراً في نعوة عربية** — إن غاب
 * الاسم عن هذا الجدول، لا نملأ الحقل بنص إنجليزي إطلاقاً (فشل صامت مقصود، راجع
 * detectWriterPlaceAr أدناه)، حتى لا يظهر "Beirut" داخل نعوة عربية بالخطأ.
 */
const PLACE_NAME_AR: Record<string, string> = {
  // لبنان — أبرز المدن/الأقضية التي قد تُعيدها خدمات IP فعلياً
  beirut: "بيروت",
  "beirut governorate": "بيروت",
  tripoli: "طرابلس",
  sidon: "صيدا",
  saida: "صيدا",
  tyre: "صور",
  sour: "صور",
  zahle: "زحلة",
  zahleh: "زحلة",
  jounieh: "جونية",
  byblos: "جبيل",
  jbeil: "جبيل",
  baabda: "بعبدا",
  aley: "عاليه",
  aaley: "عاليه",
  chouf: "الشوف",
  "el chouf": "الشوف",
  baalbek: "بعلبك",
  nabatieh: "النبطية",
  nabatiyeh: "النبطية",
  akkar: "عكار",
  "mount lebanon": "جبل لبنان",
  "mount lebanon governorate": "جبل لبنان",
  bekaa: "البقاع",
  beqaa: "البقاع",
  "bekaa governorate": "البقاع",
  "north governorate": "لبنان الشمالي",
  "north lebanon": "لبنان الشمالي",
  "south governorate": "لبنان الجنوبي",
  "south lebanon": "لبنان الجنوبي",
  // دول عربية — احتياط إن غاب اسم المدينة/المحافظة عن الجدول أعلاه
  lebanon: "لبنان",
  syria: "سوريا",
  jordan: "الأردن",
  palestine: "فلسطين",
  egypt: "مصر",
  iraq: "العراق",
  "saudi arabia": "السعودية",
  "united arab emirates": "الإمارات",
  kuwait: "الكويت",
  qatar: "قطر",
  bahrain: "البحرين",
  oman: "عمان",
}

function toArabicPlace(name: string | undefined | null): string | undefined {
  if (!name) return undefined
  return PLACE_NAME_AR[name.trim().toLowerCase()]
}

/**
 * يحاول استنتاج مكان الكاتب بالعربية عبر IP (مدينة، ثم محافظة، ثم دولة — أوسعها
 * فأدقّها). يُعيد `undefined` بصمت عند أي فشل (لا اتصال، مهلة، أو تعذّر ترجمة
 * الاسم للعربية) — الحقل يبقى فارغاً وقابلاً للتعبئة اليدوية دائماً، هذا تسهيل لا أكثر.
 */
export async function detectWriterPlaceAr(): Promise<string | undefined> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal })
    clearTimeout(timeout)
    if (!res.ok) return undefined
    const data: { city?: string; region?: string; country_name?: string } = await res.json()
    return toArabicPlace(data.city) ?? toArabicPlace(data.region) ?? toArabicPlace(data.country_name)
  } catch {
    return undefined
  }
}
