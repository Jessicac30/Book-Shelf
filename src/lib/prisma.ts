import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoToken = process.env.TURSO_AUTH_TOKEN
  const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

  console.log('🔍 Debug Prisma Config:', {
    isProduction,
    hasUrl: !!tursoUrl,
    hasTok: !!tursoToken,
    urlPrefix: tursoUrl?.substring(0, 20),
  })

  // Se estiver usando Turso (produção), use o adapter
  if (isProduction && tursoUrl && tursoToken) {
    console.log('🔄 Usando Turso database')
    const { PrismaLibSQL } = require('@prisma/adapter-libsql')
    const { createClient } = require('@libsql/client')

    const libsql = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    })

    const adapter = new PrismaLibSQL(libsql)

    return new PrismaClient({
      adapter,
      log: ['error', 'warn'],
      errorFormat: 'minimal',
    })
  }

  // Caso contrário, use SQLite local (desenvolvimento)
  console.log('🔄 Usando SQLite local')
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Utility function to handle database connection
export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

// Utility function to handle database disconnection
export async function disconnectDB() {
  try {
    await prisma.$disconnect()
    console.log('📡 Database disconnected')
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error)
  }
}

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma