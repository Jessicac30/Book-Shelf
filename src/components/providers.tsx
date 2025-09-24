'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { BookProvider } from '@/contexts/BookContext'
import { NotificationProvider } from '@/components/notification'
import { Header } from '@/components/header'
import { AnimatedBackground } from '@/components/animated-background'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <BookProvider>
        <NotificationProvider>
          <div className="min-h-screen relative">
            <AnimatedBackground />
            <Header />
            <main className="container mx-auto relative z-10">
              {children}
            </main>
          </div>
        </NotificationProvider>
      </BookProvider>
    </ThemeProvider>
  )
}