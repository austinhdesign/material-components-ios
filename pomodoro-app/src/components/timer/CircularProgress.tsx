'use client'
import { motion } from 'framer-motion'
import type { SessionPhase } from '@/types/session'
import { cn } from '@/utils/cn'

interface CircularProgressProps {
  progress: number // 0 to 1
  size?: number
  strokeWidth?: number
  phase: SessionPhase
  animated?: boolean
  children?: React.ReactNode
}

const PHASE_COLORS: Record<SessionPhase, string> = {
  'focus': '#ef4444',
  'short-break': '#10b981',
  'long-break': '#3b82f6',
}

export function CircularProgress({
  progress,
  size = 280,
  strokeWidth = 8,
  phase,
  animated = true,
  children,
}: CircularProgressProps) {
  const radius = (size - strokeWidth * 2) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - progress * circumference
  const color = PHASE_COLORS[phase]
  const center = size / 2

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-[var(--muted)] opacity-30"
        />
        {/* Progress */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={animated ? { duration: 0.5, ease: 'linear' } : { duration: 0 }}
          style={{ strokeDashoffset }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}
