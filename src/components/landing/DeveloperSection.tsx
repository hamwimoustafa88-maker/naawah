import Image from "next/image"
import { Mail } from "lucide-react"
import { Reveal } from "@/components/landing/Reveal"
import { WhatsAppIcon, LinkedInIcon } from "@/components/landing/BrandIcons"

const LINKS = [
  { href: "https://wa.me/96181035672", label: "واتساب", Icon: WhatsAppIcon },
  { href: "mailto:hamwi.moustafa88@gmail.com", label: "البريد الإلكتروني", Icon: Mail },
  { href: "https://www.linkedin.com/in/moustafa-hamwi/", label: "لينكدإن", Icon: LinkedInIcon },
]

export function DeveloperSection() {
  return (
    <section id="developer" className="w-full scroll-mt-20 bg-[#161311] py-16 text-[#f2e8d8]">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 text-center">
        <span className="text-xs tracking-widest text-[#c9a94a]">المطوّر</span>

        <div className="overflow-hidden rounded-full ring-2 ring-[#c9a94a]" style={{ width: 96, height: 96 }}>
          <Image
            src="/developer.webp"
            alt="مصطفى الحموي"
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h3 className="text-lg font-bold">مصطفى الحموي</h3>
          <p className="text-xs text-[#a89676]">Moustafa Al-Hamwi</p>
        </div>

        <span className="rounded-full border border-[#c9a94a]/40 bg-[#c9a94a]/10 px-3 py-1 text-xs text-[#c9a94a]">
          قائد كشفي ومطوّر برامج
        </span>

        <p className="max-w-md text-sm leading-relaxed text-[#a89676]">
          طوّر هذا التطبيق ونشره مجاناً للناس كافة، صدقةً جارية عن أرواح المسلمين.
        </p>

        <div className="mt-2 flex items-center gap-3">
          {LINKS.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a94a]/30 text-[#f2e8d8] transition-colors hover:bg-[#c9a94a]/15"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
