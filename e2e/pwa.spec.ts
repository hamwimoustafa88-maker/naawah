import { canvas, expect, fillCompleteObituary, nameInput, openEditor, test } from "./fixtures"

test.use({ serviceWorkers: "allow" })

test("المحرر والتصدير يعملان بلا إنترنت بعد أول زيارة", async ({ page, context }) => {
  await openEditor(page)
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  // إعادة التحميل تضع الصفحة تحت تحكم العامل، ثم تُجلب حزم التصدير عبره.
  await page.evaluate(() => sessionStorage.clear())
  await page.reload()
  await page.waitForLoadState("networkidle")
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller))
  await page.waitForTimeout(2500)

  await context.setOffline(true)
  await page.reload()
  await expect(nameInput(page)).toBeVisible()
  await page.waitForTimeout(600)

  await fillCompleteObituary(page, "اختبار بلا إنترنت")
  await expect(canvas(page)).toContainText("اختبار بلا إنترنت")

  await page.getByText("إظهار تاريخ ومكان الوفاة في النعوة").click()
  await page.locator("input[type=date]:visible").first().fill("2026-03-05")
  const download = page.waitForEvent("download")
  await page.getByRole("button", { name: "تحميل PDF (A4)" }).first().click()
  expect((await download).suggestedFilename()).toContain("اختبار بلا إنترنت")
  await context.setOffline(false)
})

test("sw.js لا يُخزَّن مؤقتاً", async ({ request }) => {
  const response = await request.get("/sw.js")
  expect(response.status()).toBe(200)
  expect(response.headers()["cache-control"]).toContain("no-store")
})
