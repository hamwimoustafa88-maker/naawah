// قيم تعبئة صيغ النعي الجاهزة في الأدلّة من نعوة محفوظة. الحقل الغائب يبقى قالبه
// الأصلي ("[اسم المسجد]") ظاهراً، فيعرف القارئ ما لم يُدخله بعد.

import { calculateAge, formatDualDate, formatWeekdayName, toNumerals } from "./hijri"
import { deceasedNameLine, lastNameOf, relativesBlocks } from "./render"
import type { ObituaryData } from "./types"

export type GuideField =
  | "fullName" | "deathWeekday" | "deathDate" | "age"
  | "prayerTime" | "prayerDay" | "mosque" | "cemetery"
  | "relatives" | "timeAndPlace"

export type GuideFieldValues = Partial<Record<GuideField, string>>

function relativesSentence(data: ObituaryData): string | undefined {
  const groups = relativesBlocks(data).map((group) => `${group.label}: ${group.text}`)
  const surname = lastNameOf(data.deceased.name)
  const closing = surname ? `وعموم آل ${surname} وأصهارهم` : ""
  const parts = [...groups, closing].filter(Boolean)
  return parts.length > 0 ? `${parts.join("، ")}.` : undefined
}

export function guideFieldValues(data: ObituaryData): GuideFieldValues {
  const { deceased, funeral, format } = data
  const prayerDate = funeral.burialDateISO || deceased.deathDateISO
  const prayerWeekday = formatWeekdayName(prayerDate)
  const prayerDay = prayerWeekday ? `يوم ${prayerWeekday}` : ""
  const age = deceased.birthDateISO ? calculateAge(deceased.birthDateISO, deceased.deathDateISO) : null
  const timeAndPlace = [funeral.prayerTimeNote, prayerDay, funeral.prayerLocation && `في ${funeral.prayerLocation}`]
    .filter(Boolean)
    .join(" ")

  const values: GuideFieldValues = {
    fullName: deceasedNameLine(deceased),
    deathWeekday: formatWeekdayName(deceased.deathDateISO),
    deathDate: formatDualDate(deceased.deathDateISO, {
      hijriOffsetDays: deceased.hijriOffsetDays,
      order: format.dateOrder,
      numerals: format.numerals,
      months: format.months,
    }),
    age: age === null ? "" : toNumerals(String(age), format.numerals),
    prayerTime: funeral.prayerTimeNote,
    prayerDay,
    mosque: funeral.prayerLocation,
    cemetery: funeral.burialLocation,
    relatives: relativesSentence(data),
    timeAndPlace,
  }
  return values
}
