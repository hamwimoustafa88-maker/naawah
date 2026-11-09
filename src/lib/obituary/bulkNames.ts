// تحليل نص ملصوق (أسماء أقارب من نعوة قديمة أو من واتساب) إلى أسماء منفصلة.

export interface BulkNameEntry {
  name: string
  isDeceased: boolean
}

// " و " المستقلة فاصل فقط حين تحيط بها مسافات، حتى لا تنكسر أسماء مثل وليد ووسام.
const SEPARATORS = /[\r\n،,؛;]+|\s+و\s+/
const LIST_MARKER = /^(?:[\d٠-٩]+\s*[-.)]\s*|[-•*]\s*)/
const DECEASED_MARKER = /^و?المرحوم(?:ة)?\s+/

function parseEntry(raw: string): BulkNameEntry | null {
  const text = raw.trim().replace(LIST_MARKER, "").replace(/\s+/g, " ").trim()
  const name = text.replace(DECEASED_MARKER, "")
  return name ? { name, isDeceased: name !== text } : null
}

export function parseBulkNames(text: string): BulkNameEntry[] {
  return text.split(SEPARATORS).flatMap((part) => parseEntry(part) ?? [])
}
