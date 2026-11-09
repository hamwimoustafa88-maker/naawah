import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { findPublicObituary } from "@/lib/drive/publicObituary"
import { A4_HEIGHT_PX, A4_WIDTH_PX } from "@/lib/obituary/pageSize"

interface PublicObituaryPageProps {
  params: Promise<{ id: string }>
}

const imagePath = (id: string) => `/n/${id}/image`

export async function generateMetadata({ params }: PublicObituaryPageProps): Promise<Metadata> {
  const { id } = await params
  const obituary = await findPublicObituary(id)
  if (!obituary) return { robots: { index: false, follow: false } }

  const title = `نعوة ${obituary.deceasedName}`
  // واتساب يتجاهل الصور الثقيلة في المعاينة، فتمرّ عبر مُحسِّن الصور بعرض ٦٤٠.
  const previewImage = `/_next/image?url=${encodeURIComponent(imagePath(id))}&w=640&q=75`
  return {
    title,
    description: obituary.deathDateAr || "إنّا لله وإنّا إليه راجعون",
    robots: { index: false, follow: false },
    openGraph: { title, type: "article", images: [{ url: previewImage, width: 640 }] },
    twitter: { card: "summary_large_image", title, images: [previewImage] },
  }
}

export default async function PublicObituaryPage({ params }: PublicObituaryPageProps) {
  const { id } = await params
  const obituary = await findPublicObituary(id)
  if (!obituary) notFound()

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4 py-8">
      <h1 className="text-center text-xl font-bold">نعوة {obituary.deceasedName}</h1>
      <Image
        src={imagePath(id)}
        alt={`نعوة ${obituary.deceasedName}`}
        width={A4_WIDTH_PX}
        height={A4_HEIGHT_PX}
        sizes="(max-width: 794px) 100vw, 794px"
        priority
        className="h-auto w-full rounded-lg shadow-lg"
      />
      <p className="text-center text-lg">إنّا لله وإنّا إليه راجعون</p>
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <a href={imagePath(id)} className="underline underline-offset-2">فتح الصورة بالحجم الكامل</a>
        <Link href="/create" prefetch={false} className="underline underline-offset-2">أنشئ نعوة مجاناً</Link>
      </div>
    </main>
  )
}
