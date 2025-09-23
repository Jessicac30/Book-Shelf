'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Book, BookOpen, CheckCircle2, FileText, Plus } from 'lucide-react'
import { StatsCard } from './stats-card'
import { mockBooks } from '@/data/mock-books'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Dashboard() {
  const stats = useMemo(() => {
    const totalBooks = mockBooks.length
    const booksReading = mockBooks.filter(book => book.status === 'LENDO').length
    const booksFinished = mockBooks.filter(book => book.status === 'LIDO').length
    const totalPagesRead = mockBooks
      .filter(book => book.status === 'LIDO')
      .reduce((acc, book) => acc + (book.pages || 0), 0)

    return {
      totalBooks,
      booksReading,
      booksFinished,
      totalPagesRead
    }
  }, [])

  const recentBooks = useMemo(() => {
    return mockBooks
      .filter(book => book.status === 'LENDO' || book.status === 'LIDO')
      .slice(0, 3)
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Link href="/adicionar">
            <button
              className="
                group relative inline-flex items-center px-6 py-3 text-white font-semibold rounded-lg
                bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                hover:from-blue-600 hover:via-purple-600 hover:to-pink-600
                transform hover:scale-105 hover:shadow-xl
                transition-all duration-300 ease-in-out
                before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r
                before:from-blue-400 before:via-purple-400 before:to-pink-400
                before:opacity-0 before:transition-opacity before:duration-300
                hover:before:opacity-20
                focus:outline-none focus:ring-4 focus:ring-purple-500/50
                active:scale-95
                overflow-hidden
              "
            >
              <Plus size={18} className="mr-2 drop-shadow-sm" />
              <span className="drop-shadow-sm">Adicionar Livro</span>

              {/* Shine effect */}
              <div className="
                absolute inset-0 rounded-lg opacity-0
                bg-gradient-to-r from-transparent via-white/20 to-transparent
                transform -skew-x-12 -translate-x-full
                group-hover:translate-x-full group-hover:opacity-100
                transition-all duration-700 ease-in-out
              " />
            </button>
          </Link>
        </div>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, staggerChildren: 0.1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <StatsCard
            title="Total de Livros"
            value={stats.totalBooks}
            description="Livros cadastrados"
            icon={Book}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StatsCard
            title="Lendo Atualmente"
            value={stats.booksReading}
            description="Em progresso"
            icon={BookOpen}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <StatsCard
            title="Livros Finalizados"
            value={stats.booksFinished}
            description="Leituras completas"
            icon={CheckCircle2}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <StatsCard
            title="Páginas Lidas"
            value={stats.totalPagesRead}
            description="Total de páginas"
            icon={FileText}
          />
        </motion.div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-gradient-to-br from-white to-blue-50/30 border-blue-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300">
          <CardHeader>
            <CardTitle>Leituras Recentes</CardTitle>
            <CardDescription>
              Seus últimos livros lidos e em progresso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBooks.map((book) => (
              <div key={book.id} className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-blue-50/50 transition-all duration-200 cursor-pointer">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none group-hover:text-blue-700 transition-colors">{book.title}</p>
                  <p className="text-sm text-muted-foreground group-hover:text-blue-600 transition-colors">{book.author}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {book.status === 'LENDO' && book.currentPage && book.pages && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {Math.round((book.currentPage / book.pages) * 100)}%
                    </span>
                  )}
                  {book.status === 'LIDO' && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Concluído
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-gradient-to-br from-white to-blue-50/30 border-blue-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300">
          <CardHeader>
            <CardTitle>Navegação Rápida</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <Link href="/biblioteca" className="w-full block mb-6">
              <button className="
                group relative w-full px-4 py-3 text-left rounded-lg
                bg-gradient-to-r from-emerald-50 to-green-50
                hover:from-emerald-100 hover:to-green-100
                border border-emerald-200 hover:border-green-300
                text-gray-700 hover:text-gray-900
                transform hover:scale-[1.02] hover:shadow-md
                transition-all duration-300 ease-in-out
                flex items-center justify-start
                overflow-hidden
              ">
                <div className="
                  relative p-2 rounded-lg mr-3
                  bg-gradient-to-r from-emerald-500 to-green-500
                  text-white shadow-sm
                  group-hover:shadow-md
                  transition-shadow duration-300
                ">
                  <Book className="h-4 w-4" />
                </div>
                <span className="font-medium">Ver Biblioteca</span>

                {/* Subtle shine effect */}
                <div className="
                  absolute inset-0 rounded-lg opacity-0
                  bg-gradient-to-r from-transparent via-white/30 to-transparent
                  transform -skew-x-12 -translate-x-full
                  group-hover:translate-x-full group-hover:opacity-100
                  transition-all duration-1000 ease-in-out
                " />
              </button>
            </Link>
            <Link href="/adicionar" className="w-full">
              <button className="
                group relative w-full px-4 py-3 text-left rounded-lg
                bg-gradient-to-r from-blue-50 to-purple-50
                hover:from-blue-100 hover:to-purple-100
                border border-blue-200 hover:border-purple-300
                text-gray-700 hover:text-gray-900
                transform hover:scale-[1.02] hover:shadow-md
                transition-all duration-300 ease-in-out
                flex items-center justify-start
                overflow-hidden
              ">
                <div className="
                  relative p-2 rounded-lg mr-3
                  bg-gradient-to-r from-blue-500 to-purple-500
                  text-white shadow-sm
                  group-hover:shadow-md
                  transition-shadow duration-300
                ">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="font-medium">Adicionar Novo Livro</span>

                {/* Subtle shine effect */}
                <div className="
                  absolute inset-0 rounded-lg opacity-0
                  bg-gradient-to-r from-transparent via-white/30 to-transparent
                  transform -skew-x-12 -translate-x-full
                  group-hover:translate-x-full group-hover:opacity-100
                  transition-all duration-1000 ease-in-out
                " />
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}