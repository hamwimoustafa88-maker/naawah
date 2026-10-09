import type { Metadata } from "next"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin/session"
import { parseISODateUTC } from "@/lib/obituary/hijri"
import { AdminLogin } from "@/components/admin/AdminLogin"
import { ArchiveTable, type ArchiveRow } from "@/components/admin/ArchiveTable"

// صفحة إدارة داخلية غير مرتبطة من أي مكان في الموقع — مستثناة من الفهرسة صراحة
// (وأيضاً من robots.ts) رغم أنها بلا فائدة SEO أصلاً بمحتواها الديناميكي المحمي.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  const authorized = verifySessionToken(token)

  if (!authorized) return <AdminLogin />

  const archived = await prisma.archivedObituary.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
  })

  const rows: ArchiveRow[] = archived.map((a) => ({
    id: a.id,
    deceasedName: a.deceasedName,
    // ميلادي فقط بطلب صريح — مُشتقّ من deathDateISO مباشرة (deathDateAr المزدوج
    // يبقى محفوظاً في القاعدة لكن لم يعد يُعرض هنا). "ar" بلا امتداد "-u-ca-islamic"
    // يُنتج التقويم الميلادي افتراضياً (خلافاً لـgetHijriParts في hijri.ts).
    deathDate: a.deathDateISO
      ? parseISODateUTC(a.deathDateISO).toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
      : "",
    deathPlaceNote: a.deathPlaceNote ?? "",
    driveViewUrl: a.driveViewUrl,
    condolencesInfo: a.condolencesInfo ?? "",
    exportCount: a.exportCount,
    createdAt: a.createdAt.toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" }),
  }))

  return <ArchiveTable rows={rows} />
}
