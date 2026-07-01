'use client'
import { useEffect, useRef } from 'react'
import { useTimerStore } from '@/stores/timerStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { safeLocalGet } from '@/utils/storageUtils'
import type { TimerSnapshot } from '@/types/timer'
import { formatTime } from '@/utils/timeFormat'

const SNAPSHOT_KEY = 'timer-snapshot'

export function useTimer() {
  const { tick, status, phase, remainingSeconds, restoreFromSnapshot, initFromPreset, persistSnapshot } = useTimerStore()
  const { settings, activePreset } = useSettingsStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasRestoredRef = useRef(false)

  // Restore snapshot on mount
  useEffect(() => {
    if (hasRestoredRef.current) return
    hasRestoredRef.current = true
    const snap = safeLocalGet<TimerSnapshot>(SNAPSHOT_KEY)
    if (snap) {
      restoreFromSnapshot(snap)
    }
  }, [restoreFromSnapshot])

  // Sync preset with timer when idle
  useEffect(() => {
    const timerStatus = useTimerStore.getState().status
    if (timerStatus === 'idle') {
      initFromPreset(activePreset)
    }
  }, [activePreset, initFromPreset])

  // Tick interval
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        tick().catch(console.error)
      }, 250)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [status, tick])

  // Update document title
  useEffect(() => {
    if (!settings.showTimerInTitle) {
      document.title = 'Pomodoro — Focus Timer'
      return
    }
    const phaseLabel = phase === 'focus' ? '🍅' : phase === 'short-break' ? '☕' : '🌿'
    document.title = `${phaseLabel} ${formatTime(remainingSeconds)} — Pomodoro`
  }, [remainingSeconds, phase, settings.showTimerInTitle])

  // Persist on status changes
  useEffect(() => {
    if (status === 'running' || status === 'paused') {
      persistSnapshot()
    }
  }, [status, persistSnapshot])

  return { status, phase, remainingSeconds }
}
