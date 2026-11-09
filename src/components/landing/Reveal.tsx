"use client"

// دخول هادئ عند الوصول للعنصر أثناء التمرير. data-reveal يعيد المحتوى ظاهراً بلا
// جافاسكربت (راجع noscript في src/app/page.tsx).

import type { ReactNode } from "react"
import * as m from "motion/react-m"
import { EASE_OUT } from "@/components/landing/MotionProvider"

export function Reveal({
  children,
  className,
  delayMs = 0,
}: {
  children: ReactNode
  className?: string
  delayMs?: number
}) {
  return (
    <m.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: delayMs / 1000 }}
    >
      {children}
    </m.div>
  )
}
