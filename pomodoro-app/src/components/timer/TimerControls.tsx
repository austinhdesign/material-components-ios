'use client'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTimerStore } from '@/stores/timerStore'
import { cn } from '@/utils/cn'
import type { TimerStatus } from '@/types/timer'

export function TimerControls() {
  const { status, start, pause, resume, restart, skip } = useTimerStore()

  const handlePrimaryAction = () => {
    if (status === 'idle') start()
    else if (status === 'running') pause()
    else if (status === 'paused') resume()
  }

  const PrimaryIcon = status === 'running' ? Pause : Play

  return (
    <div className="flex items-center gap-4">
      {/* Restart */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={restart}
          disabled={status === 'idle'}
          aria-label="Restart (R)"
          title="Restart (R)"
          className="w-12 h-12 rounded-full"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Start/Pause (primary) */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={handlePrimaryAction}
          disabled={status === 'completed'}
          aria-label={status === 'running' ? 'Pause (Space)' : 'Start (Space)'}
          title={status === 'running' ? 'Pause (Space)' : 'Start (Space)'}
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
        >
          <PrimaryIcon className="w-7 h-7" />
        </Button>
      </motion.div>

      {/* Skip */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={skip}
          disabled={status === 'idle'}
          aria-label="Skip (S)"
          title="Skip (S)"
          className="w-12 h-12 rounded-full"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  )
}
