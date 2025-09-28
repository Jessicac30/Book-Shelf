// Localização: app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationProvider } from "@/components/notification";
import { BookProvider } from "@/contexts/BookContext";
import { Header } from "@/components/header"; // <-- 1. ADICIONE A IMPORTAÇÃO AQUI

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookShelf", // Mudei para um título mais legal :)
  description: "Sua estante de livros digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BookProvider>
            <NotificationProvider>
              <Header /> {/* <-- 2. CHAME O COMPONENTE HEADER AQUI */}
              {children}
            </NotificationProvider>
          </BookProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
