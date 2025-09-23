'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { bookService } from '@/lib/book-service'
import { useNotification } from '@/components/notification'
import { Book } from '@/types/book'
import { Edit, Trash2, Plus } from 'lucide-react'
import { DefaultBookCover } from '@/components/default-book-cover'

export default function BibliotecaPage() {
  const [books, setBooks] = useState<Book[]>([])
  const router = useRouter()
  const { showNotification } = useNotification()

  useEffect(() => {
    setBooks(bookService.getAllBooks())
  }, [])

  const handleEdit = (bookId: string) => {
    router.push(`/editar/${bookId}`)
  }

  const handleDelete = (book: Book) => {
    if (window.confirm(`Tem certeza que deseja excluir o livro "${book.title}"?`)) {
      const success = bookService.deleteBook(book.id)
      if (success) {
        setBooks(bookService.getAllBooks())
        showNotification('success', `Livro "${book.title}" excluído com sucesso!`)
      } else {
        showNotification('error', 'Erro ao excluir o livro.')
      }
    }
  }

  const handleAddNew = () => {
    router.push('/adicionar')
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      QUERO_LER: 'Quero Ler',
      LENDO: 'Lendo',
      LIDO: 'Lido',
      PAUSADO: 'Pausado',
      ABANDONADO: 'Abandonado'
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      QUERO_LER: 'bg-blue-100 text-blue-800',
      LENDO: 'bg-yellow-100 text-yellow-800',
      LIDO: 'bg-green-100 text-green-800',
      PAUSADO: 'bg-orange-100 text-orange-800',
      ABANDONADO: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Biblioteca</h2>
        <Button onClick={handleAddNew}>
          <Plus size={16} className="mr-2" />
          Adicionar Livro
        </Button>
      </div>

      {books.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Nenhum livro encontrado. Comece adicionando um novo livro!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{book.title}</CardTitle>
                    <CardDescription className="mt-1">{book.author}</CardDescription>
                  </div>
                  <div className="w-16 h-20 rounded overflow-hidden flex-shrink-0">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={`Capa de ${book.title}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                    ) : null}
                    <div className={book.cover ? 'hidden' : ''}>
                      <DefaultBookCover
                        title={book.title}
                        author={book.author}
                        genre={book.genre}
                        className="w-full h-full rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2 flex-1">
                  {book.genre && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Gênero:</strong> {book.genre}
                    </p>
                  )}

                  {book.year && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Ano:</strong> {book.year}
                    </p>
                  )}

                  {book.pages && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Páginas:</strong> {book.currentPage || 0}/{book.pages}
                    </p>
                  )}

                  {book.status && (
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                      {getStatusLabel(book.status)}
                    </span>
                  )}

                  {book.rating && book.rating > 0 && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Avaliação:</strong> {book.rating}/5 ⭐
                    </p>
                  )}

                  {book.synopsis && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {book.synopsis}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(book.id)}
                    className="flex-1"
                  >
                    <Edit size={14} className="mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(book)}
                    className="flex-1"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}