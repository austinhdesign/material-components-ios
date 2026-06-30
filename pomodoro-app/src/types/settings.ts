export type ThemeMode = 'light' | 'dark' | 'system'

export interface TimerPreset {
  id: string
  name: string
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsBeforeLongBreak: number
  isCustom: boolean
}

export interface AppSettings {
  activePresetId: string
  customPreset: TimerPreset
  autoStartBreaks: boolean
  autoStartFocus: boolean
  showSessionReflection: boolean
  showMorningPlanning: boolean
  dailySessionGoal: number
  notificationsEnabled: boolean
  notifyOnSessionComplete: boolean
  notifyOnBreakComplete: boolean
  soundEnabled: boolean
  volume: number
  tickSoundEnabled: boolean
  theme: ThemeMode
  showTimerInTitle: boolean
  compactMode: boolean
}
