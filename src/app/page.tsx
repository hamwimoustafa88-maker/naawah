import { prisma } from "@/lib/prisma"
import { JsonLd } from "@/components/common/JsonLd"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks, STEPS } from "@/components/landing/HowItWorks"
import { FeatureBento } from "@/components/landing/FeatureBento"
import { TemplateGallery } from "@/components/landing/TemplateGallery"
import { SadaqahSection } from "@/components/landing/SadaqahSection"
import { OpenSourceSection } from "@/components/landing/OpenSourceSection"
import { FaqPreview } from "@/components/landing/FaqPreview"
import { DeveloperSection } from "@/components/landing/DeveloperSection"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { TemplateShowcaseProvider } from "@/components/landing/TemplateShowcaseProvider"
import { SITE_DESCRIPTION } from "@/lib/seo/site"
import {
  organizationNode, webApplicationNode, webSiteNode, softwareSourceCodeNode, howToNode, faqPageNode,
} from "@/lib/seo/schema"
import { FAQ_ITEMS } from "@/lib/seo/faq"

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

// @graph موسّع — WebApplication + Organization (كما كانا) بالإضافة إلى WebSite،
// SoftwareSourceCode (يحمل معنى "مفتوح المصدر" فعلياً في البيانات المهيكلة عبر
// رخصة GPL-3.0 ورابط المستودع)، HowTo (من نفس خطوات HowItWorks المرئية —
// STEPS مُصدَّرة من هناك بلا تكرار كتابة)، وFAQPage (من نفس الأسئلة المعروضة في
// FaqPreview). لا aggregateRating ولا review — راجع تحذير schema.ts.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    webApplicationNode(),
    organizationNode(),
    webSiteNode(),
    softwareSourceCodeNode(),
    howToNode({
      name: "كيف تنشئ نعوة إلكترونية؟",
      description: SITE_DESCRIPTION,
      steps: STEPS.map((s) => ({ name: s.title, text: s.desc })),
    }),
    faqPageNode(FAQ_ITEMS.slice(0, 5)),
  ],
}

export default async function HomePage() {
  const count = await getCount()

  return (
    <div className="home-scope min-h-screen bg-(--home-bg) text-(--home-fg)">
      <JsonLd data={jsonLd} />
      <TemplateShowcaseProvider>
        <LandingHeader />
        <Hero count={count} />
        <HowItWorks />
        <FeatureBento />
        <TemplateGallery />
      </TemplateShowcaseProvider>
      <SadaqahSection />
      <OpenSourceSection />
      <FaqPreview />
      <DeveloperSection />
      <LandingFooter />
    </div>
  )
}
