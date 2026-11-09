import { NextResponse } from "next/server"
import { HOUR_MS, hashedClientIp, isSameOriginRequest } from "@/lib/api/requestGuard"
import { prisma } from "@/lib/prisma"

const TEMPLATE_ID_PATTERN = /^[a-z0-9-]{1,64}$/
const MAX_STATS_PER_HOUR = 60

/**
 * يسجّل تصديراً واحداً بلا أي بيان عن الفقيد — templateId فقط، مع hash لعنوان IP
 * (لا يُخزَّن العنوان نفسه) وبلد تقريبي إن توفّر من رؤوس الاستضافة.
 */
export async function POST(request: Request) {
  if (!isSameOriginRequest(request.headers)) return NextResponse.json({ ok: false }, { status: 403 })

  let templateId: unknown
  try {
    const body = await request.json()
    templateId = body?.templateId
  } catch {
    // جسم غير صالح — نتجاهل بهدوء
  }

  if (typeof templateId !== "string" || !TEMPLATE_ID_PATTERN.test(templateId)) {
    return NextResponse.json({ error: "templateId مطلوب" }, { status: 400 })
  }

  const headers = request.headers
  const country = headers.get("x-vercel-ip-country") ?? undefined
  const region = headers.get("x-vercel-ip-country-region") ?? undefined
  const ipHash = hashedClientIp(headers)

  try {
    if (ipHash) {
      const recent = await prisma.obituaryStat.count({
        where: { ipHash, createdAt: { gte: new Date(Date.now() - HOUR_MS) } },
      })
      if (recent >= MAX_STATS_PER_HOUR) return NextResponse.json({ ok: false }, { status: 429 })
    }

    await prisma.obituaryStat.create({
      data: { templateId, ipHash, country, region },
    })
  } catch (error) {
    console.error("فشل تسجيل الإحصاء:", error)
    return NextResponse.json({ ok: false }, { status: 200 })
  }

  return NextResponse.json({ ok: true })
}
