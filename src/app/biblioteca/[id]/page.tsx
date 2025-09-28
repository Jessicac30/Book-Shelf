"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBooks } from "@/contexts/BookContext";
import { useNotification } from "@/components/notification";
import { Book } from "@/types/book";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  BookOpen,
  Calendar,
  User,
} from "lucide-react";
import { DefaultBookCover } from "@/components/default-book-cover";
import { ConfirmModal } from "@/components/confirm-modal";

export default function BookDetailPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { showNotification } = useNotification();
  const { getBookById, deleteBook } = useBooks();

  useEffect(() => {
    if (params.id) {
      const foundBook = getBookById(params.id as string);
      setBook(foundBook || null);
      setLoading(false);
    }
  }, [params.id, getBookById]);

  const handleBack = () => {
    router.push("/biblioteca");
  };

  const handleEdit = () => {
    if (book) {
      router.push(`/editar/${book.id}`);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (book) {
      const success = deleteBook(book.id);
      if (success) {
        showNotification(
          "success",
          `Livro "${book.title}" excluído com sucesso!`
        );
        router.push("/biblioteca");
      } else {
        showNotification("error", "Erro ao excluir o livro.");
      }
      setShowDeleteModal(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      QUERO_LER: "Quero Ler",
      LENDO: "Lendo",
      LIDO: "Lido",
      PAUSADO: "Pausado",
      ABANDONADO: "Abandonado",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      QUERO_LER: "bg-blue-100 text-blue-800 border-blue-200",
      LENDO: "bg-yellow-100 text-yellow-800 border-yellow-200",
      LIDO: "bg-green-100 text-green-800 border-green-200",
      PAUSADO: "bg-orange-100 text-orange-800 border-orange-200",
      ABANDONADO: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-black border";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={20}
        className={
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-8 pt-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex-1 p-4 md:p-8 pt-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-black mb-4">
            Livro não encontrado
          </h2>
          <p className="text-muted-foreground mb-6">
            O livro que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            Voltar à Biblioteca
          </Button>
        </div>
      </div>
    );
  }

  const progressPercentage =
    book.pages && book.currentPage
      ? Math.round((book.currentPage / book.pages) * 100)
      : 0;

  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
      {/* Header com botão de voltar */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mr-4 hover:bg-gray-100"
        >
          <ArrowLeft size={18} className="mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-black">Detalhes do Livro</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da Capa */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="aspect-[3/4] w-full max-w-sm mx-auto mb-6 rounded-lg overflow-hidden shadow-lg">
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={`Capa de ${book.title}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove(
                        "hidden"
                      );
                    }}
                  />
                ) : null}
                <div className={book.cover ? "hidden" : ""}>
                  <DefaultBookCover
                    title={book.title}
                    author={book.author}
                    genre={book.genre}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Ações */}
              <div className="space-y-3">
                <Button
                  onClick={handleEdit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit size={16} className="mr-2" />
                  Editar Livro
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 size={16} className="mr-2" />
                  Excluir Livro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna de Informações */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl font-bold mb-2 text-black">
                    {book.title}
                  </CardTitle>
                  <CardDescription className="text-xl text-muted-foreground flex items-center">
                    <User size={18} className="mr-2" />
                    {book.author}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {book.genre && (
                  <div className="flex items-center space-x-2">
                    <BookOpen size={18} className="text-muted-foreground" />
                    <span className="font-medium">Gênero:</span>
                    <span className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                      {book.genre}
                    </span>
                  </div>
                )}

                {book.year && (
                  <div className="flex items-center space-x-2">
                    <Calendar size={18} className="text-muted-foreground" />
                    <span className="font-medium">Ano:</span>
                    <span>{book.year}</span>
                  </div>
                )}

                {book.isbn && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">ISBN:</span>
                    <span className="font-mono text-sm">{book.isbn}</span>
                  </div>
                )}

                {book.status && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        book.status
                      )}`}
                    >
                      {getStatusLabel(book.status)}
                    </span>
                  </div>
                )}
              </div>

              {book.rating && book.rating > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Avaliação:</span>
                  <div className="flex items-center space-x-1">
                    {renderStars(book.rating)}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {book.rating}/5
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progresso de Leitura */}
          {book.pages && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Progresso de Leitura</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Páginas lidas: {book.currentPage || 0}</span>
                    <span>Total: {book.pages}</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  <div className="text-center">
                    <span className="text-2xl font-bold text-black">
                      {progressPercentage}%
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      completo
                    </span>
                  </div>

                  {progressPercentage < 100 &&
                    book.currentPage &&
                    book.pages && (
                      <div className="text-center text-sm text-muted-foreground">
                        {book.pages - book.currentPage} páginas restantes
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sinopse */}
          {book.synopsis && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Sinopse</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {book.synopsis}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Notas */}
          {book.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Notas Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap italic">
                  {book.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Excluir Livro"
        message={`Tem certeza que deseja excluir "${book.title}" de ${book.author}? Esta ação não pode ser desfeita.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        type="danger"
      />
    </div>
  );
}
