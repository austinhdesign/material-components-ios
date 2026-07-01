import { openDB, type IDBPDatabase } from 'idb'

interface PomodoroDBSchema {
  sessions: {
    key: string
    value: import('@/types/session').FocusSession
    indexes: { 'by-date': string; 'by-phase': string }
  }
  settings: {
    key: string
    value: import('@/types/settings').AppSettings
  }
  streaks: {
    key: string
    value: import('@/types/streak').StreakData
  }
  distractions: {
    key: string
    value: import('@/types/distraction').DistractionEntry
    indexes: { 'by-date': string; 'by-session': string }
  }
  plans: {
    key: string
    value: import('@/types/planning').MorningPlan
  }
  achievements: {
    key: string
    value: import('@/types/streak').Achievement
  }
}

let dbPromise: Promise<IDBPDatabase<PomodoroDBSchema>> | null = null

export function getDB(): Promise<IDBPDatabase<PomodoroDBSchema>> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB not available on server'))
  }
  if (!dbPromise) {
    dbPromise = openDB<PomodoroDBSchema>('pomodoro-app', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' })
          sessionStore.createIndex('by-date', 'date')
          sessionStore.createIndex('by-phase', 'phase')
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'activePresetId' })
        }
        if (!db.objectStoreNames.contains('streaks')) {
          db.createObjectStore('streaks')
        }
        if (!db.objectStoreNames.contains('distractions')) {
          const distractionStore = db.createObjectStore('distractions', { keyPath: 'id' })
          distractionStore.createIndex('by-date', 'date')
          distractionStore.createIndex('by-session', 'sessionId')
        }
        if (!db.objectStoreNames.contains('plans')) {
          db.createObjectStore('plans', { keyPath: 'date' })
        }
        if (!db.objectStoreNames.contains('achievements')) {
          db.createObjectStore('achievements', { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}
