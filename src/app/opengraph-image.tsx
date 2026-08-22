// صورة المشاركة الاجتماعية (og:image / twitter:image) — تُطبَّق على كل مسارات
// الموقع تلقائياً ما لم يُعرَّف ملف opengraph-image محلي داخل مسار فرعي.
//
// **عمداً بلا أي نص عربي مُولَّد هنا**: next/og يستعمل Satori لتحويل الشجرة إلى
// صورة، ومحرك تشكيله للعربية غير مكتمل — جرّبناه فعلياً مع نص عربي فرمى
// "lookupType: 5 - substFormat: 3 is not yet supported" (نفس فئة عطل GSUB
// الموثّقة في CLAUDE.md لِـopentype.js مع المخطوطات القرآنية). الحل المعتمد هنا
// مطابق لذلك القرار: لا نص عربي مُركَّب بالكود، فقط الشعار (صورة نقطية جاهزة
// عبر <img> — Satori يعرض الصور النقطية بلا مشكلة، المشكلة حصراً في تشكيل
// النص الحيّ) فوق خلفية متدرّجة بألوان قالب "الليلي الفخم". عنوان/وصف الصفحة
// (عربيان، نصّ حقيقي) يصلان عبر وسوم og:title/og:description في layout.tsx —
// تلك نصوص عادية تعرضها منصّات التواصل بنفسها، لا صوراً مُرستَرة هنا.
import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const alt = "النعوة الإلكترونية — مولّد نعوات إسلامية"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), "public/icon-512.png"), "base64")
  const logoSrc = `data:image/png;base64,${logoData}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1c1812 0%, #0f0d0b 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "1120px",
            height: "550px",
            border: "2px solid #c9a94a",
            borderRadius: "12px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element --
              هذا ليس DOM حقيقياً بل شجرة Satori (next/og) — next/image غير قابل
              للاستعمال هنا إطلاقاً، و<img> هي الوسيلة الوحيدة المدعومة لتضمين
              صورة نقطية. */}
          <img src={logoSrc} width={340} height={415} alt="" />
        </div>
      </div>
    ),
    size
  )
}
