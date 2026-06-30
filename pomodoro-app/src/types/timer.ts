import type { SessionPhase } from './session'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'

export interface TimerSnapshot {
  sessionId: string
  phase: SessionPhase
  status: TimerStatus
  startTime: number | null
  pausedAt: number | null
  totalPausedMs: number
  plannedDuration: number
  sessionIndexInCycle: number
  presetId: string
}
