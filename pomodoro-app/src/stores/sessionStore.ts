'use client'
import { create } from 'zustand'
import type { FocusSession } from '@/types/session'
import * as sessionService from '@/services/sessionService'
import { getTodayString } from '@/utils/dateUtils'

interface SessionState {
  todaysSessions: FocusSession[]
  isLoaded: boolean
  completedFocusCount: number
  totalFocusMinutes: number
  loadTodaysSessions: () => Promise<void>
  addSession: (session: FocusSession) => void
  updateSessionReflection: (sessionId: string, rating: 1|2|3|4|5, note: string) => Promise<void>
}

function computeStats(sessions: FocusSession[]) {
  const focusSessions = sessions.filter(s => s.phase === 'focus' && s.status === 'completed')
  return {
    completedFocusCount: focusSessions.length,
    totalFocusMinutes: Math.floor(focusSessions.reduce((sum, s) => sum + s.actualDuration, 0) / 60),
  }
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  todaysSessions: [],
  isLoaded: false,
  completedFocusCount: 0,
  totalFocusMinutes: 0,

  loadTodaysSessions: async () => {
    try {
      const sessions = await sessionService.getSessionsByDate(getTodayString())
      set({ todaysSessions: sessions, isLoaded: true, ...computeStats(sessions) })
    } catch {
      set({ isLoaded: true })
    }
  },

  addSession: (session) => {
    set((state) => {
      const updated = [...state.todaysSessions.filter(s => s.id !== session.id), session]
      return { todaysSessions: updated, ...computeStats(updated) }
    })
  },

  updateSessionReflection: async (sessionId, rating, note) => {
    await sessionService.updateSession(sessionId, { focusRating: rating, reflectionNote: note })
    set((state) => {
      const updated = state.todaysSessions.map(s =>
        s.id === sessionId ? { ...s, focusRating: rating, reflectionNote: note } : s
      )
      return { todaysSessions: updated, ...computeStats(updated) }
    })
  },
}))
