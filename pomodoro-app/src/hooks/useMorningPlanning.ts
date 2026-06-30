'use client'
import { useEffect } from 'react'
import { usePlanningStore } from '@/stores/planningStore'
import { useSettingsStore } from '@/stores/settingsStore'

export function useMorningPlanning() {
  const { checkMorningPlanning, showMorningModal } = usePlanningStore()
  const { settings, isLoaded } = useSettingsStore()

  useEffect(() => {
    if (!isLoaded) return
    checkMorningPlanning(settings.showMorningPlanning).catch(console.error)
  }, [isLoaded, settings.showMorningPlanning, checkMorningPlanning])

  return { showMorningModal }
}
