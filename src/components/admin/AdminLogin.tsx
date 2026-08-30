"use client"

import { useState } from "react"
import { Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input, Label } from "@/components/ui/Field"

/**
 * شاشة دخول بسيطة بكلمة مرور واحدة — لا اسم مستخدم (حساب مسؤول واحد فقط).
 * نجاح الدخول يُنشئ كوكي httpOnly من الخادم (src/app/api/admin/login) ثم يُعيد
 * تحميل الصفحة (بدل توجيه client-side) ليقرأ /admin/page.tsx الكوكي من جديد
 * كخادم ويعرض الجدول مباشرة.
 */
export function AdminLogin() {
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body?.error ?? "تعذّر تسجيل الدخول")
        return
      }
      window.location.reload()
    } catch {
      setError("تعذّر الاتصال بالخادم")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2 text-black/70">
          <Lock size={18} />
          <h1 className="text-base font-bold">لوحة أرشيف النعوات</h1>
        </div>
        <Label htmlFor="admin-password">كلمة المرور</Label>
        <Input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
        />
        {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
        <Button type="submit" disabled={busy || !password} className="mt-4 w-full">
          {busy ? <Loader2 size={16} className="animate-spin" /> : null}
          دخول
        </Button>
      </form>
    </div>
  )
}
