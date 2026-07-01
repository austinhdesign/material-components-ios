'use client'
import { create } from 'zustand'
import type { DistractionEntry, DistractionCategory } from '@/types/distraction'
import * as distractionService from '@/services/distractionService'
import { getTodayString } from '@/utils/dateUtils'

interface DistractionState {
  todaysDistractions: DistractionEntry[]
  showLogModal: boolean
  isLoaded: boolean
  loadTodaysDistractions: () => Promise<void>
  logDistraction: (sessionId: string | null, category: DistractionCategory, note: string) => Promise<void>
  openModal: () => void
  closeModal: () => void
}

function generateId(): string {
  return `d-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useDistractionStore = create<DistractionState>()((set) => ({
  todaysDistractions: [],
  showLogModal: false,
  isLoaded: false,

  loadTodaysDistractions: async () => {
    try {
      const distractions = await distractionService.getDistractionsByDate(getTodayString())
      set({ todaysDistractions: distractions, isLoaded: true })
    } catch {
      set({ isLoaded: true })
    }
  },

  logDistraction: async (sessionId, category, note) => {
    const entry: DistractionEntry = {
      id: generateId(),
      sessionId,
      timestamp: Date.now(),
      category,
      note,
      date: getTodayString(),
    }
    await distractionService.addDistraction(entry)
    set((state) => ({ todaysDistractions: [...state.todaysDistractions, entry], showLogModal: false }))
  },

  openModal: () => set({ showLogModal: true }),
  closeModal: () => set({ showLogModal: false }),
}))
