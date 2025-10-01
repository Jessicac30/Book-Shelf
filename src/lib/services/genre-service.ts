import { genreRepository, CreateGenreData, UpdateGenreData } from '@/lib/repositories'
import { Genre } from '@/types/book'

/**
 * Service para gerenciar operações de negócio relacionadas aos gêneros
 */
class GenreService {

  /**
   * Buscar todos os gêneros
   */
  async getAllGenres() {
    return genreRepository.findMany()
  }

  /**
   * Buscar gênero por ID
   */
  async getGenreById(id: string): Promise<Genre | null> {
    return genreRepository.findById(id)
  }

  /**
   * Buscar gênero por nome
   */
  async getGenreByName(name: string): Promise<Genre | null> {
    return genreRepository.findByName(name)
  }

  /**
   * Criar um novo gênero
   */
  async createGenre(data: CreateGenreData): Promise<Genre> {
    // Validações de negócio
    if (!data.name?.trim()) {
      throw new Error('Nome do gênero é obrigatório')
    }

    // Verificar se já existe um gênero com esse nome
    const existingGenre = await genreRepository.findByName(data.name.trim())
    if (existingGenre) {
      throw new Error('Já existe um gênero com esse nome')
    }

    return genreRepository.create({
      name: data.name.trim()
    })
  }

  /**
   * Atualizar gênero
   */
  async updateGenre(id: string, data: UpdateGenreData): Promise<Genre | null> {
    // Validações de negócio
    if (data.name !== undefined && !data.name?.trim()) {
      throw new Error('Nome do gênero não pode estar vazio')
    }

    if (data.name) {
      // Verificar se já existe outro gênero com esse nome
      const existingGenre = await genreRepository.findByName(data.name.trim())
      if (existingGenre && existingGenre.id !== id) {
        throw new Error('Já existe um gênero com esse nome')
      }
    }

    const updateData = data.name ? { name: data.name.trim() } : data

    return genreRepository.update(id, updateData)
  }

  /**
   * Deletar gênero
   */
  async deleteGenre(id: string): Promise<boolean> {
    // Verificar se o gênero tem livros associados
    // Se tiver, não permitir a exclusão
    const genreWithBooks = await genreRepository.findMany()
    const genre = genreWithBooks.find(g => g.id === id)
    
    if (genre && genre._count.books > 0) {
      throw new Error('Não é possível excluir um gênero que possui livros associados')
    }

    return genreRepository.delete(id)
  }

  /**
   * Verificar se um gênero existe
   */
  async genreExists(name: string): Promise<boolean> {
    return genreRepository.exists(name)
  }

  /**
   * Obter gêneros mais populares
   */
  async getMostPopularGenres(limit = 10) {
    return genreRepository.findMostPopular(limit)
  }

  /**
   * Contar total de gêneros
   */
  async countGenres(): Promise<number> {
    return genreRepository.count()
  }

  /**
   * Buscar ou criar gênero
   */
  async findOrCreateGenre(name: string): Promise<Genre> {
    if (!name?.trim()) {
      throw new Error('Nome do gênero é obrigatório')
    }

    return genreRepository.findOrCreate(name.trim())
  }

  /**
   * Criar gêneros padrão se não existirem
   */
  async initializeDefaultGenres(): Promise<void> {
    const defaultGenres = [
      'Literatura Brasileira',
      'Ficção Científica',
      'Realismo Mágico',
      'Ficção',
      'Fantasia',
      'Romance',
      'Biografia',
      'História',
      'Autoajuda',
      'Tecnologia',
      'Programação',
      'Negócios',
      'Psicologia',
      'Filosofia',
      'Poesia'
    ]

    for (const genreName of defaultGenres) {
      try {
        await this.findOrCreateGenre(genreName)
      } catch (error) {
        console.warn(`Erro ao criar gênero padrão "${genreName}":`, error)
      }
    }
  }
}

export const genreService = new GenreService()