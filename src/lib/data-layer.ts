/**
 * Camada de Acesso aos Dados - BookShelf
 * 
 * Este arquivo centraliza todas as exportações relacionadas à camada de dados,
 * incluindo cliente Prisma, repositórios, services, tipos e utilitários.
 * 
 * Responsável por:
 * - Configuração do cliente Prisma
 * - Implementação de repositórios (CRUD operations)
 * - Services com regras de negócio
 * - Interfaces TypeScript type-safe
 * - Scripts de migração e seed
 * - Validadores e sanitizadores
 */

// Cliente Prisma e configuração
export { prisma } from './prisma'

// Repositórios para acesso aos dados
export * from './repositories'

// Services com regras de negócio
export * from './services'

// Scripts de migração e população
export { seedDatabase, seedGenres, seedBooks } from './scripts/seed'
export { migrateFromLocalStorage, migrateFromMockData, runMigration, createBackup } from './scripts/migrate'

// Validação e sanitização
export * from './validation'

// Re-export dos tipos Prisma mais comuns
export type { Book, Genre, ReadingStatus, Prisma } from '@prisma/client'