"use client"

import { useEffect } from "react"

const WARMED_KEY = "naawah-export-chunks-warmed"

function cacheLoadedResources(worker: ServiceWorker) {
  const urls = performance
    .getEntriesByType("resource")
    .map((entry) => entry.name)
    .filter((url) => url.startsWith(`${location.origin}/_next/static/`) || url.startsWith(`${location.origin}/calligraphy/`))
  worker.postMessage({ type: "CACHE_URLS", urls })
}

/** مكتبتا التصدير تُحمَّلان عند أول تصدير، فيجب جلبهما مسبقاً ليعمل التصدير بلا إنترنت. */
function warmExportChunks() {
  if (location.pathname !== "/create" || sessionStorage.getItem(WARMED_KEY)) return
  sessionStorage.setItem(WARMED_KEY, "1")
  void import("html-to-image")
  void import("jspdf")
}

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => {
        if (registration.active) cacheLoadedResources(registration.active)
        warmExportChunks()
      })
      .catch((error) => console.error("تعذّر تسجيل عامل الخدمة:", error))
  }, [])

  return null
}
