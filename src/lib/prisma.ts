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

  if (isProduction) {
    console.log('🚀 Produção detectada - configurando Turso')

    // Ler variáveis
    const url = process.env.TURSO_DATABASE_URL || ''
    const authToken = process.env.TURSO_AUTH_TOKEN || ''

    console.log('📊 Debug:', {
      hasUrl: !!url,
      hasToken: !!authToken,
      urlStart: url.substring(0, 20)
    })

    if (!url || !authToken) {
      console.error('❌ Variáveis Turso ausentes!')
      // Fallback para erro mais claro
      throw new Error('TURSO_DATABASE_URL ou TURSO_AUTH_TOKEN não configurados')
    }

    const { PrismaLibSQL } = require('@prisma/adapter-libsql')
    const { createClient } = require('@libsql/client')

    console.log('🔌 Criando cliente Turso com:', { url: url.substring(0, 30), tokenLength: authToken.length })
    const libsql = createClient({ url, authToken })
    console.log('🔌 Cliente criado, criando adapter...')
    const adapter = new PrismaLibSQL(libsql)

    console.log('✅ Turso configurado completamente')

    return new PrismaClient({
      adapter,
      log: ['error'],
    })
  }

  console.log('💻 Desenvolvimento - SQLite local')
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Lazy loading - só criar quando realmente usar
let _prisma: PrismaClient | undefined

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!_prisma) {
      console.log('🔧 Inicializando Prisma Client...')
      _prisma = globalForPrisma.prisma ?? createPrismaClient()
      if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = _prisma
    }
    return (_prisma as any)[prop]
  }
})

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