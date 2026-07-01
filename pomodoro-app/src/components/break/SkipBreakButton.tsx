'use client'
import { SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTimerStore } from '@/stores/timerStore'

export function SkipBreakButton() {
  const { skip } = useTimerStore()

  return (
    <Button
      variant="ghost"
      onClick={skip}
      className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      aria-label="Skip break"
    >
      <SkipForward className="w-4 h-4 mr-2" />
      Skip Break
    </Button>
  )
}
