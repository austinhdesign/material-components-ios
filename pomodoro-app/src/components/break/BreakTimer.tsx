'use client'
import { motion } from 'framer-motion'
import { CircularProgress } from '@/components/timer/CircularProgress'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { PhaseLabel } from '@/components/timer/PhaseLabel'
import { WellnessTip } from './WellnessTip'
import { SkipBreakButton } from './SkipBreakButton'
import { TimerControls } from '@/components/timer/TimerControls'
import { useTimerStore } from '@/stores/timerStore'
import type { SessionPhase } from '@/types/session'
import type { TimerStatus } from '@/types/timer'

interface BreakTimerProps {
  phase: SessionPhase
  remainingSeconds: number
  plannedDuration: number
  status: TimerStatus
}

export function BreakTimer({ phase, remainingSeconds, plannedDuration, status }: BreakTimerProps) {
  const progress = plannedDuration > 0 ? (plannedDuration - remainingSeconds) / plannedDuration : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-8"
    >
      <PhaseLabel phase={phase} />

      <CircularProgress progress={progress} size={220} strokeWidth={6} phase={phase}>
        <TimerDisplay seconds={remainingSeconds} status={status} />
      </CircularProgress>

      <TimerControls />

      <div className="p-4 rounded-xl bg-[var(--muted)] max-w-sm w-full">
        <p className="text-xs font-medium text-[var(--muted-foreground)] mb-3 uppercase tracking-wider">Wellness Tip</p>
        <WellnessTip />
      </div>

      <SkipBreakButton />
    </motion.div>
  )
}
