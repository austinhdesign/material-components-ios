'use client'
import { create } from 'zustand'
import type { SessionPhase, FocusSession } from '@/types/session'
import type { TimerStatus, TimerSnapshot } from '@/types/timer'
import { getTodayString } from '@/utils/dateUtils'
import { safeLocalSet, safeLocalRemove } from '@/utils/storageUtils'
import * as sessionService from '@/services/sessionService'

const SNAPSHOT_KEY = 'timer-snapshot'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

interface TimerState {
  sessionId: string
  phase: SessionPhase
  status: TimerStatus
  startTime: number | null
  pausedAt: number | null
  totalPausedMs: number
  plannedDuration: number
  sessionIndexInCycle: number
  presetId: string
  remainingSeconds: number
  elapsedSeconds: number
  distractionCount: number
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsBeforeLongBreak: number
  initFromPreset: (preset: { id: string; focusDuration: number; shortBreakDuration: number; longBreakDuration: number; sessionsBeforeLongBreak: number }) => void
  start: () => void
  pause: () => void
  resume: () => void
  restart: () => void
  skip: () => void
  tick: () => Promise<void>
  incrementDistraction: () => void
  restoreFromSnapshot: (snap: TimerSnapshot) => void
  persistSnapshot: () => void
  clearSnapshot: () => void
  advancePhase: (completedPhase: SessionPhase, currentIndex: number) => void
}

export const useTimerStore = create<TimerState>()((set, get) => {
  const advancePhase = (completedPhase: SessionPhase, currentIndex: number) => {
    const state = get()
    let nextPhase: SessionPhase
    let nextIndex = currentIndex
    let nextPlanned: number

    if (completedPhase === 'focus') {
      const newIndex = currentIndex + 1
      if (newIndex >= state.sessionsBeforeLongBreak) {
        nextPhase = 'long-break'
        nextIndex = 0
        nextPlanned = state.longBreakDuration
      } else {
        nextPhase = 'short-break'
        nextIndex = newIndex
        nextPlanned = state.shortBreakDuration
      }
    } else {
      nextPhase = 'focus'
      nextIndex = currentIndex
      nextPlanned = state.focusDuration
    }

    set({
      phase: nextPhase,
      sessionIndexInCycle: nextIndex,
      plannedDuration: nextPlanned,
      remainingSeconds: nextPlanned,
      elapsedSeconds: 0,
      status: 'idle',
      startTime: null,
      pausedAt: null,
      totalPausedMs: 0,
      sessionId: generateId(),
      distractionCount: 0,
    })
    safeLocalRemove(SNAPSHOT_KEY)
  }

  return {
    sessionId: generateId(),
    phase: 'focus',
    status: 'idle',
    startTime: null,
    pausedAt: null,
    totalPausedMs: 0,
    plannedDuration: 25 * 60,
    sessionIndexInCycle: 0,
    presetId: 'classic',
    remainingSeconds: 25 * 60,
    elapsedSeconds: 0,
    distractionCount: 0,
    focusDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    sessionsBeforeLongBreak: 4,

    initFromPreset: (preset) => {
      const state = get()
      if (state.status !== 'idle') return
      set({
        presetId: preset.id,
        focusDuration: preset.focusDuration,
        shortBreakDuration: preset.shortBreakDuration,
        longBreakDuration: preset.longBreakDuration,
        sessionsBeforeLongBreak: preset.sessionsBeforeLongBreak,
        plannedDuration: preset.focusDuration,
        remainingSeconds: preset.focusDuration,
        phase: 'focus',
        sessionId: generateId(),
      })
    },

    start: () => {
      set((state) => ({
        startTime: Date.now(),
        status: 'running',
        totalPausedMs: 0,
        pausedAt: null,
        sessionId: state.status === 'idle' ? generateId() : state.sessionId,
      }))
      get().persistSnapshot()
    },

    pause: () => {
      set({ pausedAt: Date.now(), status: 'paused' })
      get().persistSnapshot()
    },

    resume: () => {
      const state = get()
      if (state.pausedAt === null) return
      set({
        totalPausedMs: state.totalPausedMs + (Date.now() - state.pausedAt),
        pausedAt: null,
        status: 'running',
      })
      get().persistSnapshot()
    },

    restart: () => {
      const state = get()
      set({
        sessionId: generateId(),
        startTime: Date.now(),
        totalPausedMs: 0,
        pausedAt: null,
        status: 'running',
        remainingSeconds: state.plannedDuration,
        elapsedSeconds: 0,
        distractionCount: 0,
      })
      get().persistSnapshot()
    },

    skip: () => {
      const state = get()
      if (state.status === 'idle') return
      const now = Date.now()
      const actualDuration = state.startTime
        ? Math.floor((now - state.startTime - state.totalPausedMs) / 1000)
        : 0
      const session: FocusSession = {
        id: state.sessionId,
        startTime: state.startTime ?? now,
        endTime: now,
        plannedDuration: state.plannedDuration,
        actualDuration,
        phase: state.phase,
        status: 'skipped',
        focusRating: null,
        reflectionNote: null,
        presetId: state.presetId,
        distractionCount: state.distractionCount,
        date: getTodayString(),
      }
      sessionService.addSession(session).catch(console.error)
      advancePhase(state.phase, state.sessionIndexInCycle)
    },

    tick: async () => {
      const state = get()
      if (state.status !== 'running' || state.startTime === null) return

      const now = Date.now()
      const elapsed = Math.floor((now - state.startTime - state.totalPausedMs) / 1000)
      const remaining = Math.max(0, state.plannedDuration - elapsed)

      if (remaining === 0) {
        const session: FocusSession = {
          id: state.sessionId,
          startTime: state.startTime,
          endTime: now,
          plannedDuration: state.plannedDuration,
          actualDuration: state.plannedDuration,
          phase: state.phase,
          status: 'completed',
          focusRating: null,
          reflectionNote: null,
          presetId: state.presetId,
          distractionCount: state.distractionCount,
          date: getTodayString(),
        }
        try { await sessionService.addSession(session) } catch (e) { console.error(e) }
        set({ remainingSeconds: 0, elapsedSeconds: state.plannedDuration, status: 'completed' })
        setTimeout(() => advancePhase(state.phase, state.sessionIndexInCycle), 1500)
      } else {
        set({ remainingSeconds: remaining, elapsedSeconds: elapsed })
      }
    },

    incrementDistraction: () => {
      set((state) => ({ distractionCount: state.distractionCount + 1 }))
    },

    advancePhase,

    restoreFromSnapshot: (snap) => {
      const now = Date.now()
      let remainingSeconds = snap.plannedDuration

      if (snap.status === 'running' && snap.startTime !== null) {
        const elapsed = Math.floor((now - snap.startTime - snap.totalPausedMs) / 1000)
        remainingSeconds = Math.max(0, snap.plannedDuration - elapsed)
        if (remainingSeconds === 0) {
          set({ ...snap, status: 'idle', remainingSeconds: 0, elapsedSeconds: snap.plannedDuration })
          advancePhase(snap.phase, snap.sessionIndexInCycle)
          return
        }
      } else if (snap.status === 'paused' && snap.startTime !== null && snap.pausedAt !== null) {
        const elapsed = Math.floor((snap.pausedAt - snap.startTime - snap.totalPausedMs) / 1000)
        remainingSeconds = Math.max(0, snap.plannedDuration - elapsed)
      }

      const current = get()
      set({
        ...snap,
        remainingSeconds,
        elapsedSeconds: snap.plannedDuration - remainingSeconds,
        distractionCount: 0,
        focusDuration: current.focusDuration,
        shortBreakDuration: current.shortBreakDuration,
        longBreakDuration: current.longBreakDuration,
        sessionsBeforeLongBreak: current.sessionsBeforeLongBreak,
      })
    },

    persistSnapshot: () => {
      const state = get()
      const snap: TimerSnapshot = {
        sessionId: state.sessionId,
        phase: state.phase,
        status: state.status,
        startTime: state.startTime,
        pausedAt: state.pausedAt,
        totalPausedMs: state.totalPausedMs,
        plannedDuration: state.plannedDuration,
        sessionIndexInCycle: state.sessionIndexInCycle,
        presetId: state.presetId,
      }
      safeLocalSet(SNAPSHOT_KEY, snap)
    },

    clearSnapshot: () => safeLocalRemove(SNAPSHOT_KEY),
  }
})
