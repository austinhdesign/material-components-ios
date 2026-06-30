import type { TimerPreset } from '@/types/settings'

export const DEFAULT_PRESET_ID = 'classic'

export const TIMER_PRESETS: TimerPreset[] = [
  {
    id: 'classic',
    name: 'Classic',
    focusDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    sessionsBeforeLongBreak: 4,
    isCustom: false,
  },
  {
    id: 'deep-work',
    name: 'Deep Work',
    focusDuration: 50 * 60,
    shortBreakDuration: 10 * 60,
    longBreakDuration: 20 * 60,
    sessionsBeforeLongBreak: 3,
    isCustom: false,
  },
  {
    id: 'creative',
    name: 'Creative',
    focusDuration: 90 * 60,
    shortBreakDuration: 20 * 60,
    longBreakDuration: 30 * 60,
    sessionsBeforeLongBreak: 2,
    isCustom: false,
  },
]
