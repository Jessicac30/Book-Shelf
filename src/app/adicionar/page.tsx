'use client'

import { useRouter } from 'next/navigation'
import { BookForm } from '@/components/book-form'
import { bookService } from '@/lib/book-service'
import { useNotification } from '@/components/notification'
import { Book } from '@/types/book'

export default function AdicionarPage() {
  const router = useRouter()
  const { showNotification } = useNotification()

  const handleSubmit = (bookData: Omit<Book, 'id'>) => {
    try {
      const newBook = bookService.addBook(bookData)
      showNotification('success', `Livro "${newBook.title}" adicionado com sucesso!`)
      router.push('/biblioteca')
    } catch (error) {
      showNotification('error', 'Erro ao adicionar o livro. Tente novamente.')
    }
  }

  const handleCancel = () => {
    router.push('/biblioteca')
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BookForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}