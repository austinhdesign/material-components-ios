'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/cn'
import { DISTRACTION_CATEGORIES } from '@/constants/distractionCategories'
import type { DistractionCategory } from '@/types/distraction'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface DistractionLoggerModalProps {
  open: boolean
  sessionId: string | null
  onClose: () => void
  onLog: (sessionId: string | null, category: DistractionCategory, note: string) => Promise<void>
}

export function DistractionLoggerModal({ open, sessionId, onClose, onLog }: DistractionLoggerModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<DistractionCategory | null>(null)
  const [note, setNote] = useState('')
  const [isLogging, setIsLogging] = useState(false)

  const handleLog = async () => {
    if (!selectedCategory) return
    setIsLogging(true)
    try {
      await onLog(sessionId, selectedCategory, note)
      setSelectedCategory(null)
      setNote('')
    } finally {
      setIsLogging(false)
    }
  }

  const categories = Object.entries(DISTRACTION_CATEGORIES) as [DistractionCategory, { label: string; icon: string }][]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log a distraction</DialogTitle>
          <DialogDescription>
            What pulled your attention away? Tracking helps you improve focus.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Category grid */}
          <div className="grid grid-cols-2 gap-2">
            {categories.map(([key, { label, icon }]) => {
              const Icon = (LucideIcons[icon as keyof typeof LucideIcons] ?? LucideIcons.Circle) as LucideIcon
              const isSelected = selectedCategory === key
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all text-left',
                    isSelected
                      ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                      : 'border-[var(--border)] hover:border-[var(--ring)] hover:bg-[var(--accent)]'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Note */}
          <Textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Optional note (e.g., 'Slack message from boss')"
            rows={2}
            maxLength={200}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleLog}
            disabled={!selectedCategory || isLogging}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
          >
            {isLogging ? 'Logging…' : 'Log distraction'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
