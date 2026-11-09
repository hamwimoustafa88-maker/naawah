import { Reveal } from "@/components/landing/Reveal"
import { ScrollWords } from "@/components/landing/SectionMotion"

export function SadaqahSection() {
  return (
    <section id="sadaqah" className="w-full scroll-mt-20 bg-(--home-surface) py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 text-center">
        <Reveal>
          <span className="inline-block rounded-full bg-(--home-accent)/10 px-4 py-1.5 text-sm font-bold text-(--home-accent)">
            صدقة جارية
          </span>
        </Reveal>
        <h2 className="sr-only">لماذا التطبيق مجاني بالكامل</h2>
        <ScrollWords
          text="هذا التطبيق مجاني بالكامل، ووُضع صدقة جارية عن أرواح المسلمين"
          className="text-xl leading-relaxed sm:text-2xl"
          fontFamily="var(--font-amiri)"
        />
        <Reveal className="flex flex-col items-center gap-5">
          <p className="max-w-xl text-sm leading-relaxed text-(--home-muted)">
            «إذا ماتَ ابنُ آدمَ انقطعَ عملُه إلا من ثلاثٍ: صدقةٍ جاريةٍ، أو علمٍ يُنتفَعُ به، أو ولدٍ صالحٍ يدعو له»
            <br />
            <span>رواه مسلم</span>
          </p>
          <p className="text-sm text-(--home-muted)">
            نسأل الله أن يتقبّلها خالصةً لوجهه، وأن يرحم موتى المسلمين أجمعين.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
