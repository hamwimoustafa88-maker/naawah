"use client"

// LazyMotion يحمّل حزمة الحركة المطلوبة فقط بدل مكوّن motion الكامل، وreducedMotion="user"
// يلغي حركات الموضع تلقائياً لمن فعّل تقليل الحركة في جهازه.

import type { ReactNode } from "react"
import { LazyMotion, MotionConfig, domAnimation } from "motion/react"

export const EASE_OUT = [0.16, 1, 0.3, 1] as const

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
