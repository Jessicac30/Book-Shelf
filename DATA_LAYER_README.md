# Camada de Acesso aos Dados - BookShelf

Esta pasta contém toda a implementação da camada de acesso aos dados do projeto BookShelf, implementada pela **PESSOA 2**.

## 📁 Estrutura

```
src/lib/
├── prisma.ts                 # Configuração do cliente Prisma
├── data-layer.ts            # Exportação centralizada
├── repositories/            # Repositórios para acesso aos dados
│   ├── book-repository.ts   # CRUD operations para livros
│   ├── genre-repository.ts  # CRUD operations para gêneros
│   └── index.ts            # Exportação dos repositórios
├── services/               # Services com regras de negócio
│   ├── book-service.ts     # Lógica de negócio para livros
│   ├── genre-service.ts    # Lógica de negócio para gêneros
│   └── index.ts           # Exportação dos services
├── scripts/               # Scripts de migração e população
│   ├── seed.ts           # Popular banco com dados iniciais
│   └── migrate.ts        # Migrar dados legacy para Prisma
└── validation/           # Validadores e sanitizadores
    ├── validators.ts     # Funções de validação
    └── index.ts         # Exportação das validações
```

## 🔧 Funcionalidades Implementadas

### 1. Cliente Prisma (`prisma.ts`)
- Configuração otimizada do PrismaClient
- Singleton pattern para reutilização de conexões
- Funções utilitárias para connect/disconnect
- Logs configurados por ambiente

### 2. Repositórios (`repositories/`)

#### BookRepository
- `findMany()` - Busca com filtros e paginação
- `findById()` - Busca por ID
- `create()` - Criar novo livro
- `update()` - Atualizar livro
- `delete()` - Deletar livro
- `findByStatus()` - Buscar por status de leitura
- `findByGenreId()` - Buscar por gênero
- `updateProgress()` - Atualizar progresso de leitura
- `updateRating()` - Atualizar avaliação
- `getStats()` - Obter estatísticas
- `count()` - Contar registros com filtros

#### GenreRepository
- `findMany()` - Listar todos os gêneros
- `findById()` - Buscar por ID
- `findByName()` - Buscar por nome
- `create()` - Criar novo gênero
- `update()` - Atualizar gênero
- `delete()` - Deletar gênero
- `exists()` - Verificar se existe
- `findMostPopular()` - Gêneros mais utilizados
- `findOrCreate()` - Buscar ou criar

### 3. Services (`services/`)

#### BookService
- Validações de negócio
- Operações complexas (marcar como lido, iniciar leitura, etc.)
- Integração com repositórios
- Tratamento de erros consistente

#### GenreService
- Gerenciamento de gêneros
- Inicialização de gêneros padrão
- Validações de integridade
- Prevenção de exclusão com livros associados

### 4. Scripts (`scripts/`)

#### Seed (`seed.ts`)
```bash
npm run db:seed
```
- Popula o banco com gêneros padrão
- Adiciona livros de exemplo
- Execução segura (não duplica dados)

#### Migrate (`migrate.ts`)
```bash
npm run db:migrate-data
```
- Migra dados do localStorage para Prisma
- Cria backup dos dados atuais
- Mapeia gêneros legacy para novos IDs
- Relatório detalhado do processo

### 5. Validação (`validation/`)
- Validadores type-safe para todos os dados
- Sanitização de inputs
- Validação de parâmetros de busca
- Mensagens de erro padronizadas

## 🚀 Como Usar

### Importação Centralizada
```typescript
import { 
  bookService, 
  genreService, 
  prisma, 
  validateBookData 
} from '@/lib/data-layer'
```

### Operações Básicas
```typescript
// Buscar livros com filtros
const books = await bookService.getBooks({
  search: 'Dom Casmurro',
  status: 'LENDO',
  page: 1,
  limit: 10
})

// Criar um novo livro
const newBook = await bookService.createBook({
  title: 'Novo Livro',
  author: 'Autor Exemplo',
  genreId: 'genre-id-here',
  status: 'QUERO_LER'
})

// Atualizar progresso
await bookService.updateProgress('book-id', 150)

// Obter estatísticas
const stats = await bookService.getStatistics()
```

### Gerenciamento de Gêneros
```typescript
// Listar todos os gêneros
const genres = await genreService.getAllGenres()

// Criar novo gênero
const genre = await genreService.createGenre({
  name: 'Novo Gênero'
})

// Buscar ou criar
const existingGenre = await genreService.findOrCreateGenre('Ficção')
```

## 🛠 Scripts Disponíveis

```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar migrações
npm run db:migrate

# Interface gráfica do banco
npm run db:studio

# Popular banco inicial
npm run db:seed

# Migrar dados legacy
npm run db:migrate-data

# Reset completo do banco
npm run db:reset
```

## 📊 Tipos TypeScript

Todos os tipos são gerados automaticamente pelo Prisma e re-exportados para uso:

```typescript
import type { 
  Book, 
  Genre, 
  ReadingStatus, 
  BookWithGenre,
  BookFormData,
  BooksResponse,
  BookStats 
} from '@/types/book'
```

## 🔐 Type Safety

- 100% type-safe com TypeScript
- Validação em runtime e compile-time
- Autocompletion em todas as operações
- Prevenção de erros com tipos rigorosos

## 🚨 Tratamento de Erros

- Erros de validação com mensagens específicas
- Tratamento de duplicatas e restrições
- Logs estruturados para debugging
- Códigos de erro padronizados

## 📈 Performance

- Conexões otimizadas do Prisma
- Queries com includes seletivos
- Paginação implementada
- Indexes otimizados no schema

Esta implementação fornece uma base sólida e type-safe para que a **PESSOA 3** possa atualizar os componentes e a **PESSOA 4** possa finalizar as API Routes.