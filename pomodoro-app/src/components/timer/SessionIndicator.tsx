'use client'
import { cn } from '@/utils/cn'
import type { SessionPhase } from '@/types/session'

interface SessionIndicatorProps {
  currentIndex: number
  sessionsBeforeLongBreak: number
  phase: SessionPhase
}

export function SessionIndicator({ currentIndex, sessionsBeforeLongBreak, phase }: SessionIndicatorProps) {
  return (
    <div className="flex items-center gap-2" aria-label={`Session ${currentIndex + 1} of ${sessionsBeforeLongBreak}`}>
      {Array.from({ length: sessionsBeforeLongBreak }).map((_, i) => {
        const isCompleted = i < currentIndex
        const isCurrent = i === currentIndex && phase === 'focus'
        return (
          <div
            key={i}
            className={cn(
              'rounded-full transition-all duration-300',
              isCompleted
                ? 'w-3 h-3 bg-red-500'
                : isCurrent
                ? 'w-3 h-3 border-2 border-red-500'
                : 'w-2.5 h-2.5 border-2 border-[var(--muted-foreground)] opacity-40'
            )}
          />
        )
      })}
    </div>
  )
}
