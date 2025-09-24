import { Book } from '@/types/book'
import { mockBooks } from '@/data/mock-books'

// Classe para gerenciar os livros com localStorage
class BookService {
  private readonly STORAGE_KEY = 'bookshelf-books'

  // Obter todos os livros
  getAllBooks(): Book[] {
    try {
      const savedBooks = localStorage.getItem(this.STORAGE_KEY)
      return savedBooks ? JSON.parse(savedBooks) : mockBooks
    } catch (error) {
      console.warn('Erro ao carregar livros do localStorage:', error)
      return mockBooks
    }
  }

  // Salvar livros no localStorage
  private saveBooks(books: Book[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(books))
    } catch (error) {
      console.error('Erro ao salvar livros no localStorage:', error)
    }
  }

  // Obter livro por ID
  getBookById(id: string): Book | undefined {
    const books = this.getAllBooks()
    return books.find(book => book.id === id)
  }

  // Adicionar novo livro
  addBook(bookData: Omit<Book, 'id'>): Book {
    const books = this.getAllBooks()
    const newBook: Book = {
      ...bookData,
      id: Math.random().toString(36).substr(2, 9)
    }

    books.push(newBook)
    this.saveBooks(books)
    return newBook
  }

  // Atualizar livro
  updateBook(id: string, bookData: Omit<Book, 'id'>): Book | null {
    const books = this.getAllBooks()
    const index = books.findIndex(book => book.id === id)

    if (index === -1) {
      return null
    }

    const updatedBook: Book = {
      ...bookData,
      id
    }

    books[index] = updatedBook
    this.saveBooks(books)
    return updatedBook
  }

  // Excluir livro
  deleteBook(id: string): boolean {
    const books = this.getAllBooks()
    const index = books.findIndex(book => book.id === id)

    if (index === -1) {
      return false
    }

    books.splice(index, 1)
    this.saveBooks(books)
    return true
  }

  // Obter livros por status
  getBooksByStatus(status: string): Book[] {
    const books = this.getAllBooks()
    return books.filter(book => book.status === status)
  }

  // Obter livros por gênero
  getBooksByGenre(genre: string): Book[] {
    const books = this.getAllBooks()
    return books.filter(book => book.genre === genre)
  }

  // Buscar livros por título ou autor
  searchBooks(query: string): Book[] {
    const books = this.getAllBooks()
    if (!query.trim()) return books

    const lowercaseQuery = query.toLowerCase().trim()
    return books.filter(book =>
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.genre?.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Obter estatísticas
  getStats() {
    const books = this.getAllBooks()
    
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
        pagesRead: 0
      }
    )

    return stats
  }

  // Resetar para dados mock (útil para desenvolvimento)
  resetToMockData(): void {
    this.saveBooks(mockBooks)
  }

  // Exportar dados (backup)
  exportData(): string {
    const books = this.getAllBooks()
    return JSON.stringify(books, null, 2)
  }

  // Importar dados (restore)
  importData(jsonData: string): boolean {
    try {
      const books = JSON.parse(jsonData)
      if (Array.isArray(books)) {
        this.saveBooks(books)
        return true
      }
      return false
    } catch {
      return false
    }
  }
}

export const bookService = new BookService()