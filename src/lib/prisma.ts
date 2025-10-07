import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const isProduction = process.env.VERCEL === '1'
  const databaseUrl = process.env.DATABASE_URL || ''
  const isSQLite = databaseUrl.startsWith('file:')

  if (isProduction) {
    console.log('🌐 Produção - PostgreSQL (Neon)')
  } else {
    console.log(`💻 Desenvolvimento - ${isSQLite ? 'SQLite' : 'PostgreSQL'}`)
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
