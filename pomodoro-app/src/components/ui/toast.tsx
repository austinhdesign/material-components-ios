'use client'
import * as React from 'react'
import { cn } from '@/utils/cn'
import { X } from 'lucide-react'

export interface ToastMessage {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

interface ToastContextType {
  toasts: ToastMessage[]
  toast: (msg: Omit<ToastMessage, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([])

  const toast = React.useCallback((msg: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}`
    const newToast: ToastMessage = { id, duration: 4000, ...msg }
    setToasts(prev => [...prev, newToast])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, newToast.duration)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
        {toasts.map(t => (
          <div
            key={t.id}
            className={cn(
              'flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all',
              t.variant === 'destructive'
                ? 'border-red-500 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100'
                : 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]'
            )}
          >
            <div className="flex-1">
              {t.title && <p className="font-semibold text-sm">{t.title}</p>}
              {t.description && <p className="text-sm text-[var(--muted-foreground)]">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

// Toaster component (alias for compatibility)
export function Toaster() {
  return null // The ToastProvider already renders the toasts
}
