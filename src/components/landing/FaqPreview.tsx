import Link from "next/link"
import { Reveal } from "@/components/landing/Reveal"
import { FAQ_ITEMS } from "@/lib/seo/faq"

// أهم ٥ أسئلة من سجلّ /lib/seo/faq.ts — عبر <details>/<summary> الأصليين بلا أي
// جافاسكربت (عكس مودال القوالب على العميل)، فالمحتوى مفتوح للزاحف دائماً بصرف
// النظر عن حالة الطيّ البصرية. الصفحة الكاملة على /faq.
export function FaqPreview() {
  const top5 = FAQ_ITEMS.slice(0, 5)
  return (
    <section id="faq" className="w-full scroll-mt-20 bg-(--home-surface) py-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6">
        <Reveal className="flex flex-col gap-2 text-center">
          <span className="text-xs font-bold tracking-widest text-(--home-accent)">أسئلة شائعة</span>
          <h2 className="text-2xl font-bold sm:text-3xl">أسئلة يتكرّر سؤالها</h2>
        </Reveal>

        <div className="flex flex-col divide-y divide-(--home-border) border-y border-(--home-border)">
          {top5.map((item) => (
            <details key={item.question} className="group py-4">
              <summary className="cursor-pointer list-none text-sm font-bold text-(--home-fg) marker:content-none">
                <span className="flex items-center justify-between gap-3">
                  {item.question}
                  <span className="shrink-0 text-(--home-accent) transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-(--home-muted)">{item.answer}</p>
            </details>
          ))}
        </div>

        <Link
          href="/faq"
          className="mx-auto text-sm font-bold text-(--home-accent) underline underline-offset-4"
        >
          كل الأسئلة الشائعة ←
        </Link>
      </div>
    </section>
  )
}
