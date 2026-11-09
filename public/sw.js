// عامل الخدمة: يجعل المحرر يعمل بلا إنترنت بعد أول زيارة. لا يخزّن بيانات النعوات
// (تبقى في IndexedDB)، ولا يمرّ عبره شيء من /api أو /admin أو الروابط العامة.

const CACHE_NAME = "naawah-v1"
const OFFLINE_PAGE = "/create"
const CACHED_DOCUMENTS = new Set(["/", OFFLINE_PAGE])
const MAX_CACHE_ENTRIES = 250
const BYPASS_PREFIXES = ["/api/", "/admin", "/n/", "/_next/image"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_PAGE)).then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  )
})

async function trimCache(cache) {
  const keys = await cache.keys()
  await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_CACHE_ENTRIES)).map((key) => cache.delete(key)))
}

async function networkFirstDocument(request, pathname) {
  const cache = await caches.open(CACHE_NAME)
  try {
    const response = await fetch(request)
    if (response.ok && CACHED_DOCUMENTS.has(pathname)) await cache.put(pathname, response.clone())
    return response
  } catch {
    return (await cache.match(pathname)) ?? (await cache.match(OFFLINE_PAGE)) ?? Response.error()
  }
}

async function cacheFirstAsset(request) {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) {
    await cache.put(request, response.clone())
    await trimCache(cache)
  }
  return response
}

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)
  if (request.method !== "GET" || url.origin !== self.location.origin) return
  if (BYPASS_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) return
  // طلبات RSC تختلف عن HTML بالعنوان نفسه؛ عند انقطاع الشبكة يتراجع Next إلى تنقّل كامل.
  if (request.headers.has("RSC") || url.searchParams.has("_rsc")) return

  if (request.mode === "navigate") {
    event.respondWith(networkFirstDocument(request, url.pathname))
    return
  }
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/calligraphy/") || /\.(?:png|svg|webp|ico)$/.test(url.pathname)) {
    event.respondWith(cacheFirstAsset(request))
  }
})

// الموارد المحمَّلة قبل أن يتحكم العامل بالصفحة لا تمرّ عبره، فترسلها الصفحة لتخزينها.
self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_URLS" || !Array.isArray(event.data.urls)) return
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(event.data.urls.map((url) => cache.match(url).then((hit) => hit ?? cache.add(url))))
    )
  )
})
