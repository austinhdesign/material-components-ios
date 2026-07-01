'use client'
import { useMemo } from 'react'
import { useSessionStore } from '@/stores/sessionStore'
import { useDistractionStore } from '@/stores/distractionStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useStreakStore } from '@/stores/streakStore'
import { calculateProductivityScore } from '@/utils/scoreCalculator'

export function useProductivityScore(): number {
  const { todaysSessions, completedFocusCount } = useSessionStore()
  const { todaysDistractions } = useDistractionStore()
  const { settings } = useSettingsStore()
  const { streakData } = useStreakStore()

  return useMemo(() => {
    const focusSessions = todaysSessions.filter(s => s.phase === 'focus' && s.status === 'completed')
    const ratedSessions = focusSessions.filter(s => s.focusRating !== null)
    const avgFocusRating = ratedSessions.length > 0
      ? ratedSessions.reduce((sum, s) => sum + (s.focusRating ?? 0), 0) / ratedSessions.length
      : null
    const sessionHours = focusSessions.map(s => new Date(s.startTime).getHours())

    return calculateProductivityScore({
      completedFocusSessions: completedFocusCount,
      dailyGoal: settings.dailySessionGoal,
      avgFocusRating,
      distractionCount: todaysDistractions.length,
      sessionHours,
      currentStreak: streakData?.currentDailyStreak ?? 0,
    })
  }, [todaysSessions, completedFocusCount, todaysDistractions, settings.dailySessionGoal, streakData])
}
