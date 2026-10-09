import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isDriveConfigured, uploadArchiveJpeg } from "@/lib/drive/client"

export const runtime = "nodejs"
export const maxDuration = 30

const MAX_FILE_BYTES = 4 * 1024 * 1024

/** نفس منطق تنظيف اسم الملف الحرفي في lib/export/actions.ts (buildFileName) —
 * لا يُستورَد من هناك لأن actions.ts عميل-فقط (يستعمل html-to-image) وهذا الملف خادم-فقط. */
function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "").trim()
}

/**
 * يؤرشف صورة نعوة واحدة مُصدَّرة فعلياً في Google Drive، ويُسجّل صفّاً في
 * ArchivedObituary. صامت تماماً بالتصميم — أي فشل (Drive غير مُهيَّأ، رفع فاشل،
 * قاعدة بيانات) يُعيد { ok: false } بحالة 200 فلا يظهر أي خطأ للمستخدم أبداً ولا
 * يعطّل التصدير نفسه؛ راجع notifyStats() في lib/export/actions.ts لنفس النمط.
 */
export async function POST(request: Request) {
  try {
    if (!isDriveConfigured()) return NextResponse.json({ ok: false })

    const form = await request.formData()
    const file = form.get("file")
    const archiveKey = form.get("archiveKey")
    const deceasedName = form.get("deceasedName")
    const deathDateISO = form.get("deathDateISO")
    const deathDateAr = form.get("deathDateAr")
    const templateId = form.get("templateId")
    const exportKind = form.get("exportKind")
    // اختياريان — قد يصلا فارغين (سلسلة "") إن لم يملأهما المستخدم في النعوة أصلاً.
    const deathPlaceNote = form.get("deathPlaceNote")
    const condolencesInfo = form.get("condolencesInfo")

    if (
      !(file instanceof Blob) ||
      typeof archiveKey !== "string" ||
      !archiveKey ||
      typeof deceasedName !== "string" ||
      !deceasedName.trim() ||
      typeof deathDateISO !== "string" ||
      typeof deathDateAr !== "string" ||
      typeof templateId !== "string" ||
      typeof exportKind !== "string" ||
      typeof deathPlaceNote !== "string" ||
      typeof condolencesInfo !== "string"
    ) {
      return NextResponse.json({ ok: false })
    }
    if (file.type !== "image/jpeg" || file.size === 0 || file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ ok: false })
    }

    const headers = request.headers
    const forwardedFor = headers.get("x-forwarded-for")
    const ip = forwardedFor?.split(",")[0]?.trim() || headers.get("x-real-ip") || ""
    const country = headers.get("x-vercel-ip-country") ?? undefined
    const region = headers.get("x-vercel-ip-country-region") ?? undefined
    const salt = process.env.IP_SALT ?? "naawah-dev-salt"
    const ipHash = ip ? createHash("sha256").update(ip + salt).digest("hex") : undefined

    const namePart = sanitizeFilename(deceasedName.trim())
    const datePart = deathDateISO ? ` - ${deathDateISO}` : ""
    const filename = `${namePart}${datePart}.jpg`

    const existing = await prisma.archivedObituary.findUnique({ where: { archiveKey } })
    const bytes = await file.arrayBuffer()

    if (existing) {
      const uploaded = await uploadArchiveJpeg({ bytes, filename, existingFileId: existing.driveFileId })
      await prisma.archivedObituary.update({
        where: { archiveKey },
        data: {
          deceasedName: deceasedName.trim(),
          deathDateISO,
          deathDateAr,
          deathPlaceNote: deathPlaceNote || null,
          condolencesInfo: condolencesInfo || null,
          templateId,
          exportKind,
          driveFileId: uploaded.fileId,
          driveViewUrl: uploaded.webViewLink,
          exportCount: { increment: 1 },
        },
      })
    } else {
      const uploaded = await uploadArchiveJpeg({ bytes, filename })
      await prisma.archivedObituary.create({
        data: {
          archiveKey,
          deceasedName: deceasedName.trim(),
          deathDateISO,
          deathDateAr,
          deathPlaceNote: deathPlaceNote || null,
          condolencesInfo: condolencesInfo || null,
          templateId,
          exportKind,
          driveFileId: uploaded.fileId,
          driveViewUrl: uploaded.webViewLink,
          ipHash,
          country,
          region,
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("فشلت أرشفة النعوة:", error)
    return NextResponse.json({ ok: false })
  }
}
