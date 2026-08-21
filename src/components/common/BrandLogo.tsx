"use client"

// شعار المشروع (أيقونة + اسم) — مشترك بين ترويسة الصفحة الرئيسية وترويسة /create
// (على نمط ThemeToggle.tsx المشترك بينهما). النقر يأخذ دائماً إلى الصفحة الرئيسية
// (Link href="/") — **إلا** إن كنّا فيها أصلاً، فعندها يُعاد التمرير إلى أعلاها
// بسلاسة بدل تنقّل بلا أثر (Next.js Link إلى المسار الحالي نفسه لا يُنجز شيئاً
// بشكل افتراضي). window.scrollTo يستهدف نافذة المستند نفسها لا أي حاوية داخلية —
// صحيح لكلا الصفحتين لأن التمرير الفعلي في كليهما على مستوى النافذة (لوحة معاينة
// /create لها overflow-y-auto داخلي خاص بالكانفاس الطويل فقط، لا يمسّ هذا).
// wordmarkClassName يترك لكل ترويسة التحكّم بإخفاء/إظهار اسم النص على الجوال حسب
// ما يناسب كثافة عناصرها الخاصة، دون تكرار بنية الشعار نفسها.

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { MouseEvent } from "react"
import { cn } from "@/lib/utils/cn"

export function BrandLogo({ wordmarkClassName }: { wordmarkClassName?: string }) {
  const pathname = usePathname()
  const isHome = pathname === "/"

  function handleClick(e: MouseEvent) {
    if (isHome) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <Link
      href="/"
      onClick={handleClick}
      aria-label={isHome ? "العودة إلى أعلى الصفحة" : "الذهاب إلى الصفحة الرئيسية"}
      className="flex items-center gap-2"
    >
      <Image src="/icon.png" alt="" width={28} height={28} className="h-7 w-7 shrink-0" priority />
      <span className={cn("text-sm font-bold text-(--home-accent)", wordmarkClassName)}>
        النعوة الإلكترونية
      </span>
    </Link>
  )
}
