'use client'

import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react'
import { Book, Genre, ReadingStatus } from '@/types/book'
import { mockBooks } from '@/data/mock-books'

// Tipos do contexto
interface BookState {
  books: Book[]
  isLoading: boolean
  error: string | null
  filters: {
    search: string
    genre: Genre | 'all'
    status: ReadingStatus | 'all'
  }
  stats: {
    total: number
    read: number
    reading: number
    wantToRead: number
    paused: number
    abandoned: number
    totalPages: number
    pagesRead: number
  }
}

type BookAction =
  | { type: 'SET_BOOKS'; payload: Book[] }
  | { type: 'ADD_BOOK'; payload: Book }
  | { type: 'UPDATE_BOOK'; payload: Book }
  | { type: 'DELETE_BOOK'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<BookState['filters']> }
  | { type: 'CALCULATE_STATS' }

interface BookContextType extends BookState {
  dispatch: React.Dispatch<BookAction>
  // Helper methods
  addBook: (book: Omit<Book, 'id'>) => Book
  updateBook: (id: string, book: Omit<Book, 'id'>) => Book | null
  deleteBook: (id: string) => boolean
  getBookById: (id: string) => Book | undefined
  getBooksByStatus: (status: ReadingStatus) => Book[]
  getBooksByGenre: (genre: Genre) => Book[]
  searchBooks: (query: string) => Book[]
  getFilteredBooks: () => Book[]
}

const initialState: BookState = {
  books: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    genre: 'all',
    status: 'all'
  },
  stats: {
    total: 0,
    read: 0,
    reading: 0,
    wantToRead: 0,
    paused: 0,
    abandoned: 0,
    totalPages: 0,
    pagesRead: 0
  }
}

// Função para calcular estatísticas
const calculateStats = (books: Book[]) => {
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

// Reducer
const bookReducer = (state: BookState, action: BookAction): BookState => {
  switch (action.type) {
    case 'SET_BOOKS':
      return {
        ...state,
        books: action.payload,
        stats: calculateStats(action.payload)
      }

    case 'ADD_BOOK':
      const newBooks = [...state.books, action.payload]
      return {
        ...state,
        books: newBooks,
        stats: calculateStats(newBooks)
      }

    case 'UPDATE_BOOK':
      const updatedBooks = state.books.map(book =>
        book.id === action.payload.id ? action.payload : book
      )
      return {
        ...state,
        books: updatedBooks,
        stats: calculateStats(updatedBooks)
      }

    case 'DELETE_BOOK':
      const filteredBooks = state.books.filter(book => book.id !== action.payload)
      return {
        ...state,
        books: filteredBooks,
        stats: calculateStats(filteredBooks)
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      }

    case 'CALCULATE_STATS':
      return {
        ...state,
        stats: calculateStats(state.books)
      }

    default:
      return state
  }
}

// Context
const BookContext = createContext<BookContextType | undefined>(undefined)

// Provider
export function BookProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookReducer, initialState)
  const [mounted, setMounted] = useState(false)

  // Marcar como montado
  useEffect(() => {
    setMounted(true)
  }, [])

  // Inicializar dados apenas no cliente
  useEffect(() => {
    if (!mounted) return

    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      // Carregar dados do localStorage ou usar dados mock
      const savedBooks = localStorage.getItem('bookshelf-books')
      const books = savedBooks ? JSON.parse(savedBooks) : mockBooks
      dispatch({ type: 'SET_BOOKS', payload: books })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar livros' })
      dispatch({ type: 'SET_BOOKS', payload: mockBooks })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [mounted])

  // Salvar no localStorage quando os livros mudarem
  useEffect(() => {
    if (mounted && state.books.length > 0) {
      localStorage.setItem('bookshelf-books', JSON.stringify(state.books))
    }
  }, [state.books, mounted])

  // Helper methods
  const addBook = (bookData: Omit<Book, 'id'>): Book => {
    const newBook: Book = {
      ...bookData,
      id: Math.random().toString(36).substr(2, 9)
    }
    dispatch({ type: 'ADD_BOOK', payload: newBook })
    return newBook
  }

  const updateBook = (id: string, bookData: Omit<Book, 'id'>): Book | null => {
    const existingBook = state.books.find(book => book.id === id)
    if (!existingBook) return null

    const updatedBook: Book = { ...bookData, id }
    dispatch({ type: 'UPDATE_BOOK', payload: updatedBook })
    return updatedBook
  }

  const deleteBook = (id: string): boolean => {
    const bookExists = state.books.some(book => book.id === id)
    if (!bookExists) return false

    dispatch({ type: 'DELETE_BOOK', payload: id })
    return true
  }

  const getBookById = (id: string): Book | undefined => {
    return state.books.find(book => book.id === id)
  }

  const getBooksByStatus = (status: ReadingStatus): Book[] => {
    return state.books.filter(book => book.status === status)
  }

  const getBooksByGenre = (genre: Genre): Book[] => {
    return state.books.filter(book => book.genreId === genre.id)
  }

  const searchBooks = (query: string): Book[] => {
    if (!query) return state.books
    
    const lowercaseQuery = query.toLowerCase()
    return state.books.filter(
      book =>
        book.title.toLowerCase().includes(lowercaseQuery) ||
        book.author.toLowerCase().includes(lowercaseQuery)
    )
  }

  const getFilteredBooks = (): Book[] => {
    let filtered = state.books

    // Filtro por busca
    if (state.filters.search) {
      const query = state.filters.search.toLowerCase()
      filtered = filtered.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      )
    }

    // Filtro por gênero
    if (state.filters.genre !== 'all') {
      filtered = filtered.filter(book => book.genreId === state.filters.genre)
    }

    // Filtro por status
    if (state.filters.status !== 'all') {
      filtered = filtered.filter(book => book.status === state.filters.status)
    }

    return filtered
  }

  const value: BookContextType = {
    ...state,
    dispatch,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    getBooksByStatus,
    getBooksByGenre,
    searchBooks,
    getFilteredBooks
  }

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>
}

// Hook para usar o contexto
export function useBooks() {
  const context = useContext(BookContext)
  if (context === undefined) {
    // Durante o SSR ou se não está dentro do provider, retorna valores padrão
    return {
      books: [],
      isLoading: false,
      error: null,
      filters: {
        search: '',
        genre: 'all' as Genre | 'all',
        status: 'all' as ReadingStatus | 'all'
      },
      stats: {
        total: 0,
        read: 0,
        reading: 0,
        wantToRead: 0,
        paused: 0,
        abandoned: 0,
        totalPages: 0,
        pagesRead: 0
      },
      dispatch: () => {},
      addBook: () => ({ id: '', title: '', author: '' }),
      updateBook: () => null,
      deleteBook: () => false,
      getBookById: () => undefined,
      getBooksByStatus: () => [],
      getBooksByGenre: () => [],
      searchBooks: () => [],
      getFilteredBooks: () => []
    }
  }
  return context
}

// Hooks específicos para facilitar o uso
export function useBookStats() {
  const { stats } = useBooks()
  return stats
}

export function useBookFilters() {
  const { filters, dispatch } = useBooks()
  
  const setFilters = (newFilters: Partial<BookState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters })
  }

  return { filters, setFilters }
}