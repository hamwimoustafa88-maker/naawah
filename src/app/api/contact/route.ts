import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

const MAX_NAME_LENGTH = 100
const MAX_CONTACT_LENGTH = 150
const MIN_MESSAGE_LENGTH = 5
const MAX_MESSAGE_LENGTH = 3000
const MAX_MESSAGES_PER_HOUR = 5
const HOUR_MS = 60 * 60 * 1000

function hashedClientIp(headers: Headers): string | undefined {
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || ""
  if (!ip) return undefined
  return createHash("sha256").update(ip + (process.env.IP_SALT ?? "naawah-dev-salt")).digest("hex")
}

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "")

/** يحفظ رسالة من نموذج /contact. الحد الزمني يُحسب من القاعدة لأن ذاكرة الخادم لا تدوم بين الطلبات. */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null)
    if (!body || typeof body !== "object") return NextResponse.json({ ok: false }, { status: 400 })
    const fields = body as Record<string, unknown>

    // حقل مخفي عن البشر: من يملؤه روبوت، فنتظاهر بالنجاح بلا حفظ.
    if (text(fields.website)) return NextResponse.json({ ok: true })

    const name = text(fields.name)
    const contact = text(fields.contact)
    const message = text(fields.message)
    if (
      !name || name.length > MAX_NAME_LENGTH ||
      contact.length > MAX_CONTACT_LENGTH ||
      message.length < MIN_MESSAGE_LENGTH || message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const ipHash = hashedClientIp(request.headers)
    if (ipHash) {
      const recent = await prisma.contactMessage.count({
        where: { ipHash, createdAt: { gte: new Date(Date.now() - HOUR_MS) } },
      })
      if (recent >= MAX_MESSAGES_PER_HOUR) return NextResponse.json({ ok: false }, { status: 429 })
    }

    await prisma.contactMessage.create({ data: { name, contact: contact || null, message, ipHash } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("فشل حفظ رسالة التواصل:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
