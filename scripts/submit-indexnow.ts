// يُبلِّغ IndexNow (Bing وYandex معاً، ومحرّكات أخرى مشتركة في البروتوكول) بكل
// روابط السيتماب دفعة واحدة — بلا حاجة لأي حساب أو تسجيل مسبق، فقط ملف تحقّق
// ثابت في public/ يحمل نفس المفتاح (راجع public/f3214b964acf35c8eb79916f0deabcb2.txt).
//
// **لا يُشغَّل تلقائياً في أي hook بناء (predev/prebuild/postbuild)** — تشغيله
// يُرسِل طلب شبكة فعلياً لخدمة خارجية تُخطر بروابط الموقع الحقيقية
// (enaawah.scouthub.dev)، فهو فعل خارجي يجب أن يبقى قراراً واعياً يُشغَّله
// المستخدم يدوياً بعد نشر أي دفعة صفحات جديدة فعلياً على الإنتاج، لا كل بناء
// محلي. شغّله هكذا بعد كل نشر يضيف صفحات جديدة:
//
//   npx tsx scripts/submit-indexnow.ts
//
// المرجع الرسمي: https://www.indexnow.org/documentation

import { SITE_URL } from "../src/lib/seo/site"
import { VISIBLE_TEMPLATES } from "../src/lib/templates/registry"
import { GUIDES } from "../src/lib/seo/guides"

const INDEXNOW_KEY = "f3214b964acf35c8eb79916f0deabcb2"

function allUrls(): string[] {
  const staticPaths = ["/", "/create", "/templates", "/ayat", "/guides", "/faq", "/open-source"]
  const templatePaths = VISIBLE_TEMPLATES.map((t) => `/templates/${t.id}`)
  const guidePaths = GUIDES.map((g) => `/guides/${g.slug}`)
  return [...staticPaths, ...templatePaths, ...guidePaths].map((p) => new URL(p, SITE_URL).toString())
}

async function main() {
  const host = new URL(SITE_URL).host
  const urlList = allUrls()

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  })

  console.log(`IndexNow: أُرسل ${urlList.length} رابطاً — استجابة الخادم: ${res.status} ${res.statusText}`)
  if (!res.ok) {
    console.error(await res.text().catch(() => ""))
    process.exitCode = 1
  }
}

main()
