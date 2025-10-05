"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Book, LegacyGenre } from "@/types/book";
import { Upload, X, Search } from "lucide-react";
import { DefaultBookCover } from "./default-book-cover";
import { bookSchema, type BookFormData } from "@/lib/validations/book";

interface BookFormProps {
  book?: Book;
  onSubmit: (book: BookFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const statusLabels = {
  QUERO_LER: "Quero Ler",
  LENDO: "Lendo",
  LIDO: "Lido",
  PAUSADO: "Pausado",
  ABANDONADO: "Abandonado",
} as const;

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

export function BookForm({
  book,
  onSubmit,
  onCancel,
  isEditing = false,
}: BookFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title || "",
      author: book?.author || "",
      genreId: book?.genreId || undefined,
      year: book?.year || undefined,
      pages: book?.pages || undefined,
      currentPage: book?.currentPage || 0,
      status: book?.status || "QUERO_LER",
      isbn: book?.isbn || "",
      cover: book?.cover || "",
      rating: book?.rating || 0,
      synopsis: book?.synopsis || "",
      notes: book?.notes || "",
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>(book?.cover || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const watchedValues = watch();
  const title = watch("title");
  const author = watch("author");
  const genre = watch("genre");
  const year = watch("year");
  const pages = watch("pages");
  const isbn = watch("isbn");
  const synopsis = watch("synopsis");

  const getProgressPercentage = (): number => {
    const requiredFields = [title, author].filter(Boolean).length;
    const optionalFields = [genre, year, pages, isbn, imagePreview, synopsis].filter(Boolean).length;
    const total = 8;
    const filled = requiredFields + optionalFields;
    return Math.round((filled / total) * 100);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setValue("cover", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setValue("cover", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  let searchTimer: any = null;
  const searchBooks = (q: string) => {
    const query = q.trim();
    setSearchQuery(q);
    if (searchTimer) clearTimeout(searchTimer);
    if (query.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setSearching(true);
    searchTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/external/books?query=${encodeURIComponent(query)}&limit=8`);
        const data = await res.json();
        setResults(Array.isArray(data.items) ? data.items : []);
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const applyFromResult = (item: any) => {
    setValue("title", item.title || "");
    setValue("author", item.author || "");
    setValue("pages", item.pages || undefined);
    setValue("year", item.publishedYear || undefined);
    setValue("isbn", item.isbn || "");
    setValue("synopsis", item.synopsis || "");
    setValue("cover", item.cover || "");
    if (item.cover) setImagePreview(item.cover);
    setShowResults(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Editar Livro" : "Adicionar Novo Livro"}
          </CardTitle>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Progresso do formulário: {getProgressPercentage()}%
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Busca externa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Buscar livro (título, autor ou ISBN)
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => searchBooks(e.target.value)}
                      placeholder="Ex.: Clean Code, Tolkien, 978..."
                      className="w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                  {showResults && (
                    <div className="mt-2 max-h-72 overflow-auto border rounded-md divide-y bg-white dark:bg-gray-800 shadow-sm">
                      {searching && (
                        <div className="p-3 text-sm text-muted-foreground">Buscando...</div>
                      )}
                      {!searching && results.length === 0 && (
                        <div className="p-3 text-sm text-muted-foreground">Nenhum resultado</div>
                      )}
                      {results.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => applyFromResult(r)}
                          className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-3 transition-colors"
                        >
                          {r.cover ? (
                            <img src={r.cover} alt="capa" className="w-12 h-16 object-cover rounded shadow-sm flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-16 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                              {r.title || 'Sem título'}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 truncate">
                              {r.author || 'Autor desconhecido'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500 truncate">
                              {r.isbn || ''} {r.publishedYear ? `• ${r.publishedYear}` : ''}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Título e Autor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Título *
                    </label>
                    <input
                      {...register("title")}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Digite o título do livro"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Autor *
                    </label>
                    <input
                      {...register("author")}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 ${
                        errors.author ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Digite o nome do autor"
                    />
                    {errors.author && (
                      <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>
                    )}
                  </div>
                </div>

                {/* Gênero, Ano, Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Gênero
                    </label>
                    <Select
                      value={watchedValues.genre || ""}
                      onValueChange={(value) => setValue("genre", value as Genre)}
                    >
                      <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-600">
                        <SelectValue placeholder="Selecione um gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.genre && (
                      <p className="text-red-500 text-sm mt-1">{errors.genre.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ano
                    </label>
                    <input
                      {...register("year", { valueAsNumber: true })}
                      type="number"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 ${
                        errors.year ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="2024"
                      min="1000"
                    />
                    {errors.year && (
                      <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      {...register("status")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Páginas, Página Atual, Rating */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Total de Páginas
                    </label>
                    <input
                      {...register("pages", { valueAsNumber: true })}
                      type="number"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 ${
                        errors.pages ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="300"
                      min="1"
                    />
                    {errors.pages && (
                      <p className="text-red-500 text-sm mt-1">{errors.pages.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Página Atual
                    </label>
                    <input
                      {...register("currentPage", { valueAsNumber: true })}
                      type="number"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 ${
                        errors.currentPage ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0"
                      min="0"
                    />
                    {errors.currentPage && (
                      <p className="text-red-500 text-sm mt-1">{errors.currentPage.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Avaliação (0-5)
                    </label>
                    <input
                      {...register("rating", { valueAsNumber: true })}
                      type="number"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 ${
                        errors.rating ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="5"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                    {errors.rating && (
                      <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
                    )}
                  </div>
                </div>

                {/* ISBN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ISBN
                  </label>
                  <input
                    {...register("isbn")}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 ${
                      errors.isbn ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="978-3-16-148410-0"
                  />
                  {errors.isbn && (
                    <p className="text-red-500 text-sm mt-1">{errors.isbn.message}</p>
                  )}
                </div>

                {/* Sinopse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sinopse
                  </label>
                  <textarea
                    {...register("synopsis")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    rows={4}
                    placeholder="Digite uma breve sinopse do livro..."
                  />
                  {errors.synopsis && (
                    <p className="text-red-500 text-sm mt-1">{errors.synopsis.message}</p>
                  )}
                </div>

                {/* Notas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notas Pessoais
                  </label>
                  <textarea
                    {...register("notes")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    rows={3}
                    placeholder="Suas anotações sobre o livro..."
                  />
                  {errors.notes && (
                    <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
                  )}
                </div>
              </div>

              {/* Coluna da Capa */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Capa do Livro
                  </label>

                  <div className="relative">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview da capa"
                          className="w-full max-w-sm mx-auto rounded-lg shadow-md"
                          onError={() => {
                            setImagePreview("");
                            setValue("cover", "");
                          }}
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="w-48 h-64 mx-auto">
                        <DefaultBookCover
                          title={title || "Título do Livro"}
                          author={author || "Autor"}
                          genre={genre}
                          className="w-full h-full rounded-lg shadow-md"
                        />
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div className="mt-4 space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload size={16} className="mr-2" />
                      Enviar Imagem
                    </Button>

                    <div className="text-sm text-muted-foreground">
                      <p>Ou cole uma URL:</p>
                      <input
                        {...register("cover")}
                        type="url"
                        onChange={(e) => setImagePreview(e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-600"
                        placeholder="https://exemplo.com/capa.jpg"
                      />
                      {errors.cover && (
                        <p className="text-red-500 text-xs mt-1">{errors.cover.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : isEditing ? "Salvar Alterações" : "Adicionar Livro"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
