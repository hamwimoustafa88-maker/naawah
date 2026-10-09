// دوال بانية للبيانات المهيكلة (JSON-LD) — كل صفحة تستهلك ما يخصّها فقط عبر
// <JsonLd data={...} /> (src/components/common/JsonLd.tsx). تجميعها هنا يمنع
// تكرار @type/@context حرفياً في كل صفحة، ويضمن استعمال SITE_URL/SITE_NAME
// الموحّدين دائماً.
//
// قيد متعمَّد: لا aggregateRating ولا review في أي مكان — لا توجد تقييمات حقيقية،
// وفبركتها مخالفة صريحة لسياسات جوجل للبيانات المهيكلة وتُسقط كل النتائج الغنية
// للنطاق بالكامل عند اكتشافها.

import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, GITHUB_URL, LICENSE_URL } from "./site"

export function organizationNode() {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
  }
}

export function webSiteNode() {
  return {
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "ar",
  }
}

/** WebApplication (لا SoftwareApplication) — أنسب لأداة ويب تعمل من المتصفح
 * بلا تثبيت. license/isAccessibleForFree يعكسان الهوية المفتوحة/المجانية فعلياً
 * في البيانات المهيكلة لا في نص الصفحة وحده. */
export function webApplicationNode() {
  return {
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Any (متصفح ويب)",
    inLanguage: "ar",
    description: SITE_DESCRIPTION,
    isAccessibleForFree: true,
    license: LICENSE_URL,
    featureList: [
      "٧ قوالب نعوة إسلامية احترافية",
      "محرك صياغة عربي يصرّف الجنس ويجمع الأقارب تلقائياً",
      "تصدير PNG وPDF بمقاس A4 جاهز للطباعة",
      "بلا تسجيل، بلا تخزين بيانات على أي خادم",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  }
}

/** يصف كود المشروع نفسه ككيان مستقل — العقدة التي تحمل فعلياً معنى "مفتوح
 * المصدر" في البيانات المهيكلة (رخصة + مستودع)، لا الوصف النصي وحده. */
export function softwareSourceCodeNode() {
  return {
    "@type": "SoftwareSourceCode",
    name: SITE_NAME,
    codeRepository: GITHUB_URL,
    programmingLanguage: "TypeScript",
    license: LICENSE_URL,
    isAccessibleForFree: true,
  }
}

export function howToNode(opts: {
  name: string
  description: string
  steps: { name: string; text: string }[]
}) {
  return {
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((s) => ({
      "@type": "HowToStep",
      name: s.name,
      text: s.text,
    })),
  }
}

export function faqPageNode(items: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }
}

/** عناصر المسار — path يجب أن يبدأ بـ"/" (مثال: "/templates/gold-classic"). */
export function breadcrumbNode(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export function itemListNode(opts: { name: string; items: { name: string; path: string }[] }) {
  return {
    "@type": "ItemList",
    name: opts.name,
    itemListElement: opts.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${SITE_URL}${item.path}`,
    })),
  }
}

export function articleNode(opts: {
  headline: string
  description: string
  path: string
  publishedISO: string
  updatedISO: string
}) {
  return {
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    datePublished: opts.publishedISO,
    dateModified: opts.updatedISO,
    inLanguage: "ar",
    author: organizationNode(),
    publisher: organizationNode(),
  }
}
