import { Fragment, type CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { Lock } from "lucide-react"
import { LivePreview } from "@/components/landing/LivePreview"
import { GalleryTriggerButton } from "@/components/landing/GalleryTriggerButton"

const HEADLINE = "النعوة الإلكترونية — أنشئ نعوة إسلامية وشاركها في دقائق"

// حركة نص الهيرو CSS لا JS (راجع .hero-rise في globals.css): هذا عنصر LCP، فلا يُخفى بانتظار الترطيب.
const riseDelay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties

export function Hero({ count }: { count: number }) {
  return (
    <section className="w-full bg-(--home-surface)">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_300px] lg:gap-10 lg:py-28">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-right">
          <Image src="/icon.png" alt="" width={46} height={56} className="hero-rise h-14 w-auto" priority />

          <span
            className="hero-rise rounded-full bg-(--home-accent)/10 px-4 py-1.5 text-sm text-(--home-accent)"
            style={riseDelay(60)}
          >
            عدد النعوات المُنقذة: {count.toLocaleString("ar")}
          </span>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {HEADLINE.split(" ").map((word, i) => (
              <Fragment key={i}>
                <span className="hero-word" style={{ "--i": i } as CSSProperties}>{word}</span>{" "}
              </Fragment>
            ))}
          </h1>

          <p className="hero-rise max-w-xl text-lg text-(--home-muted)" style={riseDelay(420)}>
            مجاناً وبلا تسجيل، من أي جهاز. اختر من ٧ قوالب، ثم صدّر نعوتك PNG أو PDF جاهزة
            للطباعة والمشاركة على واتساب. التطبيق مفتوح المصدر بالكامل، ووُضع صدقة جارية.
          </p>

          <div className="hero-rise flex flex-col gap-3 sm:flex-row" style={riseDelay(520)}>
            <Link
              href="/create"
              prefetch={false}
              className="rounded-xl bg-(--home-accent) px-8 py-3.5 text-lg font-bold text-white shadow-lg shadow-(--home-accent)/20 transition-transform hover:scale-[1.02]"
            >
              إنشاء نعوة الآن
            </Link>
            <GalleryTriggerButton />
          </div>

          <div className="hero-rise flex items-center gap-2 text-sm text-(--home-muted)" style={riseDelay(620)}>
            <Lock size={16} className="text-(--home-accent)" />
            <span>
              بلا حساب أو تسجيل — عند التصدير تُحفظ نسخة من النعوة في أرشيفنا (
              <Link href="/privacy" prefetch={false} className="underline underline-offset-2">التفاصيل</Link>)
            </span>
          </div>
        </div>

        <LivePreview />
      </div>
    </section>
  )
}
