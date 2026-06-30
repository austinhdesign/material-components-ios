export interface StreakData {
  currentDailyStreak: number
  longestDailyStreak: number
  lastActiveDate: string | null
  totalFocusSessions: number
  totalFocusMinutes: number
}

export type AchievementId =
  | 'first-session'
  | 'sessions-10'
  | 'sessions-50'
  | 'sessions-100'
  | 'sessions-500'
  | 'streak-3'
  | 'streak-7'
  | 'streak-30'
  | 'early-bird'
  | 'night-owl'
  | 'deep-work'

export interface Achievement {
  id: AchievementId
  name: string
  description: string
  icon: string
  unlockedAt: number | null
}
