import { expect, openEditor, test } from "./fixtures"

test.beforeEach(async ({ page }) => {
  await openEditor(page)
})

test("لا تمرير أفقي وأزرار الترويسة كلها ظاهرة", async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
  for (const name of ["تراجع", "إعادة", "نعواتي المحفوظة"]) {
    await expect(page.getByRole("button", { name }).first()).toBeInViewport()
  }
})

test("إضافة فئة تنقل مباشرة لشاشتها وتظهر في النعوة", async ({ page }) => {
  await page.getByRole("button", { name: "إضافة فئة" }).click()
  await page.locator("select:visible").selectOption({ label: "أحفاده" })
  await page.locator('input[placeholder="الاسم"]:visible').fill("زياد")
  await expect(page.locator("#obituary-canvas-mobile")).toContainText("حفيده:")
})

test("لصق الأسماء متاح داخل الشاشة المنفردة", async ({ page }) => {
  await page.getByRole("button", { name: "ولده" }).click()
  await page.getByRole("button", { name: "لصق عدة أسماء" }).click()
  await page.getByLabel("أسماء متعددة").fill("خالد، عمر")
  await page.getByRole("button", { name: "إضافة الأسماء" }).click()
  await expect(page.locator("#obituary-canvas-mobile")).toContainText("خالد وعمر")
})

test("قائمة التحميل تجمع الصيغ الثلاث تحت المعاينة", async ({ page }) => {
  await page.getByRole("button", { name: "إغلاق" }).first().click()
  await expect(page.getByRole("button", { name: "رابط ورمز QR" })).toBeVisible()
  await page.getByRole("button", { name: "تحميل", exact: true }).click()
  for (const name of ["صورة PNG", "PDF (A4)", "PDF للمطبعة"]) {
    await expect(page.getByRole("menuitem", { name })).toBeVisible()
  }
})
