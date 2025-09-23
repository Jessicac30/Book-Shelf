
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

## 💻 Tecnologias
- **Next.js 15** - Framework React com App Router e Server/Client Components
- **React 19** - Biblioteca principal para a interface do usuário
- **TypeScript** - Tipagem estática para um código mais seguro e robusto
- **Tailwind CSS** - Framework utilitário para estilização rápida e responsiva
- **shadcn/ui** - Biblioteca de componentes de UI de alta qualidade

## 🚀 Como Usar
Para executar o projeto localmente, siga os passos abaixo.

Clone o repositório:
```bash
git clone https://github.com/Jessicac30/Book-Shelf.git
cd bookshelf
```

Instale as dependências:
```bash
npm install
# ou
yarn
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

Abra seu navegador em http://localhost:3000 para ver a aplicação em funcionamento.

🤝 Contribuição
Sinta-se à vontade para abrir uma issue ou um pull request se desejar sugerir melhorias ou reportar bugs.

🧑‍💻 Autores
Este projeto foi um trabalho em grupo.

Antonio Maycon

Cristiane de Araujo Ferreira 

Danilo

Jessica Maria de Carvalho

