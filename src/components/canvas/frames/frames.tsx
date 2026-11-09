// إطارات القوالب — طبقة SVG خلف المحتوى، بمقاس صفحة A4 (٧٩٤×١١٢٣ عند 96dpi).
// كل إطار يستعمل var(--tpl-accent) و var(--tpl-ink) المحقونة من توكنات القالب.
// الزخارف تبقى خارج هامش النص (٥٦px من كل حافة)، وتُرسم بعناصر صريحة بلا <pattern>
// أو معرّفات: نسخ الكانفاس المتعددة في الصفحة كانت ستتشارك نفس المعرّف.

import type { ReactNode } from "react"

const VB = "0 0 794 1123"
const WIDTH = 794
const HEIGHT = 1123

/** غلاف SVG المشترك بين كل الإطارات — كل إطار يزوّد محتواه الداخلي فقط. */
function FrameSvg({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <svg className={className} viewBox={VB} preserveAspectRatio="none" aria-hidden>
      {children}
    </svg>
  )
}

/** نجمة ثمانية — الوحدة الهندسية المشتركة في زخارف الإطارات. */
function Star({
  cx, cy, r, fill = "var(--tpl-accent)", stroke = "none", strokeWidth = 1,
}: {
  cx: number
  cy: number
  r: number
  fill?: string
  stroke?: string
  strokeWidth?: number
}) {
  const points = Array.from({ length: 16 }, (_, i) => {
    const angle = (Math.PI / 8) * i
    const radius = i % 2 === 0 ? r : r * 0.62
    return `${(cx + radius * Math.sin(angle)).toFixed(2)},${(cy - radius * Math.cos(angle)).toFixed(2)}`
  })
  return <polygon points={points.join(" ")} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
}

function Diamond({ cx, cy, half, fill = "var(--tpl-accent)" }: { cx: number; cy: number; half: number; fill?: string }) {
  return <rect x={cx - half} y={cy - half} width={half * 2} height={half * 2} transform={`rotate(45 ${cx} ${cy})`} fill={fill} />
}

/** يطبّق محتوى زاوية واحدة (مرسوماً للزاوية العلوية اليسرى) على الزوايا الأربع. */
function FourCorners({ inset, children }: { inset: number; children: ReactNode }) {
  const placements = [
    [inset, inset, 1, 1],
    [WIDTH - inset, inset, -1, 1],
    [inset, HEIGHT - inset, 1, -1],
    [WIDTH - inset, HEIGHT - inset, -1, -1],
  ]
  return placements.map(([x, y, sx, sy]) => (
    <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>
      {children}
    </g>
  ))
}

/** ١. الكلاسيكي الذهبي — إطار ثلاثي الخطوط + زوايا أرابيسك وخراطيش وسطية */
export function GoldFrame({ className }: { className?: string }) {
  return (
    <FrameSvg className={className}>
      <rect x="18" y="18" width="758" height="1087" fill="none" stroke="var(--tpl-accent)" strokeWidth={3} />
      <rect x="25" y="25" width="744" height="1073" fill="none" stroke="var(--tpl-accent)" strokeWidth={0.75} />
      <rect x="36" y="36" width="722" height="1051" fill="none" stroke="var(--tpl-accent)" strokeWidth={1.25} />
      <FourCorners inset={18}>
        <g stroke="var(--tpl-accent)" fill="none">
          <rect x="0" y="0" width="36" height="36" fill="var(--tpl-bg)" strokeWidth={1.25} />
          <path d="M18,62 C20,40 40,20 62,18" strokeWidth={1.25} />
          <path d="M18,50 C24,38 38,24 50,18" strokeWidth={0.75} />
        </g>
        <Star cx={18} cy={18} r={14} />
        <circle cx={18} cy={18} r={3.5} fill="var(--tpl-bg)" />
      </FourCorners>
      {[27, HEIGHT - 27].map((y) => (
        <g key={y}>
          <rect x={WIDTH / 2 - 30} y={y - 13} width={60} height={26} fill="var(--tpl-bg)" />
          <path
            d={`M${WIDTH / 2 - 30},${y} C${WIDTH / 2 - 22},${y - 11} ${WIDTH / 2 - 14},${y - 8} ${WIDTH / 2 - 11},${y} C${WIDTH / 2 - 14},${y + 8} ${WIDTH / 2 - 22},${y + 11} ${WIDTH / 2 - 30},${y}Z`}
            fill="none" stroke="var(--tpl-accent)" strokeWidth={1}
          />
          <path
            d={`M${WIDTH / 2 + 30},${y} C${WIDTH / 2 + 22},${y - 11} ${WIDTH / 2 + 14},${y - 8} ${WIDTH / 2 + 11},${y} C${WIDTH / 2 + 14},${y + 8} ${WIDTH / 2 + 22},${y + 11} ${WIDTH / 2 + 30},${y}Z`}
            fill="none" stroke="var(--tpl-accent)" strokeWidth={1}
          />
          <Star cx={WIDTH / 2} cy={y} r={9} />
        </g>
      ))}
    </FrameSvg>
  )
}

/** غصن زيتون يمتدّ على خط الإطار نفسه، فلا يقترب من النص. */
function OliveSprig({ transform }: { transform: string }) {
  const leaves = [8, 24, 40, 56, 72, 88, 104, 120]
  return (
    <g transform={transform}>
      {leaves.map((x, i) => {
        const side = i % 2 === 0 ? -1 : 1
        const size = 1 - i * 0.06
        return (
          <path
            key={x}
            d="M0,0 C4,-6.5 13,-6.5 19,0 C13,6.5 4,6.5 0,0Z"
            transform={`translate(${x} 0) rotate(${side * 32}) scale(${size})`}
            fill="var(--tpl-accent)"
          />
        )
      })}
    </g>
  )
}

/** ٢. الزيتي الهادئ — خط رفيع مفرد يحمل غصني زيتون متقابلين */
export function OliveFrame({ className }: { className?: string }) {
  return (
    <FrameSvg className={className}>
      <rect x="30" y="30" width="734" height="1063" fill="none" stroke="var(--tpl-accent)" strokeWidth={1} />
      <OliveSprig transform="translate(764 30) scale(-1 1)" />
      <OliveSprig transform="translate(764 30) rotate(90)" />
      <OliveSprig transform="translate(30 1093)" />
      <OliveSprig transform="translate(30 1093) rotate(-90)" />
    </FrameSvg>
  )
}

/** ٣. الحديث المينيمال — بلا إطار إطلاقاً */
export function MinimalFrame({ className }: { className?: string }) {
  return <FrameSvg className={className} />
}

/** ٤. الثلث المخطوط — إطار متقطّع بنجوم ثمانية عند الزوايا ومنتصف الجوانب */
export function ThuluthFrame({ className }: { className?: string }) {
  const edgeStars = [
    [WIDTH / 2, 28],
    [WIDTH / 2, HEIGHT - 28],
    [28, HEIGHT / 2],
    [WIDTH - 28, HEIGHT / 2],
  ]
  return (
    <FrameSvg className={className}>
      <rect x="28" y="28" width="738" height="1067" fill="none" stroke="var(--tpl-accent)" strokeWidth={2} strokeDasharray="10 8" />
      <rect x="38" y="38" width="718" height="1047" fill="none" stroke="var(--tpl-accent)" strokeWidth={0.75} />
      <FourCorners inset={28}>
        <Star cx={0} cy={0} r={20} fill="var(--tpl-bg)" stroke="var(--tpl-accent)" strokeWidth={1.5} />
        <Star cx={0} cy={0} r={10} />
      </FourCorners>
      {edgeStars.map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <Star cx={cx} cy={cy} r={13} fill="var(--tpl-bg)" stroke="var(--tpl-accent)" strokeWidth={1.25} />
          <Star cx={cx} cy={cy} r={5.5} />
        </g>
      ))}
    </FrameSvg>
  )
}

/** ٥. الملكي البروتوكولي — إطار مزدوج بزوايا مدرَّجة ومعيّنات */
export function RoyalFrame({ className }: { className?: string }) {
  const diamonds = [
    [22, 22], [772, 22], [22, 1101], [772, 1101],
    [397, 22], [397, 1101], [22, 561.5], [772, 561.5],
  ]
  return (
    <FrameSvg className={className}>
      <rect x="22" y="22" width="750" height="1079" fill="none" stroke="var(--tpl-accent)" strokeWidth={3} />
      <path
        d="M50,34 H744 V50 H760 V1073 H744 V1089 H50 V1073 H34 V50 H50 Z"
        fill="none" stroke="var(--tpl-accent)" strokeWidth={1}
      />
      <FourCorners inset={34}>
        <Diamond cx={8} cy={8} half={3} />
      </FourCorners>
      {diamonds.map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <Diamond cx={cx} cy={cy} half={8} />
          <Diamond cx={cx} cy={cy} half={3.5} fill="var(--tpl-bg)" />
        </g>
      ))}
    </FrameSvg>
  )
}

/** ٦. الصحيفة التقليدية — خطوط علوية/سفلية ثقيلة تقطعها نجمة، بلا جوانب */
export function NewspaperFrame({ className }: { className?: string }) {
  return (
    <FrameSvg className={className}>
      <line x1="40" y1="34" x2="754" y2="34" stroke="var(--tpl-ink)" strokeWidth={3} />
      <line x1="40" y1="42" x2="754" y2="42" stroke="var(--tpl-ink)" strokeWidth={1} />
      <line x1="40" y1="1081" x2="754" y2="1081" stroke="var(--tpl-ink)" strokeWidth={1} />
      <line x1="40" y1="1089" x2="754" y2="1089" stroke="var(--tpl-ink)" strokeWidth={3} />
      {[38, 1085].map((y) => (
        <g key={y}>
          <rect x={WIDTH / 2 - 20} y={y - 8} width={40} height={16} fill="var(--tpl-bg)" />
          <Star cx={WIDTH / 2} cy={y} r={9} fill="var(--tpl-ink)" />
        </g>
      ))}
    </FrameSvg>
  )
}

/** ٧. الليلي الفخم — شريط من المعيّنات الذهبية بين خطين، بنجوم عند الزوايا */
export function MidnightFrame({ className }: { className?: string }) {
  const STEP = 16
  const BAND = 28
  const horizontal = Array.from({ length: Math.floor((WIDTH - 2 * BAND - 40) / STEP) + 1 }, (_, i) => BAND + 20 + i * STEP)
  const vertical = Array.from({ length: Math.floor((HEIGHT - 2 * BAND - 40) / STEP) + 1 }, (_, i) => BAND + 20 + i * STEP)
  return (
    <FrameSvg className={className}>
      <rect x="16" y="16" width="762" height="1091" fill="none" stroke="var(--tpl-accent)" strokeWidth={1.25} />
      <rect x="40" y="40" width="714" height="1043" fill="none" stroke="var(--tpl-accent)" strokeWidth={1.25} />
      {horizontal.flatMap((x) => [
        <Diamond key={`t${x}`} cx={x} cy={BAND} half={2.5} />,
        <Diamond key={`b${x}`} cx={x} cy={HEIGHT - BAND} half={2.5} />,
      ])}
      {vertical.flatMap((y) => [
        <Diamond key={`l${y}`} cx={BAND} cy={y} half={2.5} />,
        <Diamond key={`r${y}`} cx={WIDTH - BAND} cy={y} half={2.5} />,
      ])}
      <FourCorners inset={BAND}>
        <rect x="-12" y="-12" width="24" height="24" fill="var(--tpl-bg)" />
        <Star cx={0} cy={0} r={13} />
        <circle cx={0} cy={0} r={3} fill="var(--tpl-bg)" />
      </FourCorners>
    </FrameSvg>
  )
}
