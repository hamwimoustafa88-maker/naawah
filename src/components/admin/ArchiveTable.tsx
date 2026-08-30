"use client"

import { useMemo, useState } from "react"
import { ExternalLink, LogOut, Search } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Field"

export interface ArchiveRow {
  id: string
  deceasedName: string
  /** ميلادي فقط — راجع تعليق الاشتقاق في src/app/admin/page.tsx. */
  deathDate: string
  deathPlaceNote: string
  driveViewUrl: string
  condolencesInfo: string
  exportCount: number
  createdAt: string
}

/** جدول بحث فوري بالاسم — بلا اعتماد على الخادم لكل ضغطة (٣٠٠ صفّ كحدّ أقصى
 * أصلاً، راجع src/app/admin/page.tsx). تسجيل الخروج يمسح الكوكي ثم يعيد التحميل. */
export function ArchiveTable({ rows }: { rows: ArchiveRow[] }) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return rows
    return rows.filter((r) => r.deceasedName.includes(q))
  }, [rows, query])

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.reload()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-black/80">أرشيف النعوات ({rows.length})</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut size={14} />
          تسجيل الخروج
        </Button>
      </div>

      <div className="relative mb-4 max-w-xs">
        <Search size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/35" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="بحث باسم المتوفى..."
          className="pr-9"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full min-w-215 text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-black/3 text-right text-xs font-bold text-black/55">
              <th className="px-4 py-3">اسم المتوفى</th>
              <th className="px-4 py-3">تاريخ الوفاة</th>
              <th className="px-4 py-3">مكان الوفاة</th>
              <th className="px-4 py-3">رابط الصورة</th>
              <th className="px-4 py-3">التعزية للرجال والنساء</th>
              <th className="px-4 py-3">مرات التصدير</th>
              <th className="px-4 py-3">تاريخ الأرشفة</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-black/5 last:border-0 hover:bg-black/2">
                <td className="px-4 py-3 font-medium text-black/80">{row.deceasedName}</td>
                <td className="px-4 py-3 text-black/65">{row.deathDate || "—"}</td>
                <td className="px-4 py-3 text-black/65">{row.deathPlaceNote || "—"}</td>
                <td className="px-4 py-3">
                  <a
                    href={row.driveViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    فتح الصورة
                    <ExternalLink size={13} />
                  </a>
                </td>
                <td className="px-4 py-3 text-black/65">{row.condolencesInfo || "—"}</td>
                <td className="px-4 py-3 text-black/50">{row.exportCount}</td>
                <td className="px-4 py-3 text-black/50">{row.createdAt}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-black/40">
                  لا نتائج
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
