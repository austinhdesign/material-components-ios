'use client'
import { create } from 'zustand'
import type { AppSettings, TimerPreset } from '@/types/settings'
import { TIMER_PRESETS, DEFAULT_PRESET_ID } from '@/constants/timerPresets'
import * as settingsService from '@/services/settingsService'

const DEFAULT_CUSTOM_PRESET: TimerPreset = {
  id: 'custom',
  name: 'Custom',
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  sessionsBeforeLongBreak: 4,
  isCustom: true,
}

const DEFAULT_SETTINGS: AppSettings = {
  activePresetId: DEFAULT_PRESET_ID,
  customPreset: DEFAULT_CUSTOM_PRESET,
  autoStartBreaks: true,
  autoStartFocus: false,
  showSessionReflection: true,
  showMorningPlanning: true,
  dailySessionGoal: 8,
  notificationsEnabled: false,
  notifyOnSessionComplete: true,
  notifyOnBreakComplete: true,
  soundEnabled: true,
  volume: 0.7,
  tickSoundEnabled: false,
  theme: 'system',
  showTimerInTitle: true,
  compactMode: false,
}

interface SettingsState {
  settings: AppSettings
  isLoaded: boolean
  activePreset: TimerPreset
  loadSettings: () => Promise<void>
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>
  setActivePreset: (presetId: string) => Promise<void>
  updateCustomPreset: (preset: Partial<TimerPreset>) => Promise<void>
  resetToDefaults: () => Promise<void>
}

function getActivePreset(settings: AppSettings): TimerPreset {
  if (settings.activePresetId === 'custom') return settings.customPreset
  return TIMER_PRESETS.find(p => p.id === settings.activePresetId) ?? TIMER_PRESETS[0]
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoaded: false,
  activePreset: getActivePreset(DEFAULT_SETTINGS),

  loadSettings: async () => {
    try {
      const saved = await settingsService.getSettings()
      if (saved) {
        set({ settings: saved, isLoaded: true, activePreset: getActivePreset(saved) })
      } else {
        set({ isLoaded: true })
      }
    } catch {
      set({ isLoaded: true })
    }
  },

  updateSettings: async (updates) => {
    const newSettings = { ...get().settings, ...updates }
    set({ settings: newSettings, activePreset: getActivePreset(newSettings) })
    await settingsService.saveSettings(newSettings)
  },

  setActivePreset: async (presetId) => {
    await get().updateSettings({ activePresetId: presetId })
  },

  updateCustomPreset: async (preset) => {
    const newCustomPreset = { ...get().settings.customPreset, ...preset }
    await get().updateSettings({ customPreset: newCustomPreset, activePresetId: 'custom' })
  },

  resetToDefaults: async () => {
    set({ settings: DEFAULT_SETTINGS, activePreset: getActivePreset(DEFAULT_SETTINGS) })
    await settingsService.saveSettings(DEFAULT_SETTINGS)
  },
}))
