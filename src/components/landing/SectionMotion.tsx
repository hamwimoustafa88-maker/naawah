"use client"

// حركة خاصة بمعنى كل قسم في الصفحة الرئيسية. الكلمات تُحرَّك كاملة دائماً: تقسيمها
// إلى حروف يكسر اتصال الحروف العربية.

import { Fragment, useRef, type ReactNode } from "react"
import { useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react"
import * as m from "motion/react-m"
import { EASE_OUT } from "@/components/landing/MotionProvider"

function StepNumber({ progress, index, total, children }: { progress: MotionValue<number>; index: number; total: number; children: ReactNode }) {
  const reduced = useReducedMotion()
  const opacity = useTransform(progress, [index / total, (index + 0.6) / total], [0.25, 1])
  return (
    <m.span data-reveal className="text-4xl font-bold text-(--home-accent)" style={reduced ? undefined : { opacity }}>
      {children}
    </m.span>
  )
}

/** خط يمتدّ من اليمين مع التمرير، ويضيء رقم كل خطوة حين يصلها: الخطوات تسلسل لا ثلاث بطاقات. */
export function StepsTrack({ steps }: { steps: { n: string; title: string; desc: string }[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "center 45%"] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <div ref={ref}>
      <div className="mb-8 hidden h-px bg-(--home-border) sm:block">
        <m.div
          data-reveal
          className="h-full origin-right bg-(--home-accent)"
          style={reduced ? undefined : { scaleX: progress }}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="flex flex-col gap-2 border-(--home-border) py-6 not-first:border-t sm:py-0 sm:ps-8 sm:pe-8 sm:first:ps-0 sm:last:pe-0 sm:not-first:border-t-0 sm:not-first:border-s"
          >
            <StepNumber progress={progress} index={i} total={steps.length}>{s.n}</StepNumber>
            <h3 className="text-base font-bold">{s.title}</h3>
            <p className="text-sm leading-relaxed text-(--home-muted)">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScrollWord({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: string }) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return <m.span data-reveal style={{ opacity }}>{children}</m.span>
}

/** الجملة تتضح كلمة بعد كلمة بسرعة قراءة الزائر نفسه. */
export function ScrollWords({ text, className, fontFamily }: { text: string; className?: string; fontFamily?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "start 45%"] })
  const words = text.split(" ")

  return (
    <p ref={ref} className={className} style={{ fontFamily }}>
      {reduced
        ? text
        : words.map((word, i) => (
            <Fragment key={i}>
              <ScrollWord progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{word}</ScrollWord>
              {i < words.length - 1 && " "}
            </Fragment>
          ))}
    </p>
  )
}

/** الضبابية تنقشع عن فقرة الشفافية: الكود مكشوف لمن يريد التحقّق. */
export function ClearingBlock({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      data-reveal
      className={className}
      initial={{ opacity: 0, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: EASE_OUT }}
    >
      {children}
    </m.div>
  )
}

/** الإطار الذهبي حول صورة المطوّر يُرسم مرة واحدة عند الوصول إليها. */
export function PortraitRing({ children, size }: { children: ReactNode; size: number }) {
  const outer = size + 4
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        aria-hidden
        width={outer}
        height={outer}
        viewBox={`0 0 ${outer} ${outer}`}
        className="absolute -inset-0.5 -rotate-90"
      >
        <m.circle
          cx={outer / 2}
          cy={outer / 2}
          r={outer / 2 - 1}
          fill="none"
          stroke="#c9a94a"
          strokeWidth={2}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: EASE_OUT }}
        />
      </svg>
      <div className="h-full w-full overflow-hidden rounded-full">{children}</div>
    </div>
  )
}
