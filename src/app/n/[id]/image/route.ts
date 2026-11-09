import { isDriveConfigured, downloadArchiveJpeg } from "@/lib/drive/client"
import { findPublicObituary } from "@/lib/drive/publicObituary"

export const runtime = "nodejs"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isDriveConfigured() || !(await findPublicObituary(id))) {
    return new Response(null, { status: 404 })
  }

  try {
    const file = await downloadArchiveJpeg(id)
    return new Response(file.body, {
      headers: {
        "Content-Type": "image/jpeg",
        // إعادة تصدير النعوة تستبدل الصورة بالمعرّف نفسه، فلا يطول التخزين المؤقت.
        "Cache-Control": "public, max-age=300, s-maxage=3600",
        "X-Robots-Tag": "noindex",
      },
    })
  } catch (error) {
    console.error("فشل جلب صورة النعوة:", error)
    return new Response(null, { status: 502 })
  }
}
