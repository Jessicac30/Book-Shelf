import { Book as PrismaBook, Genre as PrismaGenre, ReadingStatus as PrismaReadingStatus } from '@prisma/client'

export type ReadingStatus = PrismaReadingStatus
export type Genre = PrismaGenre  
export type Book = PrismaBook

export interface BookWithGenre extends Book {
  genre?: Genre | null
}

export interface BookFormData {
  title: string
  author: string
  genreId?: string
  year?: number
  pages?: number
  currentPage?: number
  status?: ReadingStatus
  isbn?: string
  cover?: string
  rating?: number
  synopsis?: string
  notes?: string
}

export interface BooksResponse {
  books: BookWithGenre[]
  totalCount: number
  currentPage: number
  totalPages: number
}

export interface GenresResponse {
  genres: Genre[]
}

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

export interface BookFilters {
  search?: string
  status?: ReadingStatus
  genreId?: string
  page?: number
  limit?: number
}

export interface ApiError {
  message: string
  code?: string
  field?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  success: boolean
}

export type LegacyGenre =
  | 'Literatura Brasileira'
  | 'Ficção Científica'
  | 'Realismo Mágico'
  | 'Ficção'
  | 'Fantasia'
  | 'Romance'
  | 'Biografia'
  | 'História'
  | 'Autoajuda'
  | 'Tecnologia'
  | 'Programação'
  | 'Negócios'
  | 'Psicologia'
  | 'Filosofia'
  | 'Poesia'
