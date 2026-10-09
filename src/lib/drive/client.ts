// عميل Google Drive الخادمي — رفع صور النعوات المُصدَّرة إلى مجلد أرشيف واحد.
// بلا مكتبة googleapis عمداً (تبعية ضخمة لا مبرّر لها لثلاثة نداءات HTTP فقط) —
// fetch خام + بروتوكول OAuth refresh_token + multipart/related القياسي لـDrive v3.
// راجع docs/google-drive-setup.md لخطوات الحصول على المتغيّرات الأربعة أدناه.

const TOKEN_URL = "https://oauth2.googleapis.com/token"
const UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files"

interface CachedToken {
  accessToken: string
  expiresAt: number // Date.now() + ms
}

// يُخزَّن على مستوى الوحدة (module-level) — نسخة serverless الدافئة (نفس lambda
// warm بين طلبين متتاليين) تعيد استعماله بدل نداء /token عند كل تصدير. يُعاد
// تعيينه تلقائياً حين تنتهي صلاحيته (ناقص ٦٠ ثانية احتياطاً لفارق الشبكة).
let cachedToken: CachedToken | null = null

/** هل كل متغيّرات البيئة الأربعة اللازمة موجودة؟ يُستعمل لتفعيل/تعطيل الأرشفة
 * بصمت بلا أي أثر على التصدير نفسه — راجع src/app/api/archive/route.ts. */
export function isDriveConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_DRIVE_CLIENT_ID &&
      process.env.GOOGLE_DRIVE_CLIENT_SECRET &&
      process.env.GOOGLE_DRIVE_REFRESH_TOKEN &&
      process.env.GOOGLE_DRIVE_FOLDER_ID
  )
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.accessToken
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_DRIVE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET ?? "",
      refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
  })
  if (!res.ok) {
    throw new Error(`فشل تجديد رمز Drive: ${res.status} ${await res.text()}`)
  }
  const json = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = {
    accessToken: json.access_token,
    expiresAt: Date.now() + (json.expires_in - 60) * 1000,
  }
  return cachedToken.accessToken
}

/**
 * يبني جسم multipart/related (ميتاداتا JSON + بايتات الصورة) بحدود Drive القياسية.
 * Blob لا Buffer عمداً — Blob مقبول مباشرة كـBodyInit لـfetch بلا أي تعارض في
 * أنواع TypeScript (Buffer/Uint8Array الحديثان معرَّفان عموميين على ArrayBufferLike
 * في إصدار TS الحالي، بينما BodyInit يتوقّع ArrayBuffer محدَّداً تحديداً).
 */
function buildMultipartBody(metadata: Record<string, unknown>, bytes: ArrayBuffer, boundary: string): Blob {
  const head =
    `--${boundary}\r\n` +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    "Content-Type: image/jpeg\r\n\r\n"
  const tail = `\r\n--${boundary}--`
  return new Blob([head, bytes, tail])
}

export interface UploadArchiveArgs {
  bytes: ArrayBuffer
  filename: string
  /** معرّف ملف موجود لتحديثه (نفس archiveKey أُرشِف من قبل) بدل إنشاء ملف جديد. */
  existingFileId?: string
}

export interface UploadArchiveResult {
  fileId: string
  webViewLink: string
}

/** يرفع (أو يُحدِّث) صورة JPEG واحدة في مجلد الأرشيف. يرمي عند أي فشل — المستدعي
 * (src/app/api/archive/route.ts) هو من يبتلع الخطأ صامتاً؛ هذه الدالة لا تُخفي شيئاً. */
export async function uploadArchiveJpeg({ bytes, filename, existingFileId }: UploadArchiveArgs): Promise<UploadArchiveResult> {
  const accessToken = await getAccessToken()
  const boundary = `naawah-${Date.now().toString(36)}`

  const isUpdate = Boolean(existingFileId)
  const metadata: Record<string, unknown> = { name: filename }
  // parents غير مسموح به عند التحديث (PATCH) — الملف يبقى في مكانه أصلاً.
  if (!isUpdate) metadata.parents = [process.env.GOOGLE_DRIVE_FOLDER_ID]

  const body = buildMultipartBody(metadata, bytes, boundary)
  const url = new URL(isUpdate ? `${UPLOAD_URL}/${existingFileId}` : UPLOAD_URL)
  url.searchParams.set("uploadType", "multipart")
  url.searchParams.set("fields", "id,webViewLink")

  const res = await fetch(url, {
    method: isUpdate ? "PATCH" : "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body,
  })
  if (!res.ok) {
    throw new Error(`فشل رفع الأرشيف إلى Drive: ${res.status} ${await res.text()}`)
  }
  const json = (await res.json()) as { id: string; webViewLink: string }
  return { fileId: json.id, webViewLink: json.webViewLink }
}
