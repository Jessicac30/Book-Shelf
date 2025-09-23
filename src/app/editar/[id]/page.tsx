'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BookForm } from '@/components/book-form'
import { bookService } from '@/lib/book-service'
import { useNotification } from '@/components/notification'
import { Book } from '@/types/book'

interface EditBookPageProps {
  params: {
    id: string
  }
}

export default function EditBookPage({ params }: EditBookPageProps) {
  const router = useRouter()
  const { showNotification } = useNotification()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundBook = bookService.getBookById(params.id)
    if (foundBook) {
      setBook(foundBook)
    } else {
      showNotification('error', 'Livro não encontrado')
      router.push('/biblioteca')
    }
    setLoading(false)
  }, [params.id, router, showNotification])

  const handleSubmit = (bookData: Omit<Book, 'id'>) => {
    try {
      const updatedBook = bookService.updateBook(params.id, bookData)
      if (updatedBook) {
        showNotification('success', `Livro "${updatedBook.title}" atualizado com sucesso!`)
        router.push('/biblioteca')
      } else {
        showNotification('error', 'Erro ao atualizar o livro. Livro não encontrado.')
      }
    } catch (error) {
      showNotification('error', 'Erro ao atualizar o livro. Tente novamente.')
    }
  }

  const handleCancel = () => {
    router.push('/biblioteca')
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-lg">Carregando...</div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-lg text-red-600">Livro não encontrado</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BookForm
        book={book}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={true}
      />
    </div>
  )
}