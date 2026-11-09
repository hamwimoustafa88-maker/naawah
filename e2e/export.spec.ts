import { readFile } from "node:fs/promises"
import { PUBLIC_ID, expect, fillCompleteObituary, openEditor, test } from "./fixtures"

const CONTINUE = "المتابعة رغم ذلك"
const pngButton = "تحميل صورة PNG"
const pdfButton = "تحميل PDF (A4)"

test.beforeEach(async ({ page }) => {
  await openEditor(page)
})

test("نعوة ناقصة تُظهر تنبيهاً يمكن الرجوع منه", async ({ page }) => {
  await page.getByRole("button", { name: pngButton }).first().click()
  const dialog = page.getByRole("alertdialog")
  await expect(dialog).toContainText("لم يُكتب اسم الفقيد")
  await expect(dialog).toContainText("مكان صلاة الجنازة")
  await dialog.getByRole("button", { name: "العودة للتعديل" }).click()
  await expect(dialog).toHaveCount(0)
})

test("نعوة بلا اسم تُصدَّر عند الإصرار ولا تُحتسب ولا تُؤرشف", async ({ page, calls }) => {
  await page.getByRole("button", { name: pdfButton }).first().click()
  const download = page.waitForEvent("download")
  await page.getByRole("button", { name: CONTINUE }).click()
  expect((await download).suggestedFilename()).toBe("النعوة الإلكترونية.pdf")
  await page.waitForTimeout(500)
  expect(calls).toEqual({ archive: 0, stats: 0 })
})

test("PNG وPDF بأسماء صحيحة وأرشفة عند اكتمال النعوة", async ({ page, calls }) => {
  await fillCompleteObituary(page)
  await page.getByText("إظهار تاريخ ومكان الوفاة في النعوة").click()
  await page.locator("input[type=date]:visible").first().fill("2026-03-05")

  const png = page.waitForEvent("download")
  await page.getByRole("button", { name: pngButton }).first().click()
  expect((await png).suggestedFilename()).toBe("النعوة الإلكترونية - محمود اختبار شهاب.png")

  await expect.poll(() => calls.archive, { timeout: 20_000 }).toBe(1)
  expect(calls.stats).toBe(1)

  const pdf = page.waitForEvent("download")
  await page.getByRole("button", { name: pdfButton }).first().click()
  expect((await pdf).suggestedFilename()).toBe("النعوة الإلكترونية - محمود اختبار شهاب.pdf")
})

test("PDF المطبعة أكبر من A4 بهوامش النزف والقص", async ({ page }) => {
  await fillCompleteObituary(page)
  await page.getByText("إظهار تاريخ ومكان الوفاة في النعوة").click()
  await page.locator("input[type=date]:visible").first().fill("2026-03-05")

  const download = page.waitForEvent("download")
  await page.getByRole("button", { name: "تحميل", exact: true }).click()
  await page.getByRole("menuitem", { name: "PDF للمطبعة" }).click()
  const file = await download
  expect(file.suggestedFilename()).toContain("للمطبعة")

  const bytes = await readFile(await file.path())
  // ٢٣٠×٣١٧مم = ٦٥٢×٨٩٩ نقطة تقريباً.
  expect(bytes.toString("latin1")).toMatch(/MediaBox \[0 0 65[12]\.\d+ 89[89]\.\d+\]/)
})

test("رابط النعوة يعرض الرابط وQR وواتساب", async ({ page, calls }) => {
  await fillCompleteObituary(page)
  await page.getByText("إظهار تاريخ ومكان الوفاة في النعوة").click()
  await page.locator("input[type=date]:visible").first().fill("2026-03-05")

  await page.getByRole("button", { name: "رابط ورمز QR" }).click()
  const dialog = page.getByRole("dialog", { name: "رابط النعوة" })
  await expect(dialog.getByLabel("الرابط")).toHaveValue(new RegExp(`/n/${PUBLIC_ID}$`))
  await expect(dialog.getByRole("img", { name: "رمز QR لرابط النعوة" }).locator("path")).toHaveAttribute("d", /^M/)
  await expect(dialog.getByRole("link", { name: "إرسال عبر واتساب" })).toHaveAttribute("href", /^https:\/\/wa\.me\//)
  expect(calls.archive).toBe(1)
})
