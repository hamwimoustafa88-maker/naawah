// الرابط العام للنعوة يستعمل معرّف ملف Drive: طويل وعشوائي، ولا يمنح حامله حق تعديل
// النعوة (ذاك يتطلّب archiveKey الذي لا يغادر متصفح صاحبها).

import { cache } from "react"
import { prisma } from "@/lib/prisma"

const PUBLIC_ID_PATTERN = /^[\w-]{16,128}$/

export const findPublicObituary = cache(async (id: string) => {
  if (!PUBLIC_ID_PATTERN.test(id)) return null
  try {
    return await prisma.archivedObituary.findFirst({
      where: { driveFileId: id },
      select: { deceasedName: true, deathDateAr: true },
    })
  } catch (error) {
    console.error("فشل جلب النعوة العامة:", error)
    return null
  }
})
