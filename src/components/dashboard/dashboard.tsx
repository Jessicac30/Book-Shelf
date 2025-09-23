'use client'

import { useMemo } from 'react'
import { Book, BookOpen, CheckCircle2, FileText } from 'lucide-react'
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
          <Button asChild>
            <Link href="/adicionar">Adicionar Livro</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Livros"
          value={stats.totalBooks}
          description="Livros cadastrados"
          icon={Book}
        />
        <StatsCard
          title="Lendo Atualmente"
          value={stats.booksReading}
          description="Em progresso"
          icon={BookOpen}
        />
        <StatsCard
          title="Livros Finalizados"
          value={stats.booksFinished}
          description="Leituras completas"
          icon={CheckCircle2}
        />
        <StatsCard
          title="Páginas Lidas"
          value={stats.totalPagesRead}
          description="Total de páginas"
          icon={FileText}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Leituras Recentes</CardTitle>
            <CardDescription>
              Seus últimos livros lidos e em progresso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBooks.map((book) => (
              <div key={book.id} className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none">{book.title}</p>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {book.status === 'LENDO' && book.currentPage && book.pages && (
                    <span>{Math.round((book.currentPage / book.pages) * 100)}%</span>
                  )}
                  {book.status === 'LIDO' && (
                    <span className="text-green-600">Concluído</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Navegação Rápida</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/biblioteca">
                <Book className="mr-2 h-4 w-4" />
                Ver Biblioteca
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/adicionar">
                <BookOpen className="mr-2 h-4 w-4" />
                Adicionar Novo Livro
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}