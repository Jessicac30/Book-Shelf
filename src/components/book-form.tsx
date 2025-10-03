"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Genre, ReadingStatus } from "@/types/book";
import { Upload, X } from "lucide-react";
import { DefaultBookCover } from "./default-book-cover";

interface BookFormProps {
  book?: Book;
  onSubmit?: (book: Omit<Book, "id">) => void;
  onSubmitAction?: (fd: FormData) => Promise<void>;
  cancelHref?: string;
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

export function BookForm({
  book,
  onSubmit,
  onSubmitAction,
  cancelHref = "/biblioteca",
  isEditing = false,
}: BookFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<Omit<Book, "id">>({
    title: book?.title || "",
    author: book?.author || "",
    genre: book?.genre,
    year: book?.year,
    pages: book?.pages,
    currentPage: book?.currentPage ?? 0,
    status: book?.status ?? "QUERO_LER",
    isbn: book?.isbn || "",
    cover: book?.cover || "",
    rating: book?.rating ?? 0,
    synopsis: book?.synopsis || "",
    notes: book?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>(book?.cover || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.title.trim()) e.title = "Título é obrigatório";
    if (!formData.author.trim()) e.author = "Autor é obrigatório";
    if (
      formData.year &&
      (formData.year < 1000 || formData.year > new Date().getFullYear())
    )
      e.year = "Ano inválido";
    if (formData.pages && formData.pages <= 0) e.pages = "Páginas deve ser > 0";
    if (
      formData.currentPage &&
      formData.pages &&
      formData.currentPage > formData.pages
    )
      e.currentPage = "Página atual > total";
    if (formData.rating && (formData.rating < 0 || formData.rating > 5))
      e.rating = "Avaliação deve estar entre 0 e 5";
    if (formData.isbn && !/^[\d-x]+$/i.test(formData.isbn.replace(/\s/g, "")))
      e.isbn = "ISBN inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (onSubmitAction) return;
    e.preventDefault();
    if (validateForm() && onSubmit)
      onSubmit({ ...formData, cover: imagePreview });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImagePreview(result);
      setFormData((p) => ({ ...p, cover: result }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview("");
    setFormData((p) => ({ ...p, cover: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getProgressPercentage = (): number => {
    const required = [formData.title, formData.author].filter(Boolean).length;
    const optional = [
      formData.genre,
      formData.year,
      formData.pages,
      formData.isbn,
      imagePreview,
      formData.synopsis,
    ].filter(Boolean).length;
    const total = 8;
    return Math.round(((required + optional) / total) * 100);
  };

  const handleCancel = () => router.push(cancelHref);

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
          <p className="text-sm text-gray-600">
            Progresso do formulário: {getProgressPercentage()}%
          </p>
        </CardHeader>

        <CardContent>
          <form
            action={onSubmitAction}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <input
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, title: e.target.value }))
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
                      name="author"
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, author: e.target.value }))
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
                      name="genre"
                      value={formData.genre || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          genre: (e.target.value as Genre) || undefined,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione um gênero</option>
                      {genres.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ano
                    </label>
                    <input
                      name="year"
                      type="number"
                      value={formData.year ?? ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          year: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.year ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="2024"
                      min={1000}
                      max={new Date().getFullYear()}
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
                      name="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          status: e.target.value as ReadingStatus,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {statusLabels[s]}
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
                      name="pages"
                      type="number"
                      value={formData.pages ?? ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          pages: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.pages ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="300"
                      min={1}
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
                      name="currentPage"
                      type="number"
                      value={formData.currentPage ?? ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          currentPage: e.target.value
                            ? parseInt(e.target.value)
                            : 0,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.currentPage
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0"
                      min={0}
                      max={formData.pages ?? undefined}
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
                      name="rating"
                      type="number"
                      value={formData.rating ?? ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          rating: e.target.value
                            ? parseFloat(e.target.value)
                            : 0,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.rating ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="5"
                      min={0}
                      max={5}
                      step={0.1}
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
                    name="isbn"
                    type="text"
                    value={formData.isbn}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, isbn: e.target.value }))
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
                    name="synopsis"
                    value={formData.synopsis}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, synopsis: e.target.value }))
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
                    name="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, notes: e.target.value }))
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
                            setFormData((p) => ({ ...p, cover: "" }));
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
                          <p className="text-sm text-gray-600 mb-1">
                            Clique para adicionar uma capa
                          </p>
                          <p className="text-xs text-gray-500">
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

                    <div className="text-sm text-gray-600">
                      <p>Ou cole uma URL:</p>
                      <input
                        name="cover"
                        type="url"
                        value={formData.cover}
                        onChange={(e) => {
                          setFormData((p) => ({ ...p, cover: e.target.value }));
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
                onClick={handleCancel}
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
