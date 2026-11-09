import { NextResponse } from "next/server"
import { HOUR_MS, hasJpegSignature, hashedClientIp, isSameOriginRequest } from "@/lib/api/requestGuard"
import { prisma } from "@/lib/prisma"
import { isDriveConfigured, uploadArchiveJpeg } from "@/lib/drive/client"

export const runtime = "nodejs"
export const maxDuration = 30

const MAX_FILE_BYTES = 4 * 1024 * 1024
const MAX_BODY_BYTES = MAX_FILE_BYTES + 64 * 1024
const ARCHIVE_KEY_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const EXPORT_KINDS = new Set(["png", "pdf", "share", "print", "link"])
// عدد مكاتب ومطابع النعي من عنوان واحد يبرّر سقفاً مريحاً؛ الهدف منع إغراق Drive لا تقييد الاستعمال.
const MAX_NEW_ARCHIVES_PER_HOUR = 30
const MIN_UPDATE_INTERVAL_MS = 2000

const withinLength = (value: string, max: number) => value.length <= max

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
    if (!isDriveConfigured() || !isSameOriginRequest(request.headers)) return NextResponse.json({ ok: false })
    if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return NextResponse.json({ ok: false })

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
      !ARCHIVE_KEY_PATTERN.test(archiveKey) ||
      typeof deceasedName !== "string" ||
      !deceasedName.trim() ||
      !withinLength(deceasedName, 200) ||
      typeof deathDateISO !== "string" ||
      !withinLength(deathDateISO, 10) ||
      typeof deathDateAr !== "string" ||
      !withinLength(deathDateAr, 120) ||
      typeof templateId !== "string" ||
      !withinLength(templateId, 64) ||
      typeof exportKind !== "string" ||
      !EXPORT_KINDS.has(exportKind) ||
      typeof deathPlaceNote !== "string" ||
      !withinLength(deathPlaceNote, 300) ||
      typeof condolencesInfo !== "string" ||
      !withinLength(condolencesInfo, 3000)
    ) {
      return NextResponse.json({ ok: false })
    }
    if (file.type !== "image/jpeg" || file.size === 0 || file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ ok: false })
    }

    const bytes = await file.arrayBuffer()
    if (!hasJpegSignature(bytes)) return NextResponse.json({ ok: false })

    const headers = request.headers
    const country = headers.get("x-vercel-ip-country") ?? undefined
    const region = headers.get("x-vercel-ip-country-region") ?? undefined
    const ipHash = hashedClientIp(headers)

    const namePart = sanitizeFilename(deceasedName.trim())
    const datePart = deathDateISO ? ` - ${deathDateISO}` : ""
    const filename = `${namePart}${datePart}.jpg`

    const existing = await prisma.archivedObituary.findUnique({ where: { archiveKey } })

    if (existing && Date.now() - existing.updatedAt.getTime() < MIN_UPDATE_INTERVAL_MS) {
      return NextResponse.json({ ok: true, publicId: existing.driveFileId })
    }
    if (!existing && ipHash) {
      const recent = await prisma.archivedObituary.count({
        where: { ipHash, createdAt: { gte: new Date(Date.now() - HOUR_MS) } },
      })
      if (recent >= MAX_NEW_ARCHIVES_PER_HOUR) return NextResponse.json({ ok: false })
    }

    let publicId: string
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
      publicId = uploaded.fileId
    } else {
      const uploaded = await uploadArchiveJpeg({ bytes, filename })
      publicId = uploaded.fileId
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

    // publicId هو معرّف ملف Drive لا archiveKey: الرابط العام يصل لأي مستلم، بينما
    // archiveKey هو ما يخوّل استبدال الصورة عبر هذه النقطة.
    return NextResponse.json({ ok: true, publicId })
  } catch (error) {
    console.error("فشلت أرشفة النعوة:", error)
    return NextResponse.json({ ok: false })
  }
}
