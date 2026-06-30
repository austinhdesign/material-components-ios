'use client'
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SessionReflectionModalProps {
  open: boolean
  sessionId: string
  onSave: (sessionId: string, rating: 1|2|3|4|5, note: string) => Promise<void>
  onDismiss: () => void
}

export function SessionReflectionModal({ open, sessionId, onSave, onDismiss }: SessionReflectionModalProps) {
  const [rating, setRating] = useState<1|2|3|4|5|null>(null)
  const [note, setNote] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    if (!open) return
    setCountdown(60)
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          onDismiss()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [open, onDismiss])

  const handleSave = async () => {
    if (!rating) return
    setIsSaving(true)
    try {
      await onSave(sessionId, rating, note)
    } finally {
      setIsSaving(false)
    }
  }

  const ratingLabels: Record<number, string> = {
    1: 'Very Poor',
    2: 'Poor',
    3: 'Average',
    4: 'Good',
    5: 'Excellent',
  }

  return (
    <Dialog open={open} onOpenChange={onDismiss}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How was your focus?</DialogTitle>
          <DialogDescription>
            Rate the quality of your focus session. Closes in {countdown}s.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Star rating */}
          <div className="space-y-2">
            <div className="flex justify-center gap-2">
              {([1, 2, 3, 4, 5] as const).map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} out of 5: ${ratingLabels[star]}`}
                >
                  <Star
                    className={cn(
                      'w-10 h-10 transition-colors',
                      rating !== null && star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-[var(--muted-foreground)]'
                    )}
                  />
                </button>
              ))}
            </div>
            {rating && (
              <p className="text-center text-sm font-medium text-amber-600 dark:text-amber-400">
                {ratingLabels[rating]}
              </p>
            )}
          </div>

          {/* Note */}
          <Textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Any notes? What went well, what distracted you…"
            rows={3}
            maxLength={500}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="ghost" onClick={onDismiss} className="flex-1">
            Skip
          </Button>
          <Button onClick={handleSave} disabled={!rating || isSaving} className="flex-1">
            {isSaving ? 'Saving…' : 'Save reflection'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
