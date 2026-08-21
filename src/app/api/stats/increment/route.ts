import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * يسجّل تصديراً واحداً بلا أي بيان عن الفقيد — templateId فقط، مع hash لعنوان IP
 * (لا يُخزَّن العنوان نفسه) وبلد تقريبي إن توفّر من رؤوس الاستضافة.
 */
export async function POST(request: Request) {
  let templateId: string | undefined
  try {
    const body = await request.json()
    templateId = typeof body?.templateId === "string" ? body.templateId.slice(0, 64) : undefined
  } catch {
    // جسم غير صالح — نتجاهل بهدوء
  }

  if (!templateId) {
    return NextResponse.json({ error: "templateId مطلوب" }, { status: 400 })
  }

  const headers = request.headers
  const forwardedFor = headers.get("x-forwarded-for")
  const ip = forwardedFor?.split(",")[0]?.trim() || headers.get("x-real-ip") || ""
  const country = headers.get("x-vercel-ip-country") ?? undefined
  const region = headers.get("x-vercel-ip-country-region") ?? undefined

  const salt = process.env.IP_SALT ?? "naawah-dev-salt"
  const ipHash = ip ? createHash("sha256").update(ip + salt).digest("hex") : undefined

  try {
    await prisma.obituaryStat.create({
      data: { templateId, ipHash, country, region },
    })
  } catch (error) {
    console.error("فشل تسجيل الإحصاء:", error)
    return NextResponse.json({ ok: false }, { status: 200 })
  }

  return NextResponse.json({ ok: true })
}
