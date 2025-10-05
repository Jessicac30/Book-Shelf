import { Book } from 'lucide-react'
import { Genre } from '@/types/book'

interface DefaultBookCoverProps {
  title: string
  author: string
  genre?: Genre | string | null
  className?: string
  onClick?: () => void
}

const genreColors: Record<string, string> = {
  'Literatura Brasileira': 'from-green-500 to-yellow-500',
  'Ficção Científica': 'from-blue-500 to-cyan-500',
  'Realismo Mágico': 'from-purple-500 to-pink-500',
  'Ficção': 'from-blue-500 to-purple-600',
  'Fantasia': 'from-purple-600 to-pink-600',
  'Romance': 'from-pink-500 to-rose-500',
  'Biografia': 'from-gray-500 to-gray-700',
  'História': 'from-amber-600 to-orange-600',
  'Autoajuda': 'from-emerald-500 to-green-500',
  'Tecnologia': 'from-cyan-500 to-blue-600',
  'Programação': 'from-slate-600 to-slate-800',
  'Negócios': 'from-green-600 to-emerald-600',
  'Psicologia': 'from-indigo-500 to-purple-500',
  'Filosofia': 'from-gray-600 to-slate-600',
  'Poesia': 'from-violet-500 to-purple-600',
  default: 'from-blue-500 to-purple-600'
}

export function DefaultBookCover({ title, author, genre, className = "", onClick }: DefaultBookCoverProps) {
  const genreName = typeof genre === 'string' ? genre : genre?.name
  const colorClass = genreColors[genreName || 'default'] || genreColors.default

  return (
    <div
      className={`bg-gradient-to-br ${colorClass} text-white flex flex-col items-center justify-center p-3 text-center ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <Book size={24} className="mb-2 opacity-80" />
      <div className="text-xs font-semibold leading-tight mb-1 line-clamp-3">
        {title}
      </div>
      <div className="text-xs opacity-75 line-clamp-2">
        {author}
      </div>
      {genreName && (
        <div className="text-xs opacity-60 mt-1 uppercase tracking-wide">
          {genreName}
        </div>
      )}
    </div>
  )
}