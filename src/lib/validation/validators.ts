import { ReadingStatus } from '@prisma/client'

/**
 * Validadores para os dados de entrada
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Valida dados de livro
 */
export function validateBookData(data: any): ValidationResult {
  const errors: string[] = []
  
  // Validações obrigatórias
  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    errors.push('Título é obrigatório e deve ser uma string não vazia')
  }
  
  if (!data.author || typeof data.author !== 'string' || !data.author.trim()) {
    errors.push('Autor é obrigatório e deve ser uma string não vazia')
  }
  
  // Validações opcionais
  if (data.year !== undefined && data.year !== null) {
    if (!Number.isInteger(data.year) || data.year < 0 || data.year > new Date().getFullYear() + 10) {
      errors.push('Ano deve ser um número inteiro válido')
    }
  }
  
  if (data.pages !== undefined && data.pages !== null) {
    if (!Number.isInteger(data.pages) || data.pages < 1) {
      errors.push('Número de páginas deve ser um número inteiro positivo')
    }
  }
  
  if (data.currentPage !== undefined && data.currentPage !== null) {
    if (!Number.isInteger(data.currentPage) || data.currentPage < 0) {
      errors.push('Página atual deve ser um número inteiro não negativo')
    }
    
    if (data.pages && data.currentPage > data.pages) {
      errors.push('Página atual não pode ser maior que o total de páginas')
    }
  }
  
  if (data.status !== undefined && data.status !== null) {
    const validStatuses: ReadingStatus[] = ['QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO']
    if (!validStatuses.includes(data.status)) {
      errors.push('Status deve ser um dos valores válidos: ' + validStatuses.join(', '))
    }
  }
  
  if (data.rating !== undefined && data.rating !== null) {
    if (typeof data.rating !== 'number' || data.rating < 0 || data.rating > 5) {
      errors.push('Avaliação deve ser um número entre 0 e 5')
    }
  }
  
  if (data.isbn !== undefined && data.isbn !== null) {
    if (typeof data.isbn !== 'string') {
      errors.push('ISBN deve ser uma string')
    } else {
      const isbnPattern = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/
      if (!isbnPattern.test(data.isbn.replace(/\s/g, ''))) {
        errors.push('ISBN deve ter um formato válido')
      }
    }
  }
  
  if (data.cover !== undefined && data.cover !== null) {
    if (typeof data.cover !== 'string') {
      errors.push('URL da capa deve ser uma string')
    } else {
      try {
        new URL(data.cover)
      } catch {
        errors.push('URL da capa deve ser uma URL válida')
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Valida dados de gênero
 */
export function validateGenreData(data: any): ValidationResult {
  const errors: string[] = []
  
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('Nome do gênero é obrigatório e deve ser uma string não vazia')
  }
  
  if (data.name && data.name.length > 100) {
    errors.push('Nome do gênero deve ter no máximo 100 caracteres')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitiza dados de entrada removendo espaços extras e normalizando strings
 */
export function sanitizeBookData(data: any) {
  return {
    ...data,
    title: data.title?.trim?.(),
    author: data.author?.trim?.(),
    synopsis: data.synopsis?.trim?.() || null,
    notes: data.notes?.trim?.() || null,
    isbn: data.isbn?.trim?.() || null,
    cover: data.cover?.trim?.() || null,
    genreId: data.genreId?.trim?.() || null
  }
}

/**
 * Sanitiza dados de gênero
 */
export function sanitizeGenreData(data: any) {
  return {
    ...data,
    name: data.name?.trim?.()
  }
}

/**
 * Valida parâmetros de busca
 */
export function validateSearchParams(params: any): ValidationResult {
  const errors: string[] = []
  
  if (params.page !== undefined) {
    const page = parseInt(params.page)
    if (isNaN(page) || page < 1) {
      errors.push('Página deve ser um número inteiro positivo')
    }
  }
  
  if (params.limit !== undefined) {
    const limit = parseInt(params.limit)
    if (isNaN(limit) || limit < 1 || limit > 100) {
      errors.push('Limite deve ser um número inteiro entre 1 e 100')
    }
  }
  
  if (params.status !== undefined && params.status !== null && params.status !== '') {
    const validStatuses: ReadingStatus[] = ['QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO']
    if (!validStatuses.includes(params.status)) {
      errors.push('Status deve ser um dos valores válidos: ' + validStatuses.join(', '))
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}