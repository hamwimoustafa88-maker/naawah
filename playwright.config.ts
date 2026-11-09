import { defineConfig, devices } from "@playwright/test"

const PORT = 3100

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "ar",
    // يُفعَّل صراحةً في pwa.spec.ts فقط: عامل الخدمة قد يخفي الطلبات عن page.route.
    serviceWorkers: "block",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", testIgnore: /mobile\.spec/, use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", testMatch: /mobile\.spec/, use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 300_000,
    reuseExistingServer: !process.env.CI,
    // قيم فارغة تعلو ملف .env: الاختبارات لا تصل أبداً لقاعدة البيانات أو Drive الحقيقيَّين.
    env: {
      DATABASE_URL: "",
      GOOGLE_DRIVE_CLIENT_ID: "",
      GOOGLE_DRIVE_CLIENT_SECRET: "",
      GOOGLE_DRIVE_REFRESH_TOKEN: "",
      GOOGLE_DRIVE_FOLDER_ID: "",
    },
  },
})
