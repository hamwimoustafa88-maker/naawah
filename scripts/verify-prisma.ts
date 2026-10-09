import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  try {
    const statCount = await prisma.obituaryStat.count()
    console.log('✅ Connected. ObituaryStat count:', statCount)
  } catch (error) {
    console.error('❌ Connection failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
