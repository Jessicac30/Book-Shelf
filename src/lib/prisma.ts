import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Priorizar Turso se as variáveis estiverem definidas
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN
  const databaseUrl = tursoUrl || process.env.DATABASE_URL || ''

  console.log('🔍 Debug - TURSO_DATABASE_URL:', tursoUrl)
  console.log('🔍 Debug - DATABASE_URL:', process.env.DATABASE_URL)
  console.log('🔍 Debug - Auth Token exists:', !!authToken)

  // Detectar ambiente
  const isProduction = process.env.VERCEL === '1'
  const isTurso = databaseUrl.startsWith('libsql://') || databaseUrl.startsWith('https://')

  // Log do ambiente
  if (isProduction) {
    console.log('🌐 Produção - Turso (SQLite)')
  } else if (isTurso) {
    console.log('💻 Desenvolvimento - Turso (SQLite remoto)')
  } else {
    console.log('💻 Desenvolvimento - SQLite (local)')
  }

  // Se for Turso (produção ou dev remoto)
  if (isTurso && authToken) {
    console.log('🔗 Conectando ao Turso:', databaseUrl)
    console.log('🔑 Auth Token (primeiros 20):', authToken.substring(0, 20))

    try {
      const libsql = createClient({
        url: databaseUrl,
        authToken: authToken,
      })

      const adapter = new PrismaLibSQL(libsql)

      const client = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })

      console.log('✅ Prisma Client com Turso adapter criado com sucesso!')
      return client
    } catch (error) {
      console.error('❌ Erro ao criar Turso client:', error)
      throw error
    }
  }

  // SQLite local (fallback)
  console.log('📁 Usando SQLite local:', databaseUrl)
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

const prisma = global.cachedPrisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.cachedPrisma = prisma
}

export { prisma }
export default prisma
