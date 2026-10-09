// يولّد أيقونات manifest.webmanifest المربّعة (192/512px) من public/icon.png
// (شعار بورتريه ٨٠٦×٩٨٢px) — يُشغَّل يدوياً مرة واحدة عند تغيير الشعار، وليس ضمن
// predev/prebuild (الشعار ثابت، لا يحتاج إعادة توليد عند كل تشغيل كمانيفست الخط).
import sharp from "sharp"
import { join } from "node:path"

const SRC = join(process.cwd(), "public/icon.png")
const SIZES = [192, 512]

for (const size of SIZES) {
  // logoScale: نسبة عرض الشعار داخل المربّع — ٧٠٪ يترك هامشاً آمناً كافياً
  // ليصلح الملف أيضاً كأيقونة "maskable" (Android يقصّ الحواف بدائرة/شكل).
  const logoWidth = Math.round(size * 0.7)
  const resizedLogo = await sharp(SRC)
    .resize({ width: logoWidth, fit: "inside" })
    .toBuffer()
  const meta = await sharp(resizedLogo).metadata()
  const top = Math.round((size - (meta.height ?? logoWidth)) / 2)
  const left = Math.round((size - (meta.width ?? logoWidth)) / 2)

  await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: resizedLogo, top, left }])
    .png()
    .toFile(join(process.cwd(), `public/icon-${size}.png`))

  console.log(`✓ public/icon-${size}.png`)
}
