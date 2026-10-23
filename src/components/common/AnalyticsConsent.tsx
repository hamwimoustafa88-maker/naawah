"use client"

import { useState, useSyncExternalStore } from "react"
import { GoogleAnalytics } from "@next/third-parties/google"

// Google Analytics لا يُحمَّل إلا بعد قبول الزائر الصريح (فحص كاشف:
// compliance.pre-consent-tracking). القرار محفوظ في localStorage فقط (تفضيل
// للزائر لا يصل للخادم)، ويُعرض الشريط بخياري قبول/رفض متكافئين بصرياً.
const STORAGE_KEY = "analytics-consent"
type Choice = "granted" | "denied" | null

function readChoice(): Choice {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    return v === "granted" || v === "denied" ? v : null
  } catch {
    return null
  }
}

// useSyncExternalStore: الخادم يرى null (لا شريط) ثم يصحَّح بعد الترطيب بلا وميض hydration.
const subscribe = () => () => {}

export function AnalyticsConsent({ gaId }: { gaId: string }) {
  const stored = useSyncExternalStore(subscribe, readChoice, () => null)
  const [choice, setChoice] = useState<Choice | undefined>(undefined)
  const current = choice === undefined ? stored : choice

  function decide(value: Exclude<Choice, null>) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value)
    } catch {}
    setChoice(value)
  }

  return (
    <>
      {current === "granted" && <GoogleAnalytics gaId={gaId} />}
      {current === null && (
        <div
          role="dialog"
          aria-label="الموافقة على التحليلات"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-xl flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4 text-sm text-neutral-800 shadow-xl sm:flex-row sm:items-center dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-100"
        >
          <p className="flex-1 leading-relaxed">
            نستخدم Google Analytics لقياس الاستخدام وتحسين الأداة، ولا نفعّله إلا بموافقتك.{" "}
            <a href="/privacy" className="underline underline-offset-2">سياسة الخصوصية</a>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => decide("denied")}
              className="min-h-11 flex-1 rounded-xl border border-black/20 px-4 font-bold dark:border-white/25"
            >
              رفض
            </button>
            <button
              type="button"
              onClick={() => decide("granted")}
              className="min-h-11 flex-1 rounded-xl border border-black/20 px-4 font-bold dark:border-white/25"
            >
              قبول
            </button>
          </div>
        </div>
      )}
    </>
  )
}
