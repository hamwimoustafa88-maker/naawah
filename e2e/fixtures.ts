import { test as base, expect, type Locator, type Page } from "@playwright/test"

export const PUBLIC_ID = "test-public-id-1234567890"

export interface ApiCalls {
  archive: number
  stats: number
}

/** كل اختبار يعترض نقاط الكتابة والخدمة الخارجية، فلا يغادر الجهاز أي طلب. */
export const test = base.extend<{ calls: ApiCalls }>({
  calls: [
    async ({ page }, use) => {
      const calls: ApiCalls = { archive: 0, stats: 0 }
      await page.route("**/api/archive", (route) => {
        calls.archive++
        return route.fulfill({ json: { ok: true, publicId: PUBLIC_ID } })
      })
      await page.route("**/api/stats/increment", (route) => {
        calls.stats++
        return route.fulfill({ json: { ok: true } })
      })
      await page.route("https://ipapi.co/**", (route) => route.fulfill({ json: {} }))
      await use(calls)
    },
    { auto: true },
  ],
})

export { expect }

export async function openEditor(page: Page) {
  await page.goto("/create")
  await page.waitForLoadState("networkidle")
  // استعادة المسودة تعيد تركيب المحرر بعد الترطيب، فالكتابة قبلها تضيع.
  await page.waitForTimeout(400)
}

export const canvas = (page: Page) => page.locator("#obituary-canvas")
export const nameInput = (page: Page) => page.locator('input[placeholder="محمود محمد شهاب"]:visible')
export const prayerInput = (page: Page) => page.locator('input[placeholder="مسجد الشهداء"]:visible')

/** بطاقة فئة قرابة بترتيبها الظاهر: الوالدين، أرملته، ولده، ابنته، شقيقه، شقيقته. */
export function relativeCard(page: Page, index: number): Locator {
  return page.locator('button[aria-label="حذف فئة القرابة"]:visible').nth(index).locator("xpath=ancestor::*[.//input][1]")
}

export function fieldAfterLabel(page: Page, label: string): Locator {
  return page.locator(`label:visible:text-is("${label}")`).locator("xpath=following::input[1]")
}

export async function fillCompleteObituary(page: Page, name = "محمود اختبار شهاب") {
  await nameInput(page).fill(name)
  await prayerInput(page).fill("مسجد الاختبار")
}
