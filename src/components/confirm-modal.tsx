'use client'

import { useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'danger'
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-500'
      case 'info':
        return 'text-blue-500'
      default:
        return 'text-red-500'
    }
  }

  const getConfirmButtonVariant = () => {
    switch (type) {
      case 'danger':
        return 'destructive'
      case 'warning':
        return 'destructive'
      case 'info':
        return 'default'
      default:
        return 'destructive'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-gray-100 ${getIconColor()}`}>
                <AlertTriangle size={20} />
              </div>
              <CardTitle className="text-lg font-semibold">
                {title}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X size={16} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              variant={getConfirmButtonVariant()}
              onClick={onConfirm}
              className="flex-1"
            >
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}