import { Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils/cn"

export interface ContactMessageRow {
  id: string
  name: string
  contact: string
  message: string
  createdAt: string
  read: boolean
}

export function ContactMessages({
  rows, error, onMarkRead, onMarkAllRead,
}: {
  rows: ContactMessageRow[]
  error: boolean
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
}) {
  const unreadCount = rows.filter((row) => !row.read).length

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-black/80">رسائل التواصل ({rows.length})</h1>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={onMarkAllRead}>
            <Check size={14} />
            تحديد الكل كمقروءة
          </Button>
        )}
      </div>

      {error && <p role="alert" className="mb-3 text-sm font-medium text-red-600">تعذّر حفظ حالة القراءة. حاول مجدداً.</p>}

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <article
            key={row.id}
            className={cn("rounded-xl border p-4", row.read ? "border-black/10 bg-white" : "border-accent/40 bg-accent/5")}
          >
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-bold text-black/80">
                {!row.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-accent" aria-label="غير مقروءة" />}
                {row.name}
                {row.contact && <span dir="auto" className="mr-2 font-normal text-black/55">{row.contact}</span>}
              </p>
              <span className="text-xs text-black/45">{row.createdAt}</span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-black/70">{row.message}</p>
            {!row.read && (
              <Button variant="outline" size="sm" className="mt-3" onClick={() => onMarkRead(row.id)}>
                <Check size={14} />
                تحديد كمقروءة
              </Button>
            )}
          </article>
        ))}
        {rows.length === 0 && <p className="py-6 text-center text-sm text-black/40">لا توجد رسائل</p>}
      </div>
    </section>
  )
}
