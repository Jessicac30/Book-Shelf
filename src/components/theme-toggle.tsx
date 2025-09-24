'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themeOptions = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Escuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Monitor },
  ]

  const currentTheme = themeOptions.find(option => option.value === theme)
  const Icon = currentTheme?.icon || Monitor

  return (
    <div className="flex items-center space-x-2">
      {/* Versão com Select para desktop */}
      <div className="hidden sm:block">
        <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
          <SelectTrigger className="w-[140px]">
            <div className="flex items-center space-x-2">
              <Icon size={16} />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {themeOptions.map((option) => {
              const OptionIcon = option.icon
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center space-x-2">
                    <OptionIcon size={16} />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Versão com botões para mobile */}
      <div className="flex sm:hidden space-x-1">
        {themeOptions.map((option) => {
          const OptionIcon = option.icon
          return (
            <Button
              key={option.value}
              variant={theme === option.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
              className="w-10 h-10 p-0"
              title={`Tema ${option.label}`}
            >
              <OptionIcon size={16} />
            </Button>
          )
        })}
      </div>
    </div>
  )
}

// Componente simples de botão alternador (apenas claro/escuro)
export function SimpleThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { actualTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(actualTheme === 'light' ? 'dark' : 'light')
  }

  // Não renderizar até estar montado para evitar hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0"
        disabled
      >
        <Sun size={18} />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 p-0"
      title={`Alternar para tema ${actualTheme === 'light' ? 'escuro' : 'claro'}`}
    >
      {actualTheme === 'light' ? (
        <Moon size={18} />
      ) : (
        <Sun size={18} />
      )}
    </Button>
  )
}