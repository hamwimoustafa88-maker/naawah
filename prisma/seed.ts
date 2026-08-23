import { PrismaClient } from '../generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const SEED_TEMPLATES = [
  { slug: 'gold-classic', name: 'الكلاسيكي الذهبي', category: 'تقليدي', isDefault: true },
  { slug: 'olive-calm', name: 'الزيتي الهادئ', category: 'حديث', isDefault: false },
  { slug: 'modern-minimal', name: 'الزجاجي الحديث', category: 'حديث', isDefault: false },
  { slug: 'thuluth-focus', name: 'الخط الثلث المترادف', category: 'تقليدي', isDefault: false },
  { slug: 'royal-monogram', name: 'البروتوكولي الملكي', category: 'ملكي', isDefault: false },
  { slug: 'traditional-press', name: 'الصحيفة التقليدية', category: 'تقليدي', isDefault: false },
  { slug: 'midnight-elegant', name: 'الليلي الفخم', category: 'ملكي', isDefault: false },
  { slug: 'tripoli-north', name: 'طرابلس وشمال لبنان', category: 'تقليدي', isDefault: false },
]

async function main() {
  for (const t of SEED_TEMPLATES) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: { name: t.name, category: t.category, isDefault: t.isDefault },
      create: t,
    })
  }
  console.log(`Seeded ${SEED_TEMPLATES.length} templates.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
