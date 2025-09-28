// src/components/dashboard/dashboard.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Book, BookOpen, CheckCircle2, FileText, Plus } from "lucide-react";
import { StatsCard } from "./stats-card";
import { bookService } from "@/lib/book-service";
import type { Book as BookType } from "@/types/book";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const [books, setBooks] = useState<BookType[]>([]);

  // Carregar livros do bookService
  const loadBooks = () => {
    if (typeof window !== 'undefined') {
      const loadedBooks = bookService.getAllBooks();
      setBooks(loadedBooks);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Recarregar quando a página recebe foco
  useEffect(() => {
    const handleFocus = () => {
      loadBooks();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadBooks();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const stats = useMemo(() => {
    return bookService.getStats();
  }, [books]);

  const recentBooks = useMemo(() => {
    return books
      .filter((book) => book.status === "LENDO" || book.status === "LIDO")
      .slice(0, 3);
  }, [books]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button
          onClick={loadBooks}
          variant="outline"
          className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
        >
          🔄 Atualizar
        </Button>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, staggerChildren: 0.1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <StatsCard
            title="Total de Livros"
            value={stats.total}
            description="Livros cadastrados"
            icon={Book}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StatsCard
            title="Lendo Atualmente"
            value={stats.reading}
            description="Em progresso"
            icon={BookOpen}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <StatsCard
            title="Livros Lidos"
            value={stats.read}
            description="Finalizados"
            icon={CheckCircle2}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <StatsCard
            title="Páginas Lidas"
            value={stats.pagesRead}
            description="Total de páginas"
            icon={FileText}
          />
        </motion.div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Card "Leituras Recentes" corrigido */}
        <Card className="col-span-4 transition-all duration-300">
          <CardHeader>
            <CardTitle>Leituras Recentes</CardTitle>
            <CardDescription>
              Seus últimos livros lidos e em progresso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBooks.map((book) => (
              <div
                key={book.id}
                className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-secondary transition-all duration-200 cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none text-foreground transition-colors">
                    {book.title}
                  </p>
                  <p className="text-sm text-muted-foreground transition-colors">
                    {book.author}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {book.status === "LENDO" &&
                    book.currentPage &&
                    book.pages && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-xs font-medium">
                        {Math.round((book.currentPage / book.pages) * 100)}%
                      </span>
                    )}
                  {book.status === "LIDO" && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 rounded-full text-xs font-medium">
                      Concluído
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Card "Navegação Rápida" corrigido */}
        <Card className="col-span-3 transition-all duration-300">
          <CardHeader>
            <CardTitle>Navegação Rápida</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {" "}
            {/* Aumentei o espaço para 'space-y-4' */}
            <Link href="/biblioteca" className="w-full block">
              <button
                className="
                  group relative w-full px-4 py-3 text-left rounded-lg
                  bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300
                  dark:bg-emerald-900/40 dark:hover:bg-emerald-900/70 dark:border-emerald-800/80 dark:hover:border-emerald-700
                  text-foreground
                  transform hover:scale-[1.02] hover:shadow-md
                  transition-all duration-300 ease-in-out
                  flex items-center justify-start overflow-hidden
                "
              >
                <div className="relative p-2 rounded-lg mr-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm">
                  <Book className="h-4 w-4" />
                </div>
                <span className="font-medium">Ver Biblioteca</span>
                <div className="absolute inset-0 rounded-lg opacity-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full group-hover:opacity-100 transition-all duration-1000 ease-in-out" />
              </button>
            </Link>
            <Link href="/adicionar" className="w-full block">
              <button
                className="
                  group relative w-full px-4 py-3 text-left rounded-lg
                  bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300
                  dark:bg-blue-900/40 dark:hover:bg-blue-900/70 dark:border-blue-800/80 dark:hover:border-blue-700
                  text-foreground
                  transform hover:scale-[1.02] hover:shadow-md
                  transition-all duration-300 ease-in-out
                  flex items-center justify-start overflow-hidden
                "
              >
                <div className="relative p-2 rounded-lg mr-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="font-medium">Adicionar Novo Livro</span>
                <div className="absolute inset-0 rounded-lg opacity-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full group-hover:opacity-100 transition-all duration-1000 ease-in-out" />
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
