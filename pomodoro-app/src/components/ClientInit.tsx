'use client'
import { useEffect } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { useSessionStore } from '@/stores/sessionStore'
import { useStreakStore } from '@/stores/streakStore'
import { useDistractionStore } from '@/stores/distractionStore'
import { usePlanningStore } from '@/stores/planningStore'

export function ClientInit() {
  const { loadSettings } = useSettingsStore()
  const { loadTodaysSessions } = useSessionStore()
  const { loadStreakData } = useStreakStore()
  const { loadTodaysDistractions } = useDistractionStore()
  const { loadTodaysPlan } = usePlanningStore()

  useEffect(() => {
    // Load all data from IndexedDB on mount
    loadSettings().catch(console.error)
    loadTodaysSessions().catch(console.error)
    loadStreakData().catch(console.error)
    loadTodaysDistractions().catch(console.error)
    loadTodaysPlan().catch(console.error)
  }, [loadSettings, loadTodaysSessions, loadStreakData, loadTodaysDistractions, loadTodaysPlan])

  return null
}
