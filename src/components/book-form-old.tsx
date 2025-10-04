"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Genre, ReadingStatus } from "@/types/book";
import { Upload, X, Search } from "lucide-react";
import { DefaultBookCover } from "./default-book-cover";

interface BookFormProps {
  book?: Book;
  onSubmit: (book: Omit<Book, "id">) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const genres: Genre[] = [
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

const statuses: ReadingStatus[] = [
  "QUERO_LER",
  "LENDO",
  "LIDO",
  "PAUSADO",
  "ABANDONADO",
];

const statusLabels: Record<ReadingStatus, string> = {
  QUERO_LER: "Quero Ler",
  LENDO: "Lendo",
  LIDO: "Lido",
  PAUSADO: "Pausado",
  ABANDONADO: "Abandonado",
};

const CURRENT_YEAR = 2024; // Usar ano fixo para evitar problemas de hidratação

export function BookForm({
  book,
  onSubmit,
  onCancel,
  isEditing = false,
}: BookFormProps) {
  const [formData, setFormData] = useState<Omit<Book, "id">>({
    title: book?.title || "",
    author: book?.author || "",
    genre: book?.genre,
    year: book?.year,
    pages: book?.pages,
    currentPage: book?.currentPage || 0,
    status: book?.status || "QUERO_LER",
    isbn: book?.isbn || "",
    cover: book?.cover || "",
    rating: book?.rating || 0,
    synopsis: book?.synopsis || "",
    notes: book?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>(book?.cover || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Autor é obrigatório";
    }

    if (
      formData.year &&
      (formData.year < 1000 || formData.year > CURRENT_YEAR)
    ) {
      newErrors.year = "Ano deve estar entre 1000 e o ano atual";
    }

    if (formData.pages && formData.pages <= 0) {
      newErrors.pages = "Número de páginas deve ser maior que 0";
    }

    if (
      formData.currentPage &&
      formData.pages &&
      formData.currentPage > formData.pages
    ) {
      newErrors.currentPage =
        "Página atual não pode ser maior que o total de páginas";
    }

    if (formData.rating && (formData.rating < 0 || formData.rating > 5)) {
      newErrors.rating = "Avaliação deve estar entre 0 e 5";
    }

    if (formData.isbn && !/^[\d-x]+$/i.test(formData.isbn.replace(/\s/g, ""))) {
      newErrors.isbn = "ISBN deve conter apenas números, hífens e X";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, cover: imagePreview });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, cover: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, cover: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getProgressPercentage = (): number => {
    const requiredFields = [formData.title, formData.author].filter(
      Boolean
    ).length;
    const optionalFields = [
      formData.genre,
      formData.year,
      formData.pages,
      formData.isbn,
      imagePreview,
      formData.synopsis,
    ].filter(Boolean).length;

    const total = 8;
    const filled = requiredFields + optionalFields;
    return Math.round((filled / total) * 100);
  };

  let searchTimer: any = null as any;
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
    setFormData(prev => ({
      ...prev,
      title: item.title || prev.title,
      author: item.author || prev.author,
      pages: item.pages ?? prev.pages,
      year: item.publishedYear ?? prev.year,
      isbn: item.isbn ?? prev.isbn,
      synopsis: item.synopsis ?? prev.synopsis,
      cover: item.cover ?? prev.cover,
    }));
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buscar livro (título, autor ou ISBN)</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => searchBooks(e.target.value)}
                      placeholder="Ex.: Clean Code, Tolkien, 978..."
                      className="w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Digite o título do livro"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Autor *
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.author ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Digite o nome do autor"
                    />
                    {errors.author && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.author}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gênero
                    </label>
                    <select
                      value={formData.genre || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          genre: (e.target.value as Genre) || undefined,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione um gênero</option>
                      {genres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ano
                    </label>
                    <input
                      type="number"
                      value={formData.year || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          year: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.year ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="2024"
                      min="1000"
                      max={CURRENT_YEAR}
                    />
                    {errors.year && (
                      <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as ReadingStatus,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total de Páginas
                    </label>
                    <input
                      type="number"
                      value={formData.pages || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pages: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.pages ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="300"
                      min="1"
                    />
                    {errors.pages && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pages}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Página Atual
                    </label>
                    <input
                      type="number"
                      value={formData.currentPage || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          currentPage: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.currentPage
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0"
                      min="0"
                      max={formData.pages || undefined}
                    />
                    {errors.currentPage && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.currentPage}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avaliação (0-5)
                    </label>
                    <input
                      type="number"
                      value={formData.rating || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          rating: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.rating ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="5"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                    {errors.rating && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.rating}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isbn: e.target.value }))
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.isbn ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="978-3-16-148410-0"
                  />
                  {errors.isbn && (
                    <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sinopse
                  </label>
                  <textarea
                    value={formData.synopsis}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        synopsis: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Digite uma breve sinopse do livro..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas Pessoais
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Suas anotações sobre o livro..."
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            setFormData((prev) => ({ ...prev, cover: "" }));
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
                      <div className="space-y-4">
                        <div className="w-48 h-64 mx-auto">
                          <DefaultBookCover
                            title={formData.title || "Título do Livro"}
                            author={formData.author || "Autor"}
                            genre={formData.genre}
                            className="w-full h-full rounded-lg shadow-md"
                          />
                        </div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload
                            className="mx-auto mb-2 text-gray-400"
                            size={32}
                          />
                          <p className="text-sm text-muted-foreground mb-1">
                            Clique para adicionar uma capa
                          </p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG ou URL da imagem
                          </p>
                        </div>
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
                        type="url"
                        value={formData.cover}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            cover: e.target.value,
                          }));
                          setImagePreview(e.target.value);
                        }}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="https://exemplo.com/capa.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Button type="submit" className="flex-1">
                {isEditing ? "Salvar Alterações" : "Adicionar Livro"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
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
