export type SessionPhase = 'focus' | 'short-break' | 'long-break'
export type SessionStatus = 'completed' | 'interrupted' | 'skipped'

export interface FocusSession {
  id: string
  startTime: number
  endTime: number
  plannedDuration: number
  actualDuration: number
  phase: SessionPhase
  status: SessionStatus
  focusRating: 1 | 2 | 3 | 4 | 5 | null
  reflectionNote: string | null
  presetId: string
  distractionCount: number
  date: string
}

export interface DailyStats {
  date: string
  focusSessions: number
  totalFocusMinutes: number
  breakSessions: number
  avgFocusRating: number | null
  distractionCount: number
  productivityScore: number | null
}
