'use client'
import { create } from 'zustand'
import type { MorningPlan } from '@/types/planning'
import { getTodayString } from '@/utils/dateUtils'
import { getDB } from '@/services/db'

interface PlanningState {
  todaysPlan: MorningPlan | null
  pendingReflectionSessionId: string | null
  showMorningModal: boolean
  showReflectionModal: boolean
  isLoaded: boolean
  loadTodaysPlan: () => Promise<void>
  checkMorningPlanning: (showMorningPlanning: boolean) => Promise<void>
  saveMorningPlan: (priorities: [string, string, string], expectedPomodoros: number) => Promise<void>
  triggerReflection: (sessionId: string) => void
  dismissReflection: () => void
  saveReflection: (sessionId: string, rating: 1|2|3|4|5, note: string) => Promise<void>
  dismissMorningModal: () => void
}

export const usePlanningStore = create<PlanningState>()((set, get) => ({
  todaysPlan: null,
  pendingReflectionSessionId: null,
  showMorningModal: false,
  showReflectionModal: false,
  isLoaded: false,

  loadTodaysPlan: async () => {
    try {
      const db = await getDB()
      const plan = await db.get('plans', getTodayString())
      set({ todaysPlan: plan ?? null, isLoaded: true })
    } catch {
      set({ isLoaded: true })
    }
  },

  checkMorningPlanning: async (showMorningPlanning) => {
    if (!showMorningPlanning) return
    await get().loadTodaysPlan()
    const plan = get().todaysPlan
    const hour = new Date().getHours()
    // Show morning planning if no plan exists today and it's before noon
    if (!plan && hour < 12) {
      set({ showMorningModal: true })
    }
  },

  saveMorningPlan: async (priorities, expectedPomodoros) => {
    const plan: MorningPlan = {
      date: getTodayString(),
      priorities,
      expectedPomodoros,
      createdAt: Date.now(),
    }
    const db = await getDB()
    await db.put('plans', plan)
    set({ todaysPlan: plan, showMorningModal: false })
  },

  triggerReflection: (sessionId) => {
    set({ pendingReflectionSessionId: sessionId, showReflectionModal: true })
  },

  dismissReflection: () => {
    set({ pendingReflectionSessionId: null, showReflectionModal: false })
  },

  saveReflection: async (sessionId, rating, note) => {
    const { updateSession } = await import('@/services/sessionService')
    await updateSession(sessionId, { focusRating: rating, reflectionNote: note })
    set({ pendingReflectionSessionId: null, showReflectionModal: false })
  },

  dismissMorningModal: () => {
    set({ showMorningModal: false })
  },
}))
