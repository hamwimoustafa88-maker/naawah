"use client"

import { useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"

const FIELD_CLASS =
  "w-full rounded-xl border border-(--home-border) bg-(--home-surface) px-3 py-2.5 text-sm text-(--home-fg) placeholder:text-(--home-muted) focus:border-(--home-accent) focus:outline-none focus:ring-2 focus:ring-(--home-accent)/30"
const LABEL_CLASS = "mb-1.5 block text-sm font-medium text-(--home-fg)"

type Status = "idle" | "sending" | "sent" | "rate-limited" | "failed"

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setStatus("sending")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      if (response.ok) {
        form.reset()
        setStatus("sent")
      } else {
        setStatus(response.status === 429 ? "rate-limited" : "failed")
      }
    } catch {
      setStatus("failed")
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-xl border border-(--home-border) bg-(--home-surface) p-5">
        <p className="font-bold text-(--home-fg)">وصلتنا رسالتك، شكراً لك.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-sm font-medium text-(--home-accent) underline underline-offset-2"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={LABEL_CLASS}>الاسم</label>
          <input id="contact-name" name="name" required maxLength={100} autoComplete="name" className={FIELD_CLASS} />
        </div>
        <div>
          <label htmlFor="contact-reply" className={LABEL_CLASS}>بريدك أو رقمك للرد (اختياري)</label>
          <input id="contact-reply" name="contact" maxLength={150} autoComplete="email" dir="auto" className={FIELD_CLASS} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={LABEL_CLASS}>رسالتك</label>
        <textarea id="contact-message" name="message" required minLength={5} maxLength={3000} rows={5} className={`${FIELD_CLASS} resize-y`} />
      </div>

      {/* مصيدة روبوتات: مخفية عن البشر وقارئات الشاشة، راجع api/contact/route.ts */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">الموقع</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "rate-limited" && (
        <p role="alert" className="text-sm font-medium text-red-600">أرسلت عدة رسائل خلال وقت قصير. يرجى المحاولة بعد ساعة.</p>
      )}
      {status === "failed" && (
        <p role="alert" className="text-sm font-medium text-red-600">تعذّر إرسال الرسالة. حاول مجدداً، أو افتح بلاغاً على GitHub من الرابط أدناه.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-fit items-center gap-2 rounded-xl bg-(--home-accent) px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-60"
      >
        {status === "sending" && <Loader2 size={16} className="animate-spin" />}
        إرسال الرسالة
      </button>
    </form>
  )
}
