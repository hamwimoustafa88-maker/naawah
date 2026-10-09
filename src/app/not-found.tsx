import Link from "next/link"

// كان غائباً كلياً — بلا هذا الملف يعرض Next.js صفحة 404 عامة بلا تصميم ولا روابط
// داخلية، ما يُعامَل أحياناً كـ"soft 404" ضعيف الإشارة، ويهدر فرصة إعادة الزائر
// لصفحات حقيقية بدل مغادرة الموقع مباشرة.
export default function NotFound() {
  return (
    <div className="home-scope flex min-h-screen flex-col items-center justify-center gap-6 bg-(--home-bg) px-6 py-20 text-center text-(--home-fg)">
      <span className="text-sm font-bold tracking-widest text-(--home-accent)">٤٠٤</span>
      <h1 className="text-3xl font-bold sm:text-4xl">هذه الصفحة غير موجودة</h1>
      <p className="max-w-md text-(--home-muted)">
        الرابط الذي زرته غير صحيح أو تغيّر. جرّب إحدى الصفحات التالية:
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-(--home-accent) px-6 py-3 text-sm font-bold text-white shadow-lg shadow-(--home-accent)/20 transition-transform hover:scale-[1.02]"
        >
          الصفحة الرئيسية
        </Link>
        <Link
          href="/create"
          className="rounded-xl border border-(--home-border) px-6 py-3 text-sm font-bold text-(--home-fg) transition-colors hover:bg-(--home-surface)"
        >
          إنشاء نعوة
        </Link>
        <Link
          href="/guides"
          className="rounded-xl border border-(--home-border) px-6 py-3 text-sm font-bold text-(--home-fg) transition-colors hover:bg-(--home-surface)"
        >
          الأدلّة
        </Link>
        <Link
          href="/faq"
          className="rounded-xl border border-(--home-border) px-6 py-3 text-sm font-bold text-(--home-fg) transition-colors hover:bg-(--home-surface)"
        >
          الأسئلة الشائعة
        </Link>
      </div>
    </div>
  )
}
