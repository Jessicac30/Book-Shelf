import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Detectar se está no Vercel
  const isVercel = process.env.VERCEL === '1'

  // Se estiver no Vercel, SEMPRE usar Turso
  if (isVercel) {
    console.log('🌐 Detectado ambiente Vercel - usando Turso')
    const tursoUrl = process.env.TURSO_DATABASE_URL
    const tursoToken = process.env.TURSO_AUTH_TOKEN

    if (!tursoUrl || !tursoToken) {
      console.error('❌ ERRO: Variáveis Turso não encontradas!')
      console.error('TURSO_DATABASE_URL:', tursoUrl ? 'definida' : 'undefined')
      console.error('TURSO_AUTH_TOKEN:', tursoToken ? 'definida' : 'undefined')
      throw new Error('Variáveis de ambiente do Turso não configuradas no Vercel!')
    }

    console.log('✅ Conectando ao Turso:', tursoUrl.substring(0, 30) + '...')
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
    })
  }

  // Caso contrário, use SQLite local (desenvolvimento)
  console.log('💻 Ambiente local - usando SQLite')
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
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