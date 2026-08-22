import { prisma } from "@/lib/prisma"
import { JsonLd } from "@/components/common/JsonLd"
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

const SITE_URL = "https://enaawah.scouthub.dev"

// WebApplication + Organization في @graph واحد — يصف الأداة كتطبيق مجاني بلا
// تسجيل (ملائم أكثر من SoftwareApplication الموجَّه للتطبيقات القابلة للتثبيت)
// ومصدرها كجهة واحدة، ليتمكّن جوجل من عرضهما معاً في نتائج البحث الغنية.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "النعوة الإلكترونية",
      url: SITE_URL,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any (متصفح ويب)",
      inLanguage: "ar",
      description:
        "أنشئ نعوة إلكترونية عربية إسلامية وقورة تليق بمقام الفقيد خلال دقائق — اختر من ٧ قوالب احترافية وصدّرها PNG أو PDF جاهزة للطباعة والمشاركة.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "Organization",
      name: "النعوة الإلكترونية",
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
    },
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
      <DeveloperSection />
      <LandingFooter />
    </div>
  )
}
