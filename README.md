
📘 BookShelf
Gerenciamento de Biblioteca Pessoal

Uma aplicação web moderna e responsiva para catalogar, organizar e acompanhar o progresso de leitura dos seus livros favoritos.

## ✨ Funcionalidades
O projeto foi desenvolvido em duas partes, abrangendo desde as funcionalidades básicas até a otimização de arquitetura.

### Parte 1: Base e Interface
- **Dashboard:** Visualize estatísticas da sua biblioteca, como total de livros, livros em leitura e páginas lidas
- **Biblioteca:** Listagem interativa de livros com sistema de busca por título/autor e filtros por gênero
- **CRUD Completo:** Adicione, visualize, edite e exclua livros com formulários intuitivos e feedback visual
- **Design Responsivo:** A aplicação se adapta perfeitamente a dispositivos móveis, tablets e desktops

### Parte 2: Arquitetura e Otimização
- **Sistema de Temas:** Alterne entre os modos Claro, Escuro e Sistema, com persistência de preferência e transições suaves
- **API Local:** Implementação de endpoints RESTful com API Routes do Next.js para gerenciar os dados dos livros e gêneros
- **Arquitetura Híbrida:** Refatoração do projeto para usar Server Components para data fetching e Server Actions para mutações, garantindo performance e eficiência
- **Gerenciamento de Estado:** Filtros e busca persistem na URL através de query parameters

### Parte 3: Banco de Dados e Escalabilidade
- **Migração para SQLite + Prisma ORM:** Substituição do armazenamento em arquivos JSON por banco de dados relacional para melhor performance e integridade de dados
- **Modelo de Dados Expandido:** Novos campos como status de leitura (Quero Ler, Lendo, Lido, Pausado, Abandonado), progresso de páginas, ISBN e anotações pessoais
- **Type Safety Completo:** Tipos gerados automaticamente pelo Prisma garantindo segurança em tempo de compilação
- **Sistema de Rastreamento de Leitura:** Acompanhe o progresso da sua leitura com indicadores visuais e estatísticas detalhadas
- **Relacionamentos de Dados:** Estrutura otimizada com relacionamentos entre livros e gêneros para consultas eficientes

## 💻 Tecnologias
- **Next.js 15** - Framework React com App Router e Server/Client Components
- **React 19** - Biblioteca principal para a interface do usuário
- **TypeScript** - Tipagem estática para um código mais seguro e robusto
- **Tailwind CSS** - Framework utilitário para estilização rápida e responsiva
- **shadcn/ui** - Biblioteca de componentes de UI de alta qualidade
- **Prisma ORM** - ORM moderno com type safety completo para TypeScript
- **SQLite** - Banco de dados relacional leve e eficiente

## 🚀 Como Usar
Para executar o projeto localmente, siga os passos abaixo.

### 1. Clone o repositório
```bash
git clone https://github.com/Jessicac30/Book-Shelf.git
cd Book-Shelf
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# O arquivo .env já está configurado com:
# DATABASE_URL="file:./dev.db"
# NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Configure o banco de dados
```bash
# Gera o cliente Prisma
npx prisma generate

# Aplica as migrações e cria o banco de dados SQLite
npx prisma migrate dev

# (Opcional) Visualize o banco de dados em uma interface gráfica
npx prisma studio
```

### 5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

Abra seu navegador em http://localhost:3000 para ver a aplicação em funcionamento.

## 🗄️ Estrutura do Banco de Dados

```prisma
model Book {
  id          String        # ID único
  title       String        # Título do livro
  author      String        # Autor
  year        Int?          # Ano de publicação
  pages       Int?          # Total de páginas
  currentPage Int?          # Página atual (progresso)
  status      ReadingStatus # Status de leitura
  isbn        String?       # Código ISBN
  cover       String?       # URL da capa
  rating      Float?        # Avaliação (0-5)
  synopsis    String?       # Sinopse
  notes       String?       # Anotações pessoais
  genreId     String?       # Relação com gênero
}

enum ReadingStatus {
  QUERO_LER   # Ainda não leu
  LENDO       # Lendo atualmente
  LIDO        # Já terminou
  PAUSADO     # Pausou a leitura
  ABANDONADO  # Não vai continuar
}
```

🤝 Contribuição
Sinta-se à vontade para abrir uma issue ou um pull request se desejar sugerir melhorias ou reportar bugs.

🧑‍💻 Autores
Este projeto foi um trabalho em grupo.

Antonio Maycon

Cristiane de Araujo Ferreira 

Danilo Vieira

Jessica Maria de Carvalho

