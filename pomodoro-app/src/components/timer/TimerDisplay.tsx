'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { formatTime } from '@/utils/timeFormat'
import type { TimerStatus } from '@/types/timer'

interface TimerDisplayProps {
  seconds: number
  status: TimerStatus
}

export function TimerDisplay({ seconds, status }: TimerDisplayProps) {
  const timeStr = formatTime(seconds)

  return (
    <motion.div
      className="flex flex-col items-center"
      animate={status === 'paused' ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
      transition={status === 'paused' ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
    >
      <span
        className="font-mono text-6xl md:text-7xl font-bold tracking-tight tabular-nums text-[var(--foreground)]"
        aria-live="polite"
        aria-label={`${Math.floor(seconds / 60)} minutes and ${seconds % 60} seconds remaining`}
      >
        {timeStr}
      </span>
    </motion.div>
  )
}
