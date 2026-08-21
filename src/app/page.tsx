import { prisma } from "@/lib/prisma"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { FeatureBento } from "@/components/landing/FeatureBento"
import { TemplateGallery } from "@/components/landing/TemplateGallery"
import { SadaqahSection } from "@/components/landing/SadaqahSection"
import { DeveloperSection } from "@/components/landing/DeveloperSection"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { TemplateShowcaseProvider } from "@/components/landing/TemplateShowcaseProvider"

// العدّاد لا يحتاج طزاجة لحظية — يعيد التحقق كل ٥ دقائق بدل تشغيل استعلام Prisma
// عند كل طلب.
export const revalidate = 300

async function getCount(): Promise<number> {
  try {
    return await prisma.obituaryStat.count()
  } catch {
    return 0
  }
}

export default async function HomePage() {
  const count = await getCount()

  return (
    <div className="home-scope min-h-screen bg-(--home-bg) text-(--home-fg)">
      <TemplateShowcaseProvider>
        <LandingHeader />
        <Hero count={count} />
        <HowItWorks />
        <FeatureBento />
        <TemplateGallery />
      </TemplateShowcaseProvider>
      <SadaqahSection />
      <DeveloperSection />
      <LandingFooter />
    </div>
  )
}
