// استخراج اسم العائلة من اسم كامل، مع دعم العائلات المركّبة من كلمتين.

/** تقارن بلا اعتبار لاختلافات الكتابة الشائعة: أبو/ابو، طعمة/طعمه، موسى/موسي. */
function normalize(text: string): string {
  return text.replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي")
}

// كلمات لا تكون اسم عائلة وحدها أبداً، فتغطي معظم العائلات المركّبة بلا سردها:
// علاء الدين، نصر الله، أبو شقرا، أبي خليل، بو صعب، عبد النور…
const COMPOUND_FIRST_WORDS = new Set(["ابو", "ابي", "بو", "عبد"])
const COMPOUND_LAST_WORDS = new Set(["الدين", "الله"])

/** العائلات المركّبة التي لا تكفي فيها القاعدة أعلاه، لأن كلمتيها تصلحان منفردتين أيضاً. */
const KNOWN_COMPOUND_FAMILIES = new Set(
  [
    "الحاج حسن", "الحاج علي", "الحاج شحادة", "الحاج بطرس", "الحاج شاهين", "الحاج موسى", "الحاج دياب", "الحاج أحمد",
    "الشيخ علي", "الشيخ محمد", "الشيخ نجيب",
    "السيد أحمد", "السيد قاسم", "السيد حسن",
    "ابن خلدون", "بني طعمه",
    "محمد علي", "حيدر أحمد", "حسين علي", "قره علي", "قره بيت", "باشا العلي",
  ].map(normalize)
)

/** اسم العائلة من كلمات الاسم الكامل، أو "" إن لم يتضمّن الاسم عائلة واضحة. */
export function surnameFromWords(words: string[]): string {
  if (words.length < 2) return ""
  const [first, last] = words.slice(-2).map(normalize)
  const lastTwo = words.slice(-2).join(" ")

  if (COMPOUND_FIRST_WORDS.has(first) || COMPOUND_LAST_WORDS.has(last)) {
    // "نور الدين" أو "عبد الله" وحدهما اسم شخص أول، لا عائلة.
    return words.length >= 3 ? lastTwo : ""
  }
  if (words.length >= 3 && KNOWN_COMPOUND_FAMILIES.has(`${first} ${last}`)) return lastTwo
  return words[words.length - 1]
}
