import { prisma } from '@/lib/prisma'
import { bookService, genreService } from '@/lib/services'
import { LegacyGenre } from '@/types/book'

/**
 * Interface para dados legados do localStorage
 */
interface LegacyBook {
  id: string
  title: string
  author: string
  genre?: LegacyGenre
  year?: number
  pages?: number
  currentPage?: number
  status?: 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO'
  isbn?: string
  cover?: string
  rating?: number
  synopsis?: string
  notes?: string
}

/**
 * Migra dados do formato legacy (localStorage) para o banco Prisma
 */
export async function migrateFromLocalStorage(legacyData: LegacyBook[]) {
  console.log(`🔄 Iniciando migração de ${legacyData.length} livros...`)
  
  let migratedCount = 0
  let skippedCount = 0
  let errorCount = 0
  
  for (const legacyBook of legacyData) {
    try {
      // Verificar se o livro já existe no banco
      const existingBook = await prisma.book.findFirst({
        where: {
          OR: [
            { id: legacyBook.id },
            { 
              AND: [
                { title: legacyBook.title },
                { author: legacyBook.author }
              ]
            }
          ]
        }
      })
      
      if (existingBook) {
        console.log(`📖 Livro "${legacyBook.title}" já existe, pulando...`)
        skippedCount++
        continue
      }
      
      // Migrar ou criar gênero se existir
      let genreId: string | undefined = undefined
      if (legacyBook.genre) {
        try {
          const genre = await genreService.findOrCreateGenre(legacyBook.genre)
          genreId = genre.id
        } catch (error) {
          console.warn(`⚠️ Erro ao migrar gênero "${legacyBook.genre}":`, error)
        }
      }
      
      // Criar o livro no banco
      const bookData = {
        title: legacyBook.title,
        author: legacyBook.author,
        genreId: genreId ?? null,
        year: legacyBook.year ?? null,
        pages: legacyBook.pages ?? null,
        currentPage: legacyBook.currentPage ?? null,
        status: legacyBook.status || 'QUERO_LER',
        isbn: legacyBook.isbn ?? null,
        cover: legacyBook.cover ?? null,
        rating: legacyBook.rating ?? null,
        synopsis: legacyBook.synopsis ?? null,
        notes: legacyBook.notes ?? null
      }
      
      await bookService.createBook(bookData)
      
      console.log(`✅ Livro "${legacyBook.title}" migrado com sucesso!`)
      migratedCount++
      
    } catch (error) {
      console.error(`❌ Erro ao migrar livro "${legacyBook.title}":`, error)
      errorCount++
    }
  }
  
  console.log(`\n📊 Resultado da migração:`)
  console.log(`   ✅ Migrados: ${migratedCount}`)
  console.log(`   ⏭️ Pulados: ${skippedCount}`)
  console.log(`   ❌ Erros: ${errorCount}`)
  
  return {
    migrated: migratedCount,
    skipped: skippedCount,
    errors: errorCount
  }
}

/**
 * Script para ler dados do mock-books e migrar
 */
export async function migrateFromMockData() {
  console.log('🔄 Migrando dados dos mock books...')
  
  try {
    // Importar os dados mock
    const { mockBooks } = await import('@/data/mock-books')
    
    if (!mockBooks || !Array.isArray(mockBooks) || mockBooks.length === 0) {
      console.log('📝 Nenhum dado mock encontrado para migrar.')
      return
    }
    
    const result = await migrateFromLocalStorage(mockBooks as LegacyBook[])
    
    console.log('🎉 Migração dos dados mock concluída!')
    return result
    
  } catch (error) {
    console.error('💥 Erro ao migrar dados mock:', error)
    throw error
  }
}

/**
 * Utilitário para criar backup dos dados atuais
 */
export async function createBackup() {
  console.log('💾 Criando backup dos dados atuais...')
  
  try {
    const books = await prisma.book.findMany({
      include: {
        genre: true
      }
    })
    
    const genres = await prisma.genre.findMany()
    
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      books,
      genres
    }
    
    const fs = require('fs')
    const path = require('path')
    const backupDir = path.join(process.cwd(), 'backups')
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }
    
    const filename = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    const filepath = path.join(backupDir, filename)
    
    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2))
    
    console.log(`✅ Backup criado em: ${filepath}`)
    return filepath
    
  } catch (error) {
    console.error('❌ Erro ao criar backup:', error)
    throw error
  }
}

/**
 * Script completo de migração
 */
export async function runMigration() {
  console.log('🚀 Iniciando processo de migração completo...')
  
  try {
    // 1. Criar backup dos dados atuais
    await createBackup()
    
    // 2. Inicializar gêneros padrão
    await genreService.initializeDefaultGenres()
    
    // 3. Migrar dados mock se existirem
    await migrateFromMockData()
    
    console.log('🎉 Migração completa realizada com sucesso!')
    
  } catch (error) {
    console.error('💥 Erro durante a migração:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Script para executar diretamente via Node.js
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('✨ Script de migração executado com sucesso!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Falha no script de migração:', error)
      process.exit(1)
    })
}