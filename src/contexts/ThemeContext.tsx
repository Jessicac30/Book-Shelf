'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'light' | 'dark' // O tema atual sendo aplicado
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light') // Iniciar com light por padrão
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Carregar tema salvo do localStorage apenas no cliente
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('bookshelf-theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  // Detectar preferência do sistema
  useEffect(() => {
    if (!mounted) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateSystemTheme = () => {
      if (theme === 'system') {
        setActualTheme(mediaQuery.matches ? 'dark' : 'light')
      }
    }

    updateSystemTheme()
    mediaQuery.addEventListener('change', updateSystemTheme)

    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [theme, mounted])

  // Aplicar tema
  useEffect(() => {
    if (!mounted) return

    let newActualTheme: 'light' | 'dark'

    if (theme === 'system') {
      newActualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      newActualTheme = theme
    }

    setActualTheme(newActualTheme)
    
    // Aplicar classe no document
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(newActualTheme)
    
    // Salvar preferência
    localStorage.setItem('bookshelf-theme', theme)
  }, [theme, mounted])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  // Render nada até estar montado para evitar hidration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        actualTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Durante o SSR ou se não está dentro do provider, retorna valores padrão
    return {
      theme: 'light' as Theme,
      setTheme: () => {},
      actualTheme: 'light' as 'light' | 'dark'
    }
  }
  return context
}