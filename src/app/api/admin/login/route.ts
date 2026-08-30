import { createHash, timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, createSessionToken } from "@/lib/admin/session"

export const runtime = "nodejs"

const MAX_ATTEMPTS = 10
const WINDOW_MS = 15 * 60 * 1000 // ١٥ دقيقة

/** حدّ محاولات بسيط في الذاكرة — يكفي لتعطيل التخمين الآلي البسيط؛ ليس حماية
 * موزّعة (يُعاد ضبطه عند إعادة تشغيل الخادم/نسخة serverless باردة)، وهذا مقبول
 * هنا لأن كلمة المرور نفسها (ADMIN_PASSWORD) هي خط الدفاع الحقيقي. */
const attempts = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  entry.count++
  return entry.count > MAX_ATTEMPTS
}

/** مقارنة زمنية ثابتة بلا تسريب طول كلمة المرور — hash كلا الطرفين أولاً (٣٢ بايت
 * ثابتاً دائماً) ثم timingSafeEqual، بدل مقارنة النصّين مباشرة. */
function passwordMatches(input: string, expected: string): boolean {
  const inputHash = createHash("sha256").update(input).digest()
  const expectedHash = createHash("sha256").update(expected).digest()
  return timingSafeEqual(inputHash, expectedHash)
}

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return NextResponse.json({ error: "لوحة الإدارة غير مُهيَّأة" }, { status: 503 })
  }

  const forwardedFor = request.headers.get("x-forwarded-for")
  const ip = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "محاولات كثيرة جداً — حاول لاحقاً" }, { status: 429 })
  }

  let password: string | undefined
  try {
    const body = await request.json()
    password = typeof body?.password === "string" ? body.password : undefined
  } catch {
    // جسم غير صالح
  }

  if (!password || !passwordMatches(password, adminPassword)) {
    return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  })
  return response
}
