'use client'
import { useTimer } from '@/hooks/useTimer'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useTimerStore } from '@/stores/timerStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { usePlanningStore } from '@/stores/planningStore'
import { CircularProgress } from '@/components/timer/CircularProgress'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { PhaseLabel } from '@/components/timer/PhaseLabel'
import { SessionIndicator } from '@/components/timer/SessionIndicator'
import { TimerControls } from '@/components/timer/TimerControls'
import { BreakTimer } from '@/components/break/BreakTimer'
import { DistractionFAB } from '@/components/distractions/DistractionFAB'
import { Button } from '@/components/ui/button'
import { Maximize2, Minimize2, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TimerPage() {
  useTimer()
  useKeyboardShortcuts()

  const { phase, status, remainingSeconds, plannedDuration, sessionIndexInCycle } = useTimerStore()
  const { activePreset } = useSettingsStore()
  const { todaysPlan } = usePlanningStore()
  const { isFullscreen, toggleFullscreen } = useFullscreen()

  const progress = plannedDuration > 0 ? (plannedDuration - remainingSeconds) / plannedDuration : 0
  const isBreak = phase === 'short-break' || phase === 'long-break'
  const topPriority = todaysPlan?.priorities[0]

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-6">
      {/* Fullscreen button */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen (F)'}
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen (F)'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

      {isBreak ? (
        <BreakTimer
          phase={phase}
          remainingSeconds={remainingSeconds}
          plannedDuration={plannedDuration}
          status={status}
        />
      ) : (
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Phase label */}
          <PhaseLabel phase={phase} />

          {/* Circular progress with timer */}
          <CircularProgress
            progress={progress}
            size={280}
            strokeWidth={8}
            phase={phase}
          >
            <TimerDisplay seconds={remainingSeconds} status={status} />
          </CircularProgress>

          {/* Session indicator */}
          <SessionIndicator
            currentIndex={sessionIndexInCycle}
            sessionsBeforeLongBreak={activePreset.sessionsBeforeLongBreak}
            phase={phase}
          />

          {/* Controls */}
          <TimerControls />

          {/* Today's top priority */}
          {topPriority && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] max-w-xs text-center"
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>{topPriority}</span>
            </motion.div>
          )}

          {/* Keyboard shortcuts hint */}
          {status === 'idle' && (
            <p className="text-xs text-[var(--muted-foreground)]">
              Press <kbd className="px-1 py-0.5 rounded border border-[var(--border)] font-mono text-xs">Space</kbd> to start
            </p>
          )}
        </motion.div>
      )}

      {/* Distraction FAB */}
      <DistractionFAB />
    </div>
  )
}
