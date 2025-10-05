// src/app/biblioteca/BibliotecaClient.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNotification } from "@/components/notification";
import type { BookWithGenre, LegacyGenre } from "@/types/book";
import { Edit, Trash2, Plus, Search, Filter, Eye, Library, Sparkles } from "lucide-react";
import { DefaultBookCover } from "@/components/default-book-cover";
import { ConfirmModal } from "@/components/confirm-modal";
import { Pagination } from "@/components/ui/pagination";
import { Recommendations } from "@/components/recommendations";
import { deleteBookFromClient } from "./actions";

type Props = { initialBooks: BookWithGenre[] };

const BOOKS_PER_PAGE = 12;

export default function BibliotecaClient({ initialBooks }: Props) {
  const [activeTab, setActiveTab] = useState("meus-livros");
  const [books, setBooks] = useState<BookWithGenre[]>(initialBooks);
  const [filteredBooks, setFilteredBooks] = useState<BookWithGenre[]>(initialBooks);
  const [bookToDelete, setBookToDelete] = useState<BookWithGenre | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<LegacyGenre | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showNotification } = useNotification();

  // Função para recarregar os livros
  const reloadBooks = async () => {
    try {
      const res = await fetch('/api/books', { cache: 'no-store' })
      if (!res.ok) throw new Error('erro')
      const data = await res.json()
      setBooks(data)
      setFilteredBooks(data)
    } catch {}
  };

  // Carregar livros do localStorage na inicialização
  useEffect(() => {
    reloadBooks()
  }, []);

  // Recarregar livros quando a página recebe foco (volta da edição)
  useEffect(() => {
    const handleFocus = () => {
      reloadBooks();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        reloadBooks();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  const genres: LegacyGenre[] = [
    "Literatura Brasileira",
    "Ficção Científica",
    "Realismo Mágico",
    "Ficção",
    "Fantasia",
    "Romance",
    "Biografia",
    "História",
    "Autoajuda",
    "Tecnologia",
    "Programação",
    "Negócios",
    "Psicologia",
    "Filosofia",
    "Poesia",
  ];

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlGenre = (searchParams.get("genre") as LegacyGenre | "all") || "all";

    setSearchQuery(urlSearch);
    setSelectedGenre(urlGenre);
    filterBooks(books, urlSearch, urlGenre);
  }, [searchParams, books]);

  const filterBooks = (
    bookList: BookWithGenre[],
    search: string,
    genre: LegacyGenre | "all"
  ) => {
    let filtered = bookList;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(s) ||
          book.author.toLowerCase().includes(s)
      );
    }
    if (genre !== "all") {
      filtered = filtered.filter((book) => book.genre?.name === genre);
    }
    setFilteredBooks(filtered);
    setCurrentPage(1); // Reset para primeira página ao filtrar
  };

  const updateUrlParams = (search: string, genre: LegacyGenre | "all") => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (genre !== "all") params.set("genre", genre);
    const newUrl = params.toString() ? `?${params.toString()}` : "/biblioteca";
    window.history.replaceState({}, "", newUrl);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    filterBooks(books, value, selectedGenre);
    updateUrlParams(value, selectedGenre);
  };

  const handleGenreChange = (value: LegacyGenre | "all") => {
    setSelectedGenre(value);
    filterBooks(books, searchQuery, value);
    updateUrlParams(searchQuery, value);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("all");
    setFilteredBooks(books);
    window.history.replaceState({}, "", "/biblioteca");
  };

  const handleEdit = (bookId: string) => {
    router.push(`/editar/${bookId}`);
  };

  const handleViewDetails = (bookId: string) => {
    router.push(`/biblioteca/${bookId}`);
  };

  const handleDelete = (book: BookWithGenre) => {
    setBookToDelete(book);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    try {
      await deleteBookFromClient(bookToDelete.id)
      await reloadBooks()
      filterBooks(books, searchQuery, selectedGenre)
      showNotification(
        "success",
        `Livro "${bookToDelete.title}" excluído com sucesso!`
      );
    } catch {
      showNotification("error", "Erro ao excluir o livro.");
    } finally {
      setBookToDelete(null);
    }
  };

  const cancelDelete = () => setBookToDelete(null);

  const handleAddNew = () => {
    router.push("/adicionar");
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
      QUERO_LER: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      LENDO: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      LIDO: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      PAUSADO: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      ABANDONADO: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return colors[status] || "bg-gray-100 text-black dark:bg-gray-800 dark:text-gray-200";
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Biblioteca</h2>
      </div>

      {/* Tabs */}
      <Tabs className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger
            active={activeTab === "meus-livros"}
            onClick={() => setActiveTab("meus-livros")}
          >
            <Library size={16} className="mr-2" />
            Meus Livros ({books.length})
          </TabsTrigger>
          <TabsTrigger
            active={activeTab === "recomendacoes"}
            onClick={() => setActiveTab("recomendacoes")}
          >
            <Sparkles size={16} className="mr-2" />
            Recomendações
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo: Meus Livros */}
        <TabsContent active={activeTab === "meus-livros"}>
          {/* Filtros e Busca */}
          <div className="flex flex-col sm:flex-row gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="relative w-full sm:w-80">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Buscar por título ou autor..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Select value={selectedGenre} onValueChange={handleGenreChange}>
            <SelectTrigger className="w-full sm:w-[200px] focus:ring-2 focus:ring-blue-500">
              <div className="flex items-center gap-2">
                <Filter size={16} />
                <SelectValue placeholder="Filtrar por gênero" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os gêneros</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(searchQuery || selectedGenre !== "all") && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap"
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Resultados */}
      <div className="flex justify-between items-center my-6">
        <p className="text-sm text-muted-foreground">
          {filteredBooks.length === books.length
            ? `${books.length} livros encontrados`
            : `${filteredBooks.length} de ${books.length} livros encontrados`}
        </p>
        {filteredBooks.length > BOOKS_PER_PAGE && (
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {Math.ceil(filteredBooks.length / BOOKS_PER_PAGE)}
          </p>
        )}
      </div>

      {filteredBooks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {searchQuery || selectedGenre !== "all"
                ? "Nenhum livro encontrado com os filtros aplicados."
                : "Nenhum livro encontrado. Comece adicionando um novo livro!"}
            </p>
            {(searchQuery || selectedGenre !== "all") && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Limpar filtros
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks
              .slice((currentPage - 1) * BOOKS_PER_PAGE, currentPage * BOOKS_PER_PAGE)
              .map((book) => (
            <Card
              key={book.id}
              className="h-full flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle
                      className="text-lg leading-tight group-hover:text-blue-600 transition-colors duration-300 cursor-pointer"
                      onClick={() => handleViewDetails(book.id)}
                    >
                      {book.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {book.author}
                    </CardDescription>
                  </div>
                  <div className="w-16 h-20 rounded overflow-hidden flex-shrink-0 group-hover:shadow-lg transition-shadow duration-300">
                    {book.cover && book.cover.trim() !== '' ? (
                      <>
                        <img
                          src={book.cover}
                          alt={`Capa de ${book.title}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                          onClick={() => handleViewDetails(book.id)}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallbackDiv) {
                              fallbackDiv.classList.remove("hidden");
                            }
                          }}
                        />
                        <div className="hidden">
                          <DefaultBookCover
                            title={book.title}
                            author={book.author}
                            genre={book.genre}
                            className="w-full h-full rounded text-xs group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                            onClick={() => handleViewDetails(book.id)}
                          />
                        </div>
                      </>
                    ) : (
                      <DefaultBookCover
                        title={book.title}
                        author={book.author}
                        genre={book.genre}
                        className="w-full h-full rounded text-xs group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                        onClick={() => handleViewDetails(book.id)}
                      />
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2 flex-1">
                  {book.genre?.name && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Gênero:</strong> {book.genre.name}
                    </p>
                  )}
                  {book.year && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Ano:</strong> {book.year}
                    </p>
                  )}
                  {book.pages && book.pages > 0 && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Páginas:</strong> {(book.currentPage ?? 0) > 0 ? `${book.currentPage}/` : ''}{book.pages}
                      {(book.currentPage ?? 0) > 0 && book.currentPage && (
                        <span className="ml-2 text-xs">
                          ({Math.round((book.currentPage / book.pages) * 100)}%)
                        </span>
                      )}
                    </p>
                  )}
                  {book.status && (
                    <div>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          book.status
                        )}`}
                      >
                        {getStatusLabel(book.status)}
                      </span>
                    </div>
                  )}
                  {book.rating != null && book.rating > 0 && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Avaliação:</strong> {book.rating}/5 ⭐
                    </p>
                  )}
                  {book.synopsis && (
                    <p className="text-sm text-muted-foreground dark:text-gray-300 line-clamp-3">
                      {book.synopsis}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(book.id)}
                    className="flex-1 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
                  >
                    <Eye size={14} className="mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(book.id)}
                    className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                  >
                    <Edit size={14} className="mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(book)}
                    className="flex-1 hover:bg-red-600 transition-all duration-200"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Paginação */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredBooks.length / BOOKS_PER_PAGE)}
          onPageChange={(page) => {
            setCurrentPage(page)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      </>
      )}
        </TabsContent>

        {/* Conteúdo: Recomendações */}
        <TabsContent active={activeTab === "recomendacoes"}>
          <Recommendations />
        </TabsContent>
      </Tabs>

      <ConfirmModal
        isOpen={!!bookToDelete}
        title="Excluir Livro"
        message={
          bookToDelete
            ? `Tem certeza que deseja excluir "${bookToDelete.title}" de ${bookToDelete.author}? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        type="danger"
      />

      {/* FAB */}
      <button
        onClick={handleAddNew}
        className="
          group fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full
          bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
          hover:from-blue-600 hover:via-purple-600 hover:to-pink-600
          shadow-lg hover:shadow-2xl transform hover:scale-110 active:scale-95
          transition-all duration-300 ease-in-out flex items-center justify-center
          text-white border-2 border-white/20 backdrop-blur-sm overflow-hidden
        "
        title="Adicionar novo livro"
      >
        <Plus
          size={24}
          className="drop-shadow-lg transition-transform group-hover:rotate-90 duration-300"
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-sm" />
      </button>
    </div>
  );
}
