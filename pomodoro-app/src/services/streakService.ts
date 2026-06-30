import { getDB } from './db'
import type { StreakData } from '@/types/streak'
import type { FocusSession } from '@/types/session'
import { getTodayString } from '@/utils/dateUtils'

const STREAK_KEY = 'streak-data'

export async function getStreakData(): Promise<StreakData | null> {
  try {
    const db = await getDB()
    return (await db.get('streaks', STREAK_KEY)) ?? null
  } catch {
    return null
  }
}

export async function saveStreakData(data: StreakData): Promise<void> {
  const db = await getDB()
  await db.put('streaks', data, STREAK_KEY)
}

export function calculateStreaks(sessions: FocusSession[]): StreakData {
  const focusSessions = sessions.filter(s => s.phase === 'focus' && s.status === 'completed')

  const totalFocusSessions = focusSessions.length
  const totalFocusMinutes = Math.floor(focusSessions.reduce((sum, s) => sum + s.actualDuration, 0) / 60)

  // Get unique dates with completed focus sessions
  const datesWithSessions = [...new Set(focusSessions.map(s => s.date))].sort()

  if (datesWithSessions.length === 0) {
    return {
      currentDailyStreak: 0,
      longestDailyStreak: 0,
      lastActiveDate: null,
      totalFocusSessions,
      totalFocusMinutes,
    }
  }

  const today = getTodayString()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  // Calculate streaks
  let longestStreak = 0
  let tempStreak = 1

  for (let i = 1; i < datesWithSessions.length; i++) {
    const prev = new Date(datesWithSessions[i - 1])
    const curr = new Date(datesWithSessions[i])
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      tempStreak++
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)

  const lastDate = datesWithSessions[datesWithSessions.length - 1]
  const currentStreak = (lastDate === today || lastDate === yesterdayStr) ? tempStreak : 0

  return {
    currentDailyStreak: currentStreak,
    longestDailyStreak: longestStreak,
    lastActiveDate: lastDate,
    totalFocusSessions,
    totalFocusMinutes,
  }
}
