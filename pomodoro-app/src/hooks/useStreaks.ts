'use client'
import { useStreakStore } from '@/stores/streakStore'

export function useStreaks() {
  const { streakData, achievements, newlyUnlocked, recalculateStreaks, clearNewlyUnlocked } = useStreakStore()

  const unlockedAchievements = achievements.filter(a => a.unlockedAt !== null)
  const lockedAchievements = achievements.filter(a => a.unlockedAt === null)

  return {
    streakData,
    achievements,
    unlockedAchievements,
    lockedAchievements,
    newlyUnlocked,
    recalculateStreaks,
    clearNewlyUnlocked,
    currentStreak: streakData?.currentDailyStreak ?? 0,
    longestStreak: streakData?.longestDailyStreak ?? 0,
    totalSessions: streakData?.totalFocusSessions ?? 0,
    totalMinutes: streakData?.totalFocusMinutes ?? 0,
  }
}
