export type ReadingStatus = 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO'

export type Genre =
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

export interface Book {
  id: string
  title: string
  author: string
  genre?: Genre
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