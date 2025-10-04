'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BookForm } from '@/components/book-form'
import { useNotification } from '@/components/notification'
import { Book } from '@/types/book'
import { updateBookFromClient } from '../../biblioteca/actions'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import type { BookFormData } from '@/lib/validations/book'

export default function EditBookPage() {
  const router = useRouter()
  const params = useParams()
  const { showNotification } = useNotification()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!params.id) return
      try {
        const res = await fetch(`/api/books/${params.id}`)
        if (!res.ok) throw new Error('not found')
        const data = await res.json()
        setBook(data as Book)
      } catch {
        showNotification('error', 'Livro não encontrado')
        router.push('/biblioteca')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id, router, showNotification])

  const handleSubmit = async (bookData: BookFormData) => {
    if (!params.id) return
    try {
      await updateBookFromClient(params.id as string, bookData as any)
      showNotification('success', `Livro "${bookData.title}" atualizado com sucesso!`)
      router.push('/biblioteca')
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
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-2 w-full" />
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
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