import { prisma } from '@/lib/prisma'
import { Book, Genre, ReadingStatus, Prisma } from '@prisma/client'
import { BookWithGenre } from '@/types/book'

// Tipos para criação e atualização de livros
export type CreateBookData = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateBookData = Partial<CreateBookData>

// Tipo para busca de livros
export interface BookSearchParams {
  search?: string
  status?: ReadingStatus
  genreId?: string
  page?: number
  limit?: number
}

// Tipo para estatísticas
export interface BookStats {
  total: number
  read: number
  reading: number
  wantToRead: number
  paused: number
  abandoned: number
  totalPages: number
  pagesRead: number
  averageRating: number
}

class BookRepository {
  
  /**
   * Buscar todos os livros com filtros opcionais
   */
  async findMany(params: BookSearchParams = {}): Promise<BookWithGenre[]> {
    const { search, status, genreId, page = 1, limit = 20 } = params
    
    const where: Prisma.BookWhereInput = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    if (genreId) {
      where.genreId = genreId
    }
    
    const books = await prisma.book.findMany({
      where,
      include: {
        genre: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    })
    
    return books
  }

  /**
   * Buscar livro por ID
   */
  async findById(id: string): Promise<BookWithGenre | null> {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        genre: true,
      },
    })
    
    return book
  }

  /**
   * Criar um novo livro
   */
  async create(data: CreateBookData): Promise<BookWithGenre> {
    const book = await prisma.book.create({
      data,
      include: {
        genre: true,
      },
    })
    
    return book
  }

  /**
   * Atualizar um livro
   */
  async update(id: string, data: UpdateBookData): Promise<BookWithGenre | null> {
    try {
      const book = await prisma.book.update({
        where: { id },
        data,
        include: {
          genre: true,
        },
      })
      
      return book
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null // Livro não encontrado
      }
      throw error
    }
  }

  /**
   * Deletar um livro
   */
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.book.delete({
        where: { id },
      })
      
      return true
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false // Livro não encontrado
      }
      throw error
    }
  }

  /**
   * Buscar livros por status
   */
  async findByStatus(status: ReadingStatus): Promise<BookWithGenre[]> {
    const books = await prisma.book.findMany({
      where: { status },
      include: {
        genre: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
    
    return books
  }

  /**
   * Buscar livros por gênero
   */
  async findByGenreId(genreId: string): Promise<BookWithGenre[]> {
    const books = await prisma.book.findMany({
      where: { genreId },
      include: {
        genre: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
    
    return books
  }

  /**
   * Atualizar progresso de leitura
   */
  async updateProgress(id: string, currentPage: number): Promise<BookWithGenre | null> {
    return this.update(id, { currentPage })
  }

  /**
   * Atualizar avaliação do livro
   */
  async updateRating(id: string, rating: number): Promise<BookWithGenre | null> {
    return this.update(id, { rating })
  }

  /**
   * Obter estatísticas dos livros
   */
  async getStats(): Promise<BookStats> {
    const books = await prisma.book.findMany()
    
    const stats = books.reduce(
      (acc, book) => {
        acc.total++
        
        switch (book.status) {
          case 'LIDO':
            acc.read++
            break
          case 'LENDO':
            acc.reading++
            break
          case 'QUERO_LER':
            acc.wantToRead++
            break
          case 'PAUSADO':
            acc.paused++
            break
          case 'ABANDONADO':
            acc.abandoned++
            break
        }
        
        if (book.pages) {
          acc.totalPages += book.pages
        }
        
        if (book.currentPage) {
          acc.pagesRead += book.currentPage
        }
        
        if (book.rating) {
          acc.averageRating += book.rating
        }
        
        return acc
      },
      {
        total: 0,
        read: 0,
        reading: 0,
        wantToRead: 0,
        paused: 0,
        abandoned: 0,
        totalPages: 0,
        pagesRead: 0,
        averageRating: 0,
      }
    )
    
    // Calcular média das avaliações
    if (stats.total > 0) {
      stats.averageRating = stats.averageRating / stats.total
    }
    
    return stats
  }

  /**
   * Contar livros com filtros
   */
  async count(params: BookSearchParams = {}): Promise<number> {
    const { search, status, genreId } = params
    
    const where: Prisma.BookWhereInput = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    if (genreId) {
      where.genreId = genreId
    }
    
    return prisma.book.count({ where })
  }
}

export const bookRepository = new BookRepository()