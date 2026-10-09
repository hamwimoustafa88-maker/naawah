// يولّد src/lib/calligraphy/registry.ts من محتويات public/calligraphy/handmade/*.svg
// عند كل تشغيل dev/build (عبر predev/prebuild) — بلا حاجة لأي تحقق شبكي وقت التشغيل.
// راجع src/components/canvas/Calligraphy.tsx لمكان استهلاك هذا الملف.

import fs from "node:fs"
import path from "node:path"

const HANDMADE_DIR = path.resolve(process.cwd(), "public/calligraphy/handmade")
const OUT_FILE = path.resolve(process.cwd(), "src/lib/calligraphy/registry.ts")

function main() {
  const ids = fs.existsSync(HANDMADE_DIR)
    ? fs
        .readdirSync(HANDMADE_DIR)
        .filter((f) => f.endsWith(".svg"))
        .map((f) => f.slice(0, -".svg".length))
        .sort()
    : []

  const content = `// مولَّد تلقائياً بواسطة scripts/generate-calligraphy-manifest.ts — لا تُعدّله يدوياً.
// يعمل قبل كل "dev"/"build" (predev/prebuild في package.json) فيبقى متزامناً مع
// محتويات public/calligraphy/handmade/ بلا أي فحص شبكي وقت التشغيل.

export const HANDMADE_CALLIGRAPHY_IDS: ReadonlySet<string> = new Set(${JSON.stringify(ids)})
`

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, content, "utf-8")
  console.log(`✓ calligraphy registry: ${ids.length} ملف يدوي مسجَّل`)
}

main()
