// جلسة /admin — كوكي موقّعة بـHMAC-SHA256 (لا JWT كامل: حمولة بسيطة جداً لا تبرّر
// مكتبة خارجية). لا تخزين جانب الخادم للجلسات — التوقيع نفسه هو إثبات الصلاحية.

import { createHmac, timingSafeEqual } from "node:crypto"

export const ADMIN_COOKIE_NAME = "naawah_admin"
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000 // ٣٠ يوماً

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex")
}

/** ينشئ قيمة كوكي جديدة: "{وقت الانتهاء}.{توقيع}". */
export function createSessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error("ADMIN_SESSION_SECRET غير مُعرَّف")
  const expiresAt = String(Date.now() + SESSION_TTL_MS)
  return `${expiresAt}.${sign(expiresAt, secret)}`
}

/** يتحقّق من كوكي الجلسة: صيغة صحيحة + توقيع مطابق (مقارنة زمنية ثابتة) + لم تنتهِ بعد. */
export function verifySessionToken(token: string | undefined): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!token || !secret) return false

  const [expiresAt, signature] = token.split(".")
  if (!expiresAt || !signature) return false
  if (Date.now() > Number(expiresAt)) return false

  const expected = sign(expiresAt, secret)
  const expectedBuf = Buffer.from(expected, "hex")
  const actualBuf = Buffer.from(signature, "hex")
  if (expectedBuf.length !== actualBuf.length) return false
  return timingSafeEqual(expectedBuf, actualBuf)
}
