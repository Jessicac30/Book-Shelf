import { Book, Genre, ReadingStatus } from '@/types/book'

// Validadores específicos para campos do livro
export const validators = {
  // Validação de título
  title: (value: string): string | null => {
    if (!value?.trim()) {
      return 'Título é obrigatório'
    }
    if (value.trim().length < 2) {
      return 'Título deve ter pelo menos 2 caracteres'
    }
    if (value.trim().length > 200) {
      return 'Título deve ter no máximo 200 caracteres'
    }
    return null
  },

  // Validação de autor
  author: (value: string): string | null => {
    if (!value?.trim()) {
      return 'Autor é obrigatório'
    }
    if (value.trim().length < 2) {
      return 'Nome do autor deve ter pelo menos 2 caracteres'
    }
    if (value.trim().length > 100) {
      return 'Nome do autor deve ter no máximo 100 caracteres'
    }
    return null
  },

  // Validação de ano
  year: (value: number | string | undefined): string | null => {
    if (value === undefined || value === '') {
      return null // Campo opcional
    }
    
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value
    
    if (isNaN(numValue)) {
      return 'Ano deve ser um número válido'
    }
    
    const currentYear = new Date().getFullYear()
    if (numValue < 1000 || numValue > currentYear + 10) {
      return `Ano deve estar entre 1000 e ${currentYear + 10}`
    }
    
    return null
  },

  // Validação de páginas
  pages: (value: number | string | undefined): string | null => {
    if (value === undefined || value === '') {
      return null // Campo opcional
    }
    
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value
    
    if (isNaN(numValue)) {
      return 'Número de páginas deve ser um número válido'
    }
    
    if (numValue < 1) {
      return 'Número de páginas deve ser maior que 0'
    }
    
    if (numValue > 50000) {
      return 'Número de páginas deve ser menor que 50.000'
    }
    
    return null
  },

  // Validação de página atual
  currentPage: (value: number | string | undefined, totalPages?: number): string | null => {
    if (value === undefined || value === '') {
      return null // Campo opcional
    }
    
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value
    
    if (isNaN(numValue)) {
      return 'Página atual deve ser um número válido'
    }
    
    if (numValue < 0) {
      return 'Página atual deve ser maior ou igual a 0'
    }
    
    if (totalPages && numValue > totalPages) {
      return `Página atual não pode ser maior que o total de páginas (${totalPages})`
    }
    
    return null
  },

  // Validação de ISBN
  isbn: (value: string | undefined): string | null => {
    if (!value?.trim()) {
      return null // Campo opcional
    }
    
    // Remove traços e espaços
    const cleanIsbn = value.replace(/[-\s]/g, '')
    
    // Verifica se é ISBN-10 ou ISBN-13
    if (!/^\d{10}$/.test(cleanIsbn) && !/^\d{13}$/.test(cleanIsbn)) {
      return 'ISBN deve ter 10 ou 13 dígitos'
    }
    
    return null
  },

  // Validação de URL da capa
  cover: (value: string | undefined): string | null => {
    if (!value?.trim()) {
      return null // Campo opcional
    }
    
    try {
      new URL(value)
      return null
    } catch {
      return 'URL da capa deve ser válida'
    }
  },

  // Validação de rating
  rating: (value: number | string | undefined): string | null => {
    if (value === undefined || value === '') {
      return null // Campo opcional
    }
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    
    if (isNaN(numValue)) {
      return 'Avaliação deve ser um número válido'
    }
    
    if (numValue < 0 || numValue > 5) {
      return 'Avaliação deve estar entre 0 e 5'
    }
    
    return null
  },

  // Validação de gênero
  genre: (value: string | undefined): string | null => {
    if (!value) {
      return null // Campo opcional
    }
    
    const validGenres: Genre[] = [
      'Literatura Brasileira',
      'Ficção Científica',
      'Realismo Mágico',
      'Ficção',
      'Fantasia',
      'Romance',
      'Biografia',
      'História',
      'Autoajuda',
      'Tecnologia',
      'Programação',
      'Negócios',
      'Psicologia',
      'Filosofia',
      'Poesia'
    ]
    
    if (!validGenres.includes(value as Genre)) {
      return 'Gênero selecionado é inválido'
    }
    
    return null
  },

  // Validação de status
  status: (value: string | undefined): string | null => {
    if (!value) {
      return null // Campo opcional
    }
    
    const validStatuses: ReadingStatus[] = [
      'QUERO_LER',
      'LENDO',
      'LIDO',
      'PAUSADO',
      'ABANDONADO'
    ]
    
    if (!validStatuses.includes(value as ReadingStatus)) {
      return 'Status selecionado é inválido'
    }
    
    return null
  },

  // Validação de sinopse
  synopsis: (value: string | undefined): string | null => {
    if (!value?.trim()) {
      return null // Campo opcional
    }
    
    if (value.trim().length > 2000) {
      return 'Sinopse deve ter no máximo 2000 caracteres'
    }
    
    return null
  },

  // Validação de notas
  notes: (value: string | undefined): string | null => {
    if (!value?.trim()) {
      return null // Campo opcional
    }
    
    if (value.trim().length > 1000) {
      return 'Notas devem ter no máximo 1000 caracteres'
    }
    
    return null
  }
}

// Validação completa de um livro
export function validateBook(book: Partial<Book>): Record<string, string> {
  const errors: Record<string, string> = {}
  
  // Validar campos obrigatórios
  const titleError = validators.title(book.title || '')
  if (titleError) errors.title = titleError
  
  const authorError = validators.author(book.author || '')
  if (authorError) errors.author = authorError
  
  // Validar campos opcionais
  const yearError = validators.year(book.year)
  if (yearError) errors.year = yearError
  
  const pagesError = validators.pages(book.pages)
  if (pagesError) errors.pages = pagesError
  
  const currentPageError = validators.currentPage(book.currentPage, book.pages)
  if (currentPageError) errors.currentPage = currentPageError
  
  const isbnError = validators.isbn(book.isbn)
  if (isbnError) errors.isbn = isbnError
  
  const coverError = validators.cover(book.cover)
  if (coverError) errors.cover = coverError
  
  const ratingError = validators.rating(book.rating)
  if (ratingError) errors.rating = ratingError
  
  const genreError = validators.genre(book.genre)
  if (genreError) errors.genre = genreError
  
  const statusError = validators.status(book.status)
  if (statusError) errors.status = statusError
  
  const synopsisError = validators.synopsis(book.synopsis)
  if (synopsisError) errors.synopsis = synopsisError
  
  const notesError = validators.notes(book.notes)
  if (notesError) errors.notes = notesError
  
  return errors
}

// Utilitário para validar se um livro está válido
export function isBookValid(book: Partial<Book>): boolean {
  const errors = validateBook(book)
  return Object.keys(errors).length === 0
}

// Utilitário para sanitizar dados de entrada
export function sanitizeBookData(book: Partial<Book>): Partial<Book> {
  return {
    ...book,
    title: book.title?.trim(),
    author: book.author?.trim(),
    isbn: book.isbn?.replace(/[-\s]/g, ''),
    cover: book.cover?.trim(),
    synopsis: book.synopsis?.trim(),
    notes: book.notes?.trim(),
    year: book.year ? Number(book.year) : undefined,
    pages: book.pages ? Number(book.pages) : undefined,
    currentPage: book.currentPage ? Number(book.currentPage) : undefined,
    rating: book.rating ? Number(book.rating) : undefined
  }
}

// Utilitário para gerar mensagens de erro amigáveis
export function getFieldDisplayName(field: string): string {
  const displayNames: Record<string, string> = {
    title: 'Título',
    author: 'Autor',
    genre: 'Gênero',
    year: 'Ano de Publicação',
    pages: 'Número de Páginas',
    currentPage: 'Página Atual',
    status: 'Status de Leitura',
    isbn: 'ISBN',
    cover: 'URL da Capa',
    rating: 'Avaliação',
    synopsis: 'Sinopse',
    notes: 'Notas Pessoais'
  }
  
  return displayNames[field] || field
}

// Utilitário para formatar erros de validação
export function formatValidationErrors(errors: Record<string, string>): string[] {
  return Object.entries(errors).map(([field, error]) => {
    const fieldName = getFieldDisplayName(field)
    return `${fieldName}: ${error}`
  })
}