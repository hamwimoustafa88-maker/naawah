// فحوص مشتركة لنقاط الكتابة العامة بلا تسجيل دخول (/api/archive و/api/stats/increment).

import { createHash } from "node:crypto"

export const HOUR_MS = 60 * 60 * 1000

/** عنوان IP مجزَّأ — لا يُخزَّن العنوان نفسه أبداً، ويُستعمل أيضاً مفتاحاً لحدّ الطلبات. */
export function hashedClientIp(headers: Headers): string | undefined {
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || ""
  if (!ip) return undefined
  return createHash("sha256").update(ip + (process.env.IP_SALT ?? "naawah-dev-salt")).digest("hex")
}

/** يرفض الطلبات الآتية من مواقع أخرى. حدّ الطلبات يبقى الحماية الأساسية، فهذه الرؤوس قابلة للتزوير خارج المتصفح. */
export function isSameOriginRequest(headers: Headers): boolean {
  const fetchSite = headers.get("sec-fetch-site")
  if (fetchSite && fetchSite !== "same-origin") return false
  const origin = headers.get("origin")
  const host = headers.get("x-forwarded-host") ?? headers.get("host")
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

/** يفحص توقيع JPEG الفعلي، فنوع الملف المعلن في الطلب يكتبه المُرسِل. */
export function hasJpegSignature(bytes: ArrayBuffer): boolean {
  const view = new Uint8Array(bytes)
  return view.length > 3 && view[0] === 0xff && view[1] === 0xd8 && view[2] === 0xff
}
