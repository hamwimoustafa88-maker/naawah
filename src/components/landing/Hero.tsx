import Image from "next/image"
import Link from "next/link"
import { Lock } from "lucide-react"
import { LivePreview } from "@/components/landing/LivePreview"
import { GalleryTriggerButton } from "@/components/landing/GalleryTriggerButton"

export function Hero({ count }: { count: number }) {
  return (
    <section className="w-full bg-(--home-surface)">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_300px] lg:gap-10 lg:py-28">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-right">
          <Image src="/icon.png" alt="" width={56} height={56} className="h-14 w-14" priority />

          <span className="rounded-full bg-(--home-accent)/10 px-4 py-1.5 text-sm text-(--home-accent)">
            عدد النعوات المُنقذة: {count.toLocaleString("ar")}
          </span>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            تطبيق النعوة الإلكترونية
          </h1>

          <p className="max-w-xl text-lg text-(--home-muted)">
            أنشئ نعوة، وشاركها في لحظات.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create"
              className="rounded-xl bg-(--home-accent) px-8 py-3.5 text-lg font-bold text-white shadow-lg shadow-(--home-accent)/20 transition-transform hover:scale-[1.02]"
            >
              إنشاء نعوة الآن
            </Link>
            <GalleryTriggerButton />
          </div>

          <div className="flex items-center gap-2 text-sm text-(--home-muted)">
            <Lock size={16} className="text-(--home-accent)" />
            <span>بيانات النعوة لا تغادر متصفحك</span>
          </div>
        </div>

        <LivePreview />
      </div>
    </section>
  )
}
