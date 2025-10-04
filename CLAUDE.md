# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BookShelf is a personal library management web application built with Next.js 15, React 19, and TypeScript. The app allows users to catalog books, track reading progress, filter by genre/status, and visualize library statistics.

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run database migrations
npm run db:studio      # Open Prisma Studio GUI
npm run db:seed        # Seed database with sample data
npm run db:migrate-data # Migrate existing data
npm run db:reset       # Reset database and re-seed
```

## Architecture

### Technology Stack
- **Framework:** Next.js 15 with App Router
- **UI Library:** React 19
- **Language:** TypeScript with strict mode
- **Database:** SQLite with Prisma ORM
- **Styling:** Tailwind CSS with shadcn/ui components
- **Animations:** Framer Motion
- **Theming:** next-themes for dark/light mode

### Hybrid Architecture
The project uses a **hybrid approach** combining:
1. **Client-side state management** via React Context (`BookContext`) with localStorage persistence
2. **Server-side data** via Prisma ORM and SQLite database
3. **API Routes** for RESTful endpoints (`/api/books`, `/api/categories`)

**Important:** The codebase is currently in transition. Some components use client-side localStorage (via `BookContext`), while the database schema (Prisma) is set up for server-side persistence. When adding features, verify which data source is being used.

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (RESTful endpoints)
│   │   ├── books/        # Book CRUD operations
│   │   └── categories/   # Genre/category endpoints
│   ├── layout.tsx        # Root layout with providers
│   └── page.tsx          # Main dashboard page
├── components/
│   ├── dashboard/        # Dashboard-specific components
│   ├── ui/              # shadcn/ui components
│   ├── header.tsx       # Global navigation header
│   ├── theme-toggle.tsx # Dark/light mode switcher
│   └── notification.tsx # Toast notification system
├── contexts/
│   ├── BookContext.tsx  # Global book state management
│   └── ThemeContext.tsx # Theme state (deprecated - uses next-themes)
├── data/
│   └── store.ts         # Mock data and initial state
├── lib/
│   ├── scripts/         # Database seed and migration scripts
│   ├── hooks.ts         # Custom React hooks
│   └── utils.ts         # Utility functions (cn, etc.)
└── types/
    └── book.ts          # TypeScript type definitions
```

### State Management Pattern

**BookContext** (`src/contexts/BookContext.tsx`) is the central state manager using `useReducer`:

- **State shape:** `books`, `filters`, `stats`, `isLoading`, `error`
- **Actions:** `SET_BOOKS`, `ADD_BOOK`, `UPDATE_BOOK`, `DELETE_BOOK`, `SET_FILTERS`
- **Helper methods:** `addBook()`, `updateBook()`, `deleteBook()`, `getFilteredBooks()`
- **Auto-calculated stats:** Total books, reading counts by status, pages read/total
- **Persistence:** Uses localStorage (key: `bookshelf-books`)

When modifying book data, always use the helper methods from `useBooks()` hook rather than dispatching actions directly.

### Database Schema (Prisma)

Two main models in `prisma/schema.prisma`:

**Genre:**
- `id` (cuid), `name` (unique), `createdAt`, `updatedAt`
- One-to-many relationship with Books

**Book:**
- Core fields: `id`, `title`, `author`, `year`, `pages`, `currentPage`
- Reading metadata: `status` (enum), `rating`, `isbn`, `cover`, `synopsis`, `notes`
- Relationship: `genreId` → Genre (optional)
- Reading status enum: `QUERO_LER`, `LENDO`, `LIDO`, `PAUSADO`, `ABANDONADO`

### Type System

Main types in `src/types/book.ts`:
- `ReadingStatus`: Union type matching Prisma enum
- `Genre`: Union of hardcoded genre strings (currently not synced with database)
- `Book`: Interface matching Prisma schema with optional fields

**Note:** There's a mismatch between the TypeScript `Genre` type (hardcoded strings) and the database Genre model (dynamic). Consider unifying these.

### Styling System

Uses Tailwind CSS with CSS variables for theming:
- Theme tokens: `--background`, `--foreground`, `--primary`, `--secondary`, etc.
- Dark mode: `class` strategy via `next-themes`
- Component library: shadcn/ui (Card, Button, Input, Select, DropdownMenu)
- Utility: `cn()` function from `lib/utils.ts` for conditional classes

### Path Aliases

TypeScript paths configured in `tsconfig.json`:
```typescript
"@/*": ["./src/*"]
```

Always use `@/` imports for internal modules (e.g., `@/components/ui/button`).

## Key Conventions

1. **Component pattern:** Client components must have `'use client'` directive at the top
2. **Provider hierarchy:** ThemeProvider > BookProvider > NotificationProvider (see `app/layout.tsx`)
3. **Portuguese language:** UI text, comments, and variable names use Brazilian Portuguese
4. **File naming:** kebab-case for files (e.g., `stats-card.tsx`), PascalCase for components
5. **Data flow:** Props down, callbacks up; Context for global state only

## Common Gotchas

- **Hydration:** `BookContext` has SSR guards - returns default values during server render
- **localStorage:** Only accessed in `useEffect` after mount (`mounted` flag)
- **Genre mismatch:** TypeScript `Genre` type doesn't match database Genre model
- **Dual data sources:** Check if feature uses localStorage (via Context) or database (via Prisma)
- **Next.js 15:** Uses React 19 - some libraries may have peer dependency warnings

## Database Development

When modifying the schema:
1. Edit `prisma/schema.prisma`
2. Run `npm run db:generate` to update TypeScript types
3. Run `npm run db:migrate` to create and apply migration
4. Update `src/types/book.ts` to match new schema
5. Update seed scripts in `src/lib/scripts/` if needed

## Known Technical Debt

1. Dual data persistence (localStorage + database) needs unification
2. Genre type definition should be generated from database
3. Some components have commented migration notes for Prisma integration
4. API routes currently use mock data instead of Prisma queries
