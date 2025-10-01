import { prisma } from '@/lib/prisma'
import { genreService } from '@/lib/services'

/**
 * Script para popular o banco de dados com gêneros padrão
 */
export async function seedGenres() {
  console.log('🌱 Populando banco com gêneros padrão...')
  
  try {
    await genreService.initializeDefaultGenres()
    console.log('✅ Gêneros padrão criados com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao criar gêneros padrão:', error)
    throw error
  }
}

/**
 * Script para popular o banco de dados com livros de exemplo
 */
export async function seedBooks() {
  console.log('📚 Populando banco com livros de exemplo...')
  
  try {
    // Buscar alguns gêneros para usar nos livros
    const ficcao = await genreService.findOrCreateGenre('Ficção')
    const fantasia = await genreService.findOrCreateGenre('Fantasia')
    const biografia = await genreService.findOrCreateGenre('Biografia')
    const tecnologia = await genreService.findOrCreateGenre('Tecnologia')
    
    const exampleBooks = [
      {
        title: 'Dom Casmurro',
        author: 'Machado de Assis',
        genreId: ficcao.id,
        year: 1899,
        pages: 256,
        currentPage: 0,
        status: 'QUERO_LER' as const,
        rating: 4.5,
        synopsis: 'Um dos maiores clássicos da literatura brasileira...',
        cover: 'https://example.com/dom-casmurro.jpg'
      },
      {
        title: 'O Senhor dos Anéis',
        author: 'J.R.R. Tolkien',
        genreId: fantasia.id,
        year: 1954,
        pages: 1200,
        currentPage: 150,
        status: 'LENDO' as const,
        rating: 5.0,
        synopsis: 'Uma épica jornada pela Terra Média...'
      },
      {
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        genreId: biografia.id,
        year: 2011,
        pages: 656,
        currentPage: 656,
        status: 'LIDO' as const,
        rating: 4.8,
        synopsis: 'A biografia definitiva do cofundador da Apple...'
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        genreId: tecnologia.id,
        year: 2008,
        pages: 464,
        currentPage: 200,
        status: 'PAUSADO' as const,
        rating: 4.7,
        synopsis: 'Um manual sobre como escrever código limpo...'
      }
    ]
    
    for (const bookData of exampleBooks) {
      // Verificar se o livro já existe pelo título
      const existingBook = await prisma.book.findFirst({
        where: { title: bookData.title }
      })
      
      if (!existingBook) {
        await prisma.book.create({
          data: bookData
        })
        console.log(`📖 Livro "${bookData.title}" criado!`)
      } else {
        console.log(`📖 Livro "${bookData.title}" já existe, pulando...`)
      }
    }
    
    console.log('✅ Livros de exemplo criados com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao criar livros de exemplo:', error)
    throw error
  }
}

/**
 * Script principal para popular todo o banco
 */
export async function seedDatabase() {
  console.log('🚀 Iniciando população do banco de dados...')
  
  try {
    await seedGenres()
    await seedBooks()
    
    console.log('🎉 Banco de dados populado com sucesso!')
  } catch (error) {
    console.error('💥 Erro durante a população do banco:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Script para executar diretamente via Node.js
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✨ Script de seed executado com sucesso!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Falha no script de seed:', error)
      process.exit(1)
    })
}