import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin/session"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

/** يحدّد رسالة واحدة ({ id }) أو كل الرسائل ({ all: true }) كمقروءة. */
export async function POST(request: Request) {
  const cookieStore = await cookies()
  if (!verifySessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => null)
  const { id, all } = (body && typeof body === "object" ? body : {}) as { id?: unknown; all?: unknown }
  if (all !== true && (typeof id !== "string" || !id)) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  try {
    await prisma.contactMessage.updateMany({
      where: { readAt: null, ...(all === true ? {} : { id: id as string }) },
      data: { readAt: new Date() },
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("تعذّر تحديد الرسائل كمقروءة:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
