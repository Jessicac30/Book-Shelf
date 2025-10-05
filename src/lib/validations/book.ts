import { z } from "zod"

const CURRENT_YEAR = new Date().getFullYear()

export const bookSchema = z.object({
  title: z.string()
    .min(1, "Título é obrigatório")
    .max(200, "Título deve ter no máximo 200 caracteres"),

  author: z.string()
    .min(1, "Autor é obrigatório")
    .max(200, "Autor deve ter no máximo 200 caracteres"),

  genreId: z.string()
    .optional(),

  year: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number()
      .int("Ano deve ser um número inteiro")
      .min(1000, "Ano deve ser maior que 1000")
      .max(CURRENT_YEAR, `Ano não pode ser maior que ${CURRENT_YEAR}`)
      .optional()
  ),

  pages: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number()
      .int("Número de páginas deve ser inteiro")
      .positive("Número de páginas deve ser positivo")
      .max(99999, "Número de páginas inválido")
      .optional()
  ),

  currentPage: z.number()
    .int("Página atual deve ser um número inteiro")
    .min(0, "Página atual não pode ser negativa")
    .optional()
    .nullable()
    .or(z.literal(0))
    .transform(val => val === 0 ? 0 : val),

  status: z.enum(["QUERO_LER", "LENDO", "LIDO", "PAUSADO", "ABANDONADO"])
    .default("QUERO_LER"),

  isbn: z.string()
    .max(20, "ISBN deve ter no máximo 20 caracteres")
    .regex(/^[\d\-xX\s]*$/, "ISBN deve conter apenas números, hífens, X e espaços")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? undefined : val),

  cover: z.string()
    .url("URL da capa inválida")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? undefined : val),

  rating: z.number()
    .min(0, "Avaliação deve ser entre 0 e 5")
    .max(5, "Avaliação deve ser entre 0 e 5")
    .optional()
    .nullable()
    .or(z.literal(0))
    .transform(val => val === 0 ? 0 : val),

  synopsis: z.string()
    .max(2000, "Sinopse deve ter no máximo 2000 caracteres")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? undefined : val),

  notes: z.string()
    .max(2000, "Anotações devem ter no máximo 2000 caracteres")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val === "" ? undefined : val),
}).refine(
  (data) => {
    // Validação: currentPage não pode ser maior que pages
    if (data.pages && data.currentPage && data.currentPage > data.pages) {
      return false
    }
    return true
  },
  {
    message: "Página atual não pode ser maior que o total de páginas",
    path: ["currentPage"],
  }
)

export type BookFormData = z.infer<typeof bookSchema>

// Schema para criação (sem ID)
export const createBookSchema = bookSchema

// Schema para atualização (campos opcionais)
export const updateBookSchema = bookSchema.partial()
