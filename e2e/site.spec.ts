import { expect, test } from "./fixtures"

for (const path of ["/", "/create", "/templates", "/guides", "/faq", "/ayat", "/about", "/contact", "/privacy", "/terms", "/open-source", "/llms.txt", "/sitemap.xml", "/robots.txt"]) {
  test(`الصفحة تعمل: ${path}`, async ({ request }) => {
    expect((await request.get(path)).status()).toBe(200)
  })
}

test("صفحة غير موجودة تعيد 404", async ({ request }) => {
  expect((await request.get("/this-page-does-not-exist")).status()).toBe(404)
})

test("لا ادّعاء بأن البيانات لا تغادر المتصفح", async ({ page }) => {
  for (const path of ["/", "/faq", "/open-source"]) {
    await page.goto(path)
    await expect(page.locator("body")).not.toContainText("لا تغادر")
  }
})

test("الرابط العام غير الموجود يعيد 404", async ({ request }) => {
  expect((await request.get("/n/not-a-real-public-id-123456")).status()).toBe(404)
  expect((await request.get("/n/not-a-real-public-id-123456/image")).status()).toBe(404)
})

test("نقاط الكتابة ترفض الطلبات من مصدر آخر", async ({ playwright, baseURL }) => {
  const context = await playwright.request.newContext({ baseURL, extraHTTPHeaders: { Origin: "https://evil.example" } })
  const stats = await context.post("/api/stats/increment", { data: { templateId: "modern-minimal" } })
  expect(stats.status()).toBe(403)
  const archive = await context.post("/api/archive", { multipart: { archiveKey: "x" } })
  expect(await archive.json()).toEqual({ ok: false })
  await context.dispose()
})
