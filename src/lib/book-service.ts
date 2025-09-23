import { Book } from '@/types/book'
import { mockBooks } from '@/data/mock-books'

let booksData: Book[] = [...mockBooks]

export const bookService = {
  getAllBooks: (): Book[] => {
    return booksData
  },

  getBookById: (id: string): Book | undefined => {
    return booksData.find(book => book.id === id)
  },

  addBook: (bookData: Omit<Book, 'id'>): Book => {
    const newBook: Book = {
      ...bookData,
      id: Math.random().toString(36).substr(2, 9)
    }

    booksData.push(newBook)
    return newBook
  },

  updateBook: (id: string, bookData: Omit<Book, 'id'>): Book | null => {
    const index = booksData.findIndex(book => book.id === id)

    if (index === -1) {
      return null
    }

    const updatedBook: Book = {
      ...bookData,
      id
    }

    booksData[index] = updatedBook
    return updatedBook
  },

  deleteBook: (id: string): boolean => {
    const index = booksData.findIndex(book => book.id === id)

    if (index === -1) {
      return false
    }

    booksData.splice(index, 1)
    return true
  },

  getBooksByStatus: (status: string) => {
    return booksData.filter(book => book.status === status)
  },

  getBooksByGenre: (genre: string) => {
    return booksData.filter(book => book.genre === genre)
  }
}