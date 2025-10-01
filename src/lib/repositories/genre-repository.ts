import { prisma } from '@/lib/prisma'
import { Genre, Prisma } from '@prisma/client'

// Tipos para criação e atualização de gêneros
export type CreateGenreData = Omit<Genre, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateGenreData = Partial<CreateGenreData>

// Tipo para gênero com contagem de livros
export type GenreWithBookCount = Genre & {
  _count: {
    books: number
  }
}

class GenreRepository {
  
  /**
   * Buscar todos os gêneros
   */
  async findMany(): Promise<GenreWithBookCount[]> {
    const genres = await prisma.genre.findMany({
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })
    
    return genres
  }

  /**
   * Buscar gênero por ID
   */
  async findById(id: string): Promise<Genre | null> {
    const genre = await prisma.genre.findUnique({
      where: { id },
    })
    
    return genre
  }

  /**
   * Buscar gênero por nome
   */
  async findByName(name: string): Promise<Genre | null> {
    const genre = await prisma.genre.findUnique({
      where: { name },
    })
    
    return genre
  }

  /**
   * Criar um novo gênero
   */
  async create(data: CreateGenreData): Promise<Genre> {
    const genre = await prisma.genre.create({
      data,
    })
    
    return genre
  }

  /**
   * Atualizar um gênero
   */
  async update(id: string, data: UpdateGenreData): Promise<Genre | null> {
    try {
      const genre = await prisma.genre.update({
        where: { id },
        data,
      })
      
      return genre
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null // Gênero não encontrado
      }
      throw error
    }
  }

  /**
   * Deletar um gênero
   */
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.genre.delete({
        where: { id },
      })
      
      return true
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false // Gênero não encontrado
      }
      throw error
    }
  }

  /**
   * Verificar se um gênero existe pelo nome
   */
  async exists(name: string): Promise<boolean> {
    const count = await prisma.genre.count({
      where: { name },
    })
    
    return count > 0
  }

  /**
   * Obter gêneros mais populares (com mais livros)
   */
  async findMostPopular(limit = 10): Promise<GenreWithBookCount[]> {
    const genres = await prisma.genre.findMany({
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
      orderBy: {
        books: {
          _count: 'desc',
        },
      },
      take: limit,
    })
    
    return genres
  }

  /**
   * Contar total de gêneros
   */
  async count(): Promise<number> {
    return prisma.genre.count()
  }

  /**
   * Buscar ou criar gênero
   */
  async findOrCreate(name: string): Promise<Genre> {
    let genre = await this.findByName(name)
    
    if (!genre) {
      genre = await this.create({ name })
    }
    
    return genre
  }
}

export const genreRepository = new GenreRepository()