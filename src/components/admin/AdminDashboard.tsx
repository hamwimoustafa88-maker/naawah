"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { ArchiveTable, type ArchiveRow } from "@/components/admin/ArchiveTable"
import { ContactMessages, type ContactMessageRow } from "@/components/admin/ContactMessages"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils/cn"

type Tab = "archive" | "messages"

const TAB_CLASS = "inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-bold transition-colors"

export function AdminDashboard({ archiveRows, messages: initialMessages }: { archiveRows: ArchiveRow[]; messages: ContactMessageRow[] }) {
  const [tab, setTab] = useState<Tab>("archive")
  const [messages, setMessages] = useState(initialMessages)
  const [saveFailed, setSaveFailed] = useState(false)
  const unreadCount = messages.filter((message) => !message.read).length

  const markRead = async (target: { id: string } | { all: true }) => {
    const previous = messages
    setSaveFailed(false)
    setMessages((current) => current.map((m) => ("all" in target || m.id === target.id ? { ...m, read: true } : m)))
    try {
      const response = await fetch("/api/admin/messages/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target),
      })
      if (!response.ok) throw new Error(String(response.status))
    } catch (error) {
      console.error(error)
      setMessages(previous)
      setSaveFailed(true)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.reload()
  }

  const tabClass = (value: Tab) =>
    cn(TAB_CLASS, tab === value ? "border-accent text-accent" : "border-transparent text-black/55 hover:text-black/80")

  return (
    <>
      <div className="border-b border-black/10 bg-white">
        <nav aria-label="أقسام لوحة الإدارة" className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-1">
            <button type="button" aria-pressed={tab === "archive"} onClick={() => setTab("archive")} className={tabClass("archive")}>
              أرشيف النعوات
            </button>
            <button type="button" aria-pressed={tab === "messages"} onClick={() => setTab("messages")} className={tabClass("messages")}>
              الرسائل
              {unreadCount > 0 && (
                <span
                  aria-label={`${unreadCount} غير مقروءة`}
                  className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white"
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={14} />
            تسجيل الخروج
          </Button>
        </nav>
      </div>

      {tab === "archive" ? (
        <ArchiveTable rows={archiveRows} />
      ) : (
        <ContactMessages
          rows={messages}
          error={saveFailed}
          onMarkRead={(id) => markRead({ id })}
          onMarkAllRead={() => markRead({ all: true })}
        />
      )}
    </>
  )
}
