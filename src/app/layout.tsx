import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { AnimatedBackground } from '@/components/animated-background'
import { NotificationProvider } from '@/components/notification'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BookShelf - Sua Biblioteca Pessoal',
  description: 'Gerencie sua biblioteca pessoal e acompanhe seu progresso de leitura',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <NotificationProvider>
          <div className="min-h-screen relative">
            <AnimatedBackground />
            <Header />
            <main className="container mx-auto relative z-10">
              {children}
            </main>
          </div>
        </NotificationProvider>
      </body>
    </html>
  )
}