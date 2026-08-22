// حاوية موحّدة لحقن JSON-LD — النمط الموصى به رسمياً من Next.js (script تعريفي
// بلا next/script، مع تعقيم `<` لمنع XSS عبر بيانات قد تصل مستقبلاً من مصدر
// غير ثابت). راجع node_modules/next/dist/docs/01-app/02-guides/json-ld.md.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
