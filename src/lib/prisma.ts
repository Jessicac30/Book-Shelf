import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })

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