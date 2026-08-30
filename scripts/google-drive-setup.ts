// سكربت إعداد Google Drive — يُشغَّل مرة واحدة يدوياً محلياً (ليس جزءاً من
// predev/prebuild). يبدّل موافقة OAuth إلى refresh_token، وينشئ مجلد الأرشيف
// بنفسه (إلزامي مع نطاق drive.file — هذا النطاق لا يمنح رؤية مجلد أُنشئ يدوياً
// من واجهة Drive)، ثم يطبع القيم الأربعة لنسخها في .env.
//
// المتطلبات المسبقة (راجع docs/google-drive-setup.md للتفصيل):
//   1. مشروع Google Cloud مع تفعيل Drive API.
//   2. OAuth consent screen: External، Publishing status = In production
//      (⚠️ "Testing" ينهي صلاحية الـrefresh token بعد ٧ أيام فقط).
//   3. OAuth client ID من نوع "Desktop app".
//
// التشغيل: npx tsx scripts/google-drive-setup.ts
// يطلب CLIENT_ID وCLIENT_SECRET من مدخلات الطرفية (لا تُخزَّن، تُستعمل فوراً فقط).

import { createServer } from "node:http"
import { createInterface } from "node:readline/promises"

const REDIRECT_PORT = 4571
const REDIRECT_URI = `http://127.0.0.1:${REDIRECT_PORT}/callback`
const SCOPE = "https://www.googleapis.com/auth/drive.file"
const FOLDER_NAME = "أرشيف النعوة الإلكترونية"

async function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  try {
    return (await rl.question(question)).trim()
  } finally {
    rl.close()
  }
}

/** ينتظر إعادة توجيه المتصفح إلى REDIRECT_URI ويستخرج ?code=... منه. */
function waitForAuthCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url ?? "/", REDIRECT_URI)
      const code = url.searchParams.get("code")
      const error = url.searchParams.get("error")
      res.setHeader("Content-Type", "text/html; charset=utf-8")
      if (error) {
        res.end(`<p>فشلت الموافقة: ${error}. أغلق هذه النافذة وحاول مجدداً.</p>`)
        server.close()
        reject(new Error(`OAuth error: ${error}`))
        return
      }
      if (!code) {
        res.end("<p>لم يصل رمز الموافقة. أغلق هذه النافذة.</p>")
        return
      }
      res.end("<p>تم! يمكنك إغلاق هذه النافذة والعودة إلى الطرفية.</p>")
      server.close()
      resolve(code)
    })
    server.listen(REDIRECT_PORT)
  })
}

async function main() {
  console.log("=== إعداد أرشفة Google Drive ===\n")
  const clientId = await prompt("Client ID: ")
  const clientSecret = await prompt("Client Secret: ")
  if (!clientId || !clientSecret) throw new Error("Client ID وClient Secret مطلوبان")

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  authUrl.searchParams.set("client_id", clientId)
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI)
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("scope", SCOPE)
  // access_type=offline + prompt=consent إلزاميان معاً — بدونهما Google لا يُعيد
  // refresh_token إطلاقاً (فقط access_token قصير العمر) إن كان قد سبق ووافق المستخدم مرة.
  authUrl.searchParams.set("access_type", "offline")
  authUrl.searchParams.set("prompt", "consent")

  console.log("\nافتح هذا الرابط ووافق بحساب Gmail الذي تريد أرشفة النعوات فيه:\n")
  console.log(authUrl.toString())
  console.log(`\nبانتظار إعادة التوجيه على ${REDIRECT_URI} ...`)

  const code = await waitForAuthCode()

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  })
  const tokenJson = await tokenRes.json()
  if (!tokenRes.ok) {
    throw new Error(`فشل تبديل الرمز: ${JSON.stringify(tokenJson)}`)
  }
  const refreshToken: string | undefined = tokenJson.refresh_token
  const accessToken: string = tokenJson.access_token
  if (!refreshToken) {
    throw new Error(
      "لم يُعَد refresh_token — على الأرجح كان هذا التطبيق قد وافق عليه هذا الحساب من قبل بلا " +
        "إبطال. اذهب إلى https://myaccount.google.com/permissions وأبطل وصول التطبيق ثم أعد المحاولة."
    )
  }

  console.log("\nإنشاء مجلد الأرشيف في Drive ...")
  const folderRes = await fetch("https://www.googleapis.com/drive/v3/files?fields=id,webViewLink", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: FOLDER_NAME, mimeType: "application/vnd.google-apps.folder" }),
  })
  const folderJson = await folderRes.json()
  if (!folderRes.ok) {
    throw new Error(`فشل إنشاء المجلد: ${JSON.stringify(folderJson)}`)
  }

  console.log("\n=== انسخ هذه القيم إلى .env ===\n")
  console.log(`GOOGLE_DRIVE_CLIENT_ID=${clientId}`)
  console.log(`GOOGLE_DRIVE_CLIENT_SECRET=${clientSecret}`)
  console.log(`GOOGLE_DRIVE_REFRESH_TOKEN=${refreshToken}`)
  console.log(`GOOGLE_DRIVE_FOLDER_ID=${folderJson.id}`)
  console.log(`\nرابط المجلد: ${folderJson.webViewLink}`)
}

main().catch((err) => {
  console.error("\nفشل الإعداد:", err instanceof Error ? err.message : err)
  process.exit(1)
})
