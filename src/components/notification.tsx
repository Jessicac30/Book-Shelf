'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export type NotificationType = 'success' | 'error'

interface Notification {
  id: string
  type: NotificationType
  message: string
}

interface NotificationContextType {
  showNotification: (type: NotificationType, message: string) => void
}

let notificationContext: NotificationContextType | null = null

export const useNotification = () => {
  if (!notificationContext) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return notificationContext
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = (type: NotificationType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    const notification: Notification = { id, type, message }

    setNotifications(prev => [...prev, notification])

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  notificationContext = { showNotification }

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </>
  )
}

interface NotificationItemProps {
  notification: Notification
  onRemove: (id: string) => void
}

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(() => {
      onRemove(notification.id)
    }, 300)
  }

  const bgColor = notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
  const Icon = notification.type === 'success' ? CheckCircle : XCircle

  return (
    <div
      className={`
        ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-80 max-w-sm
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <Icon size={20} />
      <p className="flex-1 text-sm font-medium">{notification.message}</p>
      <button
        onClick={handleRemove}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  )
}