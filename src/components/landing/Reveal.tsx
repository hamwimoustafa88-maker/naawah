"use client"

// غلاف حركة دخول بسيط عبر IntersectionObserver — بلا أي تبعية حركة خارجية
// (framer-motion غير مثبّت في المشروع). يحترم prefers-reduced-motion عبر CSS
// وحده (راجع .reveal في globals.css)، فلا حاجة لقراءته هنا في JS.

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils/cn"

export function Reveal({
  children,
  className,
  delayMs = 0,
}: {
  children: ReactNode
  className?: string
  delayMs?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={visible ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  )
}
