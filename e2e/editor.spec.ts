import { canvas, expect, fieldAfterLabel, nameInput, openEditor, relativeCard, test } from "./fixtures"

test.beforeEach(async ({ page }) => {
  await openEditor(page)
})

test("صياغة نعوة ذكر مع المتوفين والعائلات المركّبة", async ({ page }) => {
  await nameInput(page).fill("محمود اختبار شمس الدين")
  await relativeCard(page, 0).locator('input[placeholder="اسم الأب"]').fill("أحمد شمس الدين")
  await relativeCard(page, 0).getByText("متوفى", { exact: true }).first().click()
  await relativeCard(page, 1).locator(`input[placeholder="الاسم"]`).fill("سعاد كرم")

  await expect(canvas(page)).toContainText("والده:")
  await expect(canvas(page)).toContainText("المرحوم أحمد شمس الدين")
  await expect(canvas(page)).toContainText("أرملته:")
  await expect(canvas(page)).toContainText("آل شمس الدين، كرم")
})

test("التاريخ يُطبع بصيغة «المتوفى» الصحيحة", async ({ page }) => {
  await nameInput(page).fill("فلان اختبار")
  await page.getByText("إظهار تاريخ ومكان الوفاة في النعوة").click()
  await page.locator("input[type=date]:visible").first().fill("2026-03-05")

  await expect(canvas(page)).toContainText("المتوفى بتاريخ")
  await expect(canvas(page)).not.toContainText("المتوفي")
})

test("فقيدة أنثى: لا بطاقة أرملته ولا طباعتها", async ({ page }) => {
  await relativeCard(page, 1).locator(`input[placeholder="الاسم"]`).fill("اسم لا يجوز طبعه")
  await expect(canvas(page)).toContainText("أرملته:")

  await page.getByRole("button", { name: "أنثى", exact: true }).click()

  await expect(canvas(page)).not.toContainText("أرملته")
  await expect(canvas(page)).not.toContainText("اسم لا يجوز طبعه")
})

test("عازبة: لا يبقى سطر الزوج مطبوعاً", async ({ page }) => {
  await page.getByRole("button", { name: "أنثى", exact: true }).click()
  await nameInput(page).fill("نازك اختبار")
  await fieldAfterLabel(page, "اسم الزوج").fill("كمال اختبار")
  await expect(canvas(page)).toContainText("زوجة كمال اختبار")

  await page.getByText("عازبة (لم تتزوّج قط)").click()

  await expect(canvas(page)).not.toContainText("كمال اختبار")
})

test("لصق عدة أسماء يملأ الصف الفارغ ويلتقط المتوفين", async ({ page }) => {
  const sons = relativeCard(page, 2)
  await sons.getByRole("button", { name: "لصق عدة أسماء" }).click()
  await sons.getByLabel("أسماء متعددة").fill("خالد\nوليد، والمرحوم عمر")
  await sons.getByRole("button", { name: "إضافة الأسماء" }).click()

  await expect(sons.locator(`input[placeholder="الاسم"]`)).toHaveCount(3)
  await expect(canvas(page)).toContainText("خالد ووليد والمرحوم عمر")
  await expect(sons.getByLabel("أسماء متعددة")).toHaveCount(0)
})

test("التراجع والإعادة يجمعان الكتابة المتتالية", async ({ page }) => {
  const undo = page.getByRole("button", { name: "تراجع" })
  const redo = page.getByRole("button", { name: "إعادة", exact: true })
  await expect(undo).toBeDisabled()

  await nameInput(page).pressSequentially("سامي", { delay: 30 })
  await expect(canvas(page)).toContainText("سامي")
  await page.waitForTimeout(700)

  await undo.click()
  await expect(nameInput(page)).toHaveValue("")
  await expect(canvas(page)).not.toContainText("سامي")

  await redo.click()
  await expect(nameInput(page)).toHaveValue("سامي")
})

test("اختصار Ctrl+Z يعمل خارج حقول النص", async ({ page }) => {
  await nameInput(page).fill("سامي")
  await page.waitForTimeout(700)
  await page.locator("h3, h2").first().click()
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
  await page.keyboard.press("Control+KeyZ")
  await expect(nameInput(page)).toHaveValue("")
})

test("الحفظ التلقائي يستعيد النعوة، ونعوة جديدة تفرّغها", async ({ page }) => {
  await nameInput(page).fill("اختبار الاستعادة")
  await page.waitForTimeout(500)
  await page.reload()
  await page.waitForLoadState("networkidle")
  await expect(nameInput(page)).toHaveValue("اختبار الاستعادة")

  await page.getByRole("button", { name: "نعواتي المحفوظة" }).click()
  await page.getByRole("button", { name: "نعوة جديدة" }).click()
  await expect(nameInput(page)).toHaveValue("")
  await expect(page.getByRole("button", { name: "تراجع" })).toBeDisabled()
})

test("زر الوضع الافتراضي يفرّغ النعوة ويبقى المسح بعد إعادة الفتح", async ({ page }) => {
  const clear = page.getByRole("button", { name: "العودة إلى الوضع الافتراضي" })
  await expect(clear).toHaveCount(0)

  await nameInput(page).fill("نعوة سابقة")
  await page.waitForTimeout(500)
  await clear.click()
  await expect(nameInput(page)).toHaveValue("")
  await expect(clear).toHaveCount(0)

  await page.reload()
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(400)
  await expect(nameInput(page)).toHaveValue("")

  await page.getByRole("button", { name: "نعواتي المحفوظة" }).click()
  await expect(page.getByRole("dialog", { name: "نعواتي المحفوظة" })).toContainText("نعوة سابقة")
})

test("قسم القالب يعرض بقية القوالب بنعوة المستخدم ويخفي القالب الحالي", async ({ page }) => {
  await nameInput(page).fill("اسم حقيقي للمعاينة")
  const previews = page.locator('[id^="template-preview-"]:visible')
  await expect(previews).toHaveCount(6)
  for (let i = 0; i < 6; i++) await expect(previews.nth(i)).toContainText("اسم حقيقي للمعاينة")
})

test("تنبيه الخط الصغير يظهر مع المحتوى الكثيف", async ({ page }) => {
  const sons = relativeCard(page, 2)
  await sons.getByRole("button", { name: "لصق عدة أسماء" }).click()
  const names = Array.from({ length: 260 }, (_, i) => `محمد عبد الرحمن الاختبار الطويل عائلة${i % 9}`).join("\n")
  await sons.getByLabel("أسماء متعددة").fill(names)
  await sons.getByRole("button", { name: "إضافة الأسماء" }).click()

  await expect(page.locator("p[role=status]:visible")).toContainText(/(أقل من ١٢|أطول من صفحة)/, { timeout: 15_000 })
})

test("المعاينة تعرض الصفحة كاملة بلا تمرير داخلي", async ({ page }) => {
  const box = await canvas(page).boundingBox()
  expect(box).not.toBeNull()
  expect(box!.y + box!.height).toBeLessThanOrEqual(page.viewportSize()!.height)
})
