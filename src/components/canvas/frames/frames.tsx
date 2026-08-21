// إطارات القوالب — طبقة SVG خلف المحتوى، بمقاس صفحة A4 (٧٩٤×١١٢٣ عند 96dpi).
// كل إطار يستعمل var(--tpl-accent) و var(--tpl-ink) المحقونة من توكنات القالب.

import type { ReactNode } from "react"

const VB = "0 0 794 1123"

/** غلاف SVG المشترك بين كل الإطارات — كل إطار يزوّد محتواه الداخلي فقط. */
function FrameSvg({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <svg className={className} viewBox={VB} preserveAspectRatio="none" aria-hidden>
      {children}
    </svg>
  )
}

function Corner({ x, y, flipX = false, flipY = false }: { x: number; y: number; flipX?: boolean; flipY?: boolean }) {
  const sx = flipX ? -1 : 1
  const sy = flipY ? -1 : 1
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${sy})`} stroke="var(--tpl-accent)" fill="none" strokeWidth={1.5}>
      <path d="M0,48 C0,18 18,0 48,0" />
      <path d="M8,48 C8,26 26,8 48,8" />
      <circle cx="6" cy="6" r="3" fill="var(--tpl-accent)" stroke="none" />
    </g>
  )
}

/** ١. الكلاسيكي الذهبي — خط مزدوج + زوايا أرابيسك */
export function GoldFrame({ className }: { className?: string }) {
  return (
    <FrameSvg className={className}>
      <rect x="24" y="24" width="746" height="1075" fill="none" stroke="var(--tpl-accent)" strokeWidth={2.5} />
      <rect x="34" y="34" width="726" height="1055" fill="none" stroke="var(--tpl-accent)" strokeWidth={1} />
      <Corner x={24} y={24} />
      <Corner x={770} y={24} flipX />
      <Corner x={24} y={1099} flipY />
      <Corner x={770} y={1099} flipX flipY />
    </FrameSvg>
  )
}

/** ٢. الزيتي الهادئ — خط رفيع مفرد فقط */
export function OliveFrame({ className }: { className?: string }) {
  return (
    <FrameSvg className={className}>
      <rect x="30" y="30" width="734" height="1063" fill="none" stroke="var(--tpl-accent)" strokeWidth={1} />
    </FrameSvg>
  )
}

/** ٣. الحديث المينيمال — بلا إطار إطلاقاً */
export function MinimalFrame({ className }: { className?: string }) {
  return <FrameSvg className={className} />
}

/** ٤. الثلث المخطوط — إطار متقطّع */
export function ThuluthFrame({ className }: { className?: string }) {
  return (
    <FrameSvg className={className}>
      <rect
        x="26" y="26" width="742" height="1071"
        fill="none" stroke="var(--tpl-accent)" strokeWidth={2}
        strokeDasharray="10 8"
      />
    </FrameSvg>
  )
}

/** ٥. الملكي البروتوكولي — إطار مزدوج + معيّنات الزوايا */
export function RoyalFrame({ className }: { className?: string }) {
  const diamond = (cx: number, cy: number) => (
    <rect
      x={cx - 7} y={cy - 7} width={14} height={14}
      transform={`rotate(45 ${cx} ${cy})`}
      fill="var(--tpl-accent)"
    />
  )
  return (
    <FrameSvg className={className}>
      <rect x="22" y="22" width="750" height="1079" fill="none" stroke="var(--tpl-accent)" strokeWidth={3} />
      <rect x="34" y="34" width="726" height="1055" fill="none" stroke="var(--tpl-accent)" strokeWidth={1} />
      {diamond(22, 22)}
      {diamond(772, 22)}
      {diamond(22, 1101)}
      {diamond(772, 1101)}
      {diamond(397, 22)}
      {diamond(397, 1101)}
    </FrameSvg>
  )
}

/** ٦. الصحيفة التقليدية — خطوط علوية/سفلية ثقيلة، بلا جوانب */
export function NewspaperFrame({ className }: { className?: string }) {
  return (
    <FrameSvg className={className}>
      <line x1="40" y1="34" x2="754" y2="34" stroke="var(--tpl-ink)" strokeWidth={3} />
      <line x1="40" y1="42" x2="754" y2="42" stroke="var(--tpl-ink)" strokeWidth={1} />
      <line x1="40" y1="1081" x2="754" y2="1081" stroke="var(--tpl-ink)" strokeWidth={1} />
      <line x1="40" y1="1089" x2="754" y2="1089" stroke="var(--tpl-ink)" strokeWidth={3} />
    </FrameSvg>
  )
}
