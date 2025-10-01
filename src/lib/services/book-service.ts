import { bookRepository, genreRepository, CreateBookData, UpdateBookData, BookSearchParams } from '@/lib/repositories'
import { BookWithGenre, BookStats, LegacyGenre } from '@/types/book'
import { ReadingStatus } from '@prisma/client'

/**
 * Service para gerenciar operações de negócio relacionadas aos livros
 */
class BookService {

  /**
   * Buscar livros com filtros e paginação
   */
  async getBooks(params: BookSearchParams = {}) {
    const books = await bookRepository.findMany(params)
    const totalCount = await bookRepository.count(params)
    
    const { page = 1, limit = 20 } = params
    const totalPages = Math.ceil(totalCount / limit)
    
    return {
      books,
      totalCount,
      currentPage: page,
      totalPages,
    }
  }

  /**
   * Buscar livro por ID
   */
  async getBookById(id: string): Promise<BookWithGenre | null> {
    return bookRepository.findById(id)
  }

  /**
   * Criar um novo livro
   */
  async createBook(data: CreateBookData): Promise<BookWithGenre> {
    // Validações de negócio
    if (!data.title?.trim()) {
      throw new Error('Título é obrigatório')
    }
    
    if (!data.author?.trim()) {
      throw new Error('Autor é obrigatório')
    }
    
    if (data.rating && (data.rating < 0 || data.rating > 5)) {
      throw new Error('Avaliação deve estar entre 0 e 5')
    }
    
    if (data.currentPage && data.pages && data.currentPage > data.pages) {
      throw new Error('Página atual não pode ser maior que o total de páginas')
    }
    
    return bookRepository.create(data)
  }

  /**
   * Atualizar livro
   */
  async updateBook(id: string, data: UpdateBookData): Promise<BookWithGenre | null> {
    // Validações de negócio
    if (data.title !== undefined && !data.title?.trim()) {
      throw new Error('Título não pode estar vazio')
    }
    
    if (data.author !== undefined && !data.author?.trim()) {
      throw new Error('Autor não pode estar vazio')
    }
    
    if (data.rating !== undefined && data.rating !== null && (data.rating < 0 || data.rating > 5)) {
      throw new Error('Avaliação deve estar entre 0 e 5')
    }
    
    if (data.currentPage !== undefined && data.pages !== undefined && 
        data.currentPage !== null && data.pages !== null && data.currentPage > data.pages) {
      throw new Error('Página atual não pode ser maior que o total de páginas')
    }
    
    return bookRepository.update(id, data)
  }

  /**
   * Deletar livro
   */
  async deleteBook(id: string): Promise<boolean> {
    return bookRepository.delete(id)
  }

  /**
   * Atualizar progresso de leitura
   */
  async updateProgress(id: string, currentPage: number): Promise<BookWithGenre | null> {
    if (currentPage < 0) {
      throw new Error('Página atual não pode ser negativa')
    }
    
    return bookRepository.updateProgress(id, currentPage)
  }

  /**
   * Atualizar avaliação
   */
  async updateRating(id: string, rating: number): Promise<BookWithGenre | null> {
    if (rating < 0 || rating > 5) {
      throw new Error('Avaliação deve estar entre 0 e 5')
    }
    
    return bookRepository.updateRating(id, rating)
  }

  /**
   * Buscar livros por status
   */
  async getBooksByStatus(status: ReadingStatus): Promise<BookWithGenre[]> {
    return bookRepository.findByStatus(status)
  }

  /**
   * Buscar livros por gênero
   */
  async getBooksByGenre(genreId: string): Promise<BookWithGenre[]> {
    return bookRepository.findByGenreId(genreId)
  }

  /**
   * Obter estatísticas dos livros
   */
  async getStatistics(): Promise<BookStats> {
    return bookRepository.getStats()
  }

  /**
   * Buscar livros (texto livre)
   */
  async searchBooks(query: string): Promise<BookWithGenre[]> {
    if (!query.trim()) {
      return []
    }
    
    return bookRepository.findMany({ search: query })
  }

  /**
   * Marcar livro como lido e atualizar página atual
   */
  async markAsRead(id: string): Promise<BookWithGenre | null> {
    const book = await this.getBookById(id)
    if (!book) {
      throw new Error('Livro não encontrado')
    }
    
    const updateData: UpdateBookData = {
      status: 'LIDO',
      currentPage: book.pages || undefined
    }
    
    return bookRepository.update(id, updateData)
  }

  /**
   * Iniciar leitura de um livro
   */
  async startReading(id: string): Promise<BookWithGenre | null> {
    return bookRepository.update(id, { 
      status: 'LENDO',
      currentPage: 0
    })
  }

  /**
   * Pausar leitura de um livro
   */
  async pauseReading(id: string): Promise<BookWithGenre | null> {
    return bookRepository.update(id, { status: 'PAUSADO' })
  }

  /**
   * Abandonar leitura de um livro
   */
  async abandonReading(id: string): Promise<BookWithGenre | null> {
    return bookRepository.update(id, { status: 'ABANDONADO' })
  }

  /**
   * Migração: converter gênero legacy para ID do novo sistema
   */
  async migrateGenre(legacyGenre: LegacyGenre): Promise<string | null> {
    try {
      const genre = await genreRepository.findOrCreate(legacyGenre)
      return genre.id
    } catch (error) {
      console.error('Erro ao migrar gênero:', error)
      return null
    }
  }
}

export const bookService = new BookService()