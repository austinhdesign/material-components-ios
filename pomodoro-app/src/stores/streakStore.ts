'use client'
import { create } from 'zustand'
import type { StreakData, Achievement } from '@/types/streak'
import { ACHIEVEMENT_DEFINITIONS } from '@/constants/achievements'
import * as streakService from '@/services/streakService'
import * as sessionService from '@/services/sessionService'

interface StreakState {
  streakData: StreakData | null
  achievements: Achievement[]
  newlyUnlocked: Achievement[]
  isLoaded: boolean
  loadStreakData: () => Promise<void>
  recalculateStreaks: () => Promise<void>
  checkAchievements: (streakData: StreakData) => Promise<void>
  clearNewlyUnlocked: () => void
}

export const useStreakStore = create<StreakState>()((set, get) => ({
  streakData: null,
  achievements: ACHIEVEMENT_DEFINITIONS.map(a => ({ ...a })),
  newlyUnlocked: [],
  isLoaded: false,

  loadStreakData: async () => {
    try {
      const data = await streakService.getStreakData()
      if (data) {
        set({ streakData: data, isLoaded: true })
        await get().checkAchievements(data)
      } else {
        set({ isLoaded: true })
      }
    } catch {
      set({ isLoaded: true })
    }
  },

  recalculateStreaks: async () => {
    try {
      const allSessions = await sessionService.getAllSessions()
      const data = streakService.calculateStreaks(allSessions)
      await streakService.saveStreakData(data)
      set({ streakData: data })
      await get().checkAchievements(data)
    } catch (e) {
      console.error(e)
    }
  },

  checkAchievements: async (data) => {
    const currentAchievements = get().achievements
    const now = Date.now()
    const newlyUnlocked: Achievement[] = []

    const updated = currentAchievements.map(achievement => {
      if (achievement.unlockedAt !== null) return achievement

      let shouldUnlock = false
      switch (achievement.id) {
        case 'first-session': shouldUnlock = data.totalFocusSessions >= 1; break
        case 'sessions-10': shouldUnlock = data.totalFocusSessions >= 10; break
        case 'sessions-50': shouldUnlock = data.totalFocusSessions >= 50; break
        case 'sessions-100': shouldUnlock = data.totalFocusSessions >= 100; break
        case 'sessions-500': shouldUnlock = data.totalFocusSessions >= 500; break
        case 'streak-3': shouldUnlock = data.currentDailyStreak >= 3; break
        case 'streak-7': shouldUnlock = data.currentDailyStreak >= 7; break
        case 'streak-30': shouldUnlock = data.currentDailyStreak >= 30; break
        default: shouldUnlock = false; break
      }

      if (shouldUnlock) {
        const unlocked = { ...achievement, unlockedAt: now }
        newlyUnlocked.push(unlocked)
        return unlocked
      }
      return achievement
    })

    set({ achievements: updated, newlyUnlocked })
  },

  clearNewlyUnlocked: () => set({ newlyUnlocked: [] }),
}))
