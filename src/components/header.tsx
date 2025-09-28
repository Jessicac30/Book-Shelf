// Localização: components/header.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Plus, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

// Navegação principal que aparecerá em telas maiores
const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Biblioteca", href: "/biblioteca", icon: Library },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">BookShelf</span>
          </Link>

          {/* ===== AJUSTE DE RESPONSIVIDADE AQUI ===== */}
          {/* Esta navegação agora ficará escondida em telas pequenas (hidden) */}
          {/* e aparecerá como flex em telas médias ou maiores (md:flex) */}
          <nav className="hidden md:flex items-center space-x-6 ml-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>{" "}
                  {/* Removido o 'hidden' para sempre aparecer quando a nav estiver visível */}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {" "}
          {/* Reduzido o espaçamento em telas pequenas */}
          {/* Botão de Adicionar Livro (com seu estilo customizado) */}
          <Link href="/adicionar">
            <button
              className="
                group relative inline-flex items-center px-4 py-2 md:px-6 md:py-3 text-white font-semibold rounded-lg
                bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                hover:from-blue-600 hover:via-purple-600 hover:to-pink-600
                transform hover:scale-105 hover:shadow-xl
                transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-4 focus:ring-purple-500/50
                active:scale-95 overflow-hidden text-sm md:text-base
              "
            >
              <Plus size={18} className="mr-0 md:mr-2" />
              <span className="hidden md:inline">Adicionar Livro</span>{" "}
              {/* Escondendo o texto em telas pequenas */}
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-lg opacity-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full group-hover:opacity-100 transition-all duration-700 ease-in-out" />
            </button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
