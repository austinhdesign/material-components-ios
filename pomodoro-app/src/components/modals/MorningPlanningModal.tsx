'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sun, Target } from 'lucide-react'

interface MorningPlanningModalProps {
  open: boolean
  onSave: (priorities: [string, string, string], expectedPomodoros: number) => Promise<void>
  onSkip: () => void
}

export function MorningPlanningModal({ open, onSave, onSkip }: MorningPlanningModalProps) {
  const [priorities, setPriorities] = useState<[string, string, string]>(['', '', ''])
  const [expectedPomodoros, setExpectedPomodoros] = useState(4)
  const [isSaving, setIsSaving] = useState(false)

  const isValid = priorities.every(p => p.trim().length > 0)

  const handlePriorityChange = (index: number, value: string) => {
    setPriorities(prev => {
      const next: [string, string, string] = [...prev] as [string, string, string]
      next[index] = value
      return next
    })
  }

  const handleSave = async () => {
    if (!isValid) return
    setIsSaving(true)
    try {
      await onSave(priorities.map(p => p.trim()) as [string, string, string], expectedPomodoros)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent hideClose className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <DialogTitle>Good morning! Plan your day</DialogTitle>
          </div>
          <DialogDescription>
            Set your top 3 priorities for today to stay focused and productive.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 py-2"
        >
          {([1, 2, 3] as const).map((num, idx) => (
            <div key={num} className="space-y-1.5">
              <Label htmlFor={`priority-${num}`} className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center">
                  {num}
                </span>
                Priority {num}
              </Label>
              <Input
                id={`priority-${num}`}
                value={priorities[idx]}
                onChange={e => handlePriorityChange(idx, e.target.value)}
                placeholder={`What's your #${num} priority today?`}
                maxLength={120}
              />
            </div>
          ))}

          <div className="space-y-1.5">
            <Label htmlFor="pomodoros" className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[var(--muted-foreground)]" />
              Expected Pomodoros
            </Label>
            <Input
              id="pomodoros"
              type="number"
              min={1}
              max={20}
              value={expectedPomodoros}
              onChange={e => setExpectedPomodoros(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
              className="w-24"
            />
          </div>
        </motion.div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onSkip}
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors underline-offset-4 hover:underline"
          >
            Skip for today
          </button>
          <Button onClick={handleSave} disabled={!isValid || isSaving}>
            {isSaving ? 'Saving…' : 'Start the day'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
