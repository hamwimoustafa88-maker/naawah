// محرك التاريخ — تحويل هجري عبر Intl (تقويم أم القرى)، بلا مكتبات خارجية ثقيلة.

import type { DateOrder, MonthStyle, NumeralSystem } from "./types"

const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩"

const LEVANTINE_MONTHS = [
  "كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران",
  "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول",
]

const EGYPTIAN_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
]

export function parseISODateUTC(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1))
}

function addDaysUTC(date: Date, days: number): Date {
  const copy = new Date(date)
  copy.setUTCDate(copy.getUTCDate() + days)
  return copy
}

/** يحوّل أي أرقام (غربية أو عربية-هندية) داخل نص إلى نظام الأرقام المطلوب. */
export function toNumerals(str: string, system: NumeralSystem): string {
  return str.replace(/[0-9٠-٩]/g, (ch) => {
    const val = ARABIC_INDIC.includes(ch) ? ARABIC_INDIC.indexOf(ch) : Number(ch)
    return system === "arabic-indic" ? ARABIC_INDIC[val] : String(val)
  })
}

function getHijriParts(date: Date): { day: string; month: string; year: string } {
  const fmt = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
  const parts = fmt.formatToParts(date)
  return {
    day: parts.find((p) => p.type === "day")?.value ?? "",
    month: parts.find((p) => p.type === "month")?.value ?? "",
    year: parts.find((p) => p.type === "year")?.value ?? "",
  }
}

export interface DualDateOptions {
  hijriOffsetDays: number
  order: DateOrder
  numerals: NumeralSystem
  months: MonthStyle
}

/** يُنتج التاريخ المزدوج الكامل، مثل: "٥ شوال ١٤٤٧ هـ، الموافق ٢٤ آذار ٢٠٢٦م" */
export function formatDualDate(isoDate: string, opts: DualDateOptions): string {
  if (!isoDate) return ""
  const base = parseISODateUTC(isoDate)
  const hijriBase = addDaysUTC(base, opts.hijriOffsetDays)
  const { day: hDay, month: hMonth, year: hYear } = getHijriParts(hijriBase)
  const hijriStr = toNumerals(`${hDay} ${hMonth} ${hYear}`, opts.numerals) + " هـ"

  const gDay = base.getUTCDate()
  const gMonthName = (opts.months === "levantine" ? LEVANTINE_MONTHS : EGYPTIAN_MONTHS)[base.getUTCMonth()]
  const gYear = base.getUTCFullYear()
  const gregStr = toNumerals(`${gDay} ${gMonthName} ${gYear}`, opts.numerals) + "م"

  return opts.order === "hijri-first"
    ? `${hijriStr}، الموافق ${gregStr}`
    : `${gregStr}، الموافق ${hijriStr}`
}

export function formatWeekdayName(isoDate: string): string {
  if (!isoDate) return ""
  const base = parseISODateUTC(isoDate)
  return new Intl.DateTimeFormat("ar", { weekday: "long", timeZone: "UTC" }).format(base)
}

export function calculateAge(birthISO: string, deathISO: string): number | null {
  if (!birthISO || !deathISO) return null
  const b = parseISODateUTC(birthISO)
  const d = parseISODateUTC(deathISO)
  let age = d.getUTCFullYear() - b.getUTCFullYear()
  const monthDiff = d.getUTCMonth() - b.getUTCMonth()
  if (monthDiff < 0 || (monthDiff === 0 && d.getUTCDate() < b.getUTCDate())) age--
  return age
}
