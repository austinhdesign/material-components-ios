'use client'
import { motion, AnimatePresence } from 'framer-motion'
import type { SessionPhase } from '@/types/session'
import { cn } from '@/utils/cn'

interface PhaseLabelProps {
  phase: SessionPhase
}

const PHASE_CONFIG: Record<SessionPhase, { label: string; className: string }> = {
  'focus': {
    label: 'Focus',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  'short-break': {
    label: 'Short Break',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  'long-break': {
    label: 'Long Break',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
}

export function PhaseLabel({ phase }: PhaseLabelProps) {
  const config = PHASE_CONFIG[phase]

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={phase}
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider',
          config.className
        )}
      >
        {config.label}
      </motion.span>
    </AnimatePresence>
  )
}
