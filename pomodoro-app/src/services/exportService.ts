import { getDB } from './db'

export async function exportAllData(): Promise<string> {
  const db = await getDB()
  const [sessions, settings, distractions, plans, achievements] = await Promise.all([
    db.getAll('sessions'),
    db.getAll('settings'),
    db.getAll('distractions'),
    db.getAll('plans'),
    db.getAll('achievements'),
  ])
  const streaks = await db.get('streaks', 'streak-data')
  return JSON.stringify({
    version: 1,
    exportedAt: Date.now(),
    sessions,
    settings: settings[0] ?? null,
    streaks: streaks ?? null,
    distractions,
    plans,
    achievements,
  }, null, 2)
}

export async function importAllData(json: string): Promise<void> {
  const data = JSON.parse(json) as {
    version: number
    sessions: import('@/types/session').FocusSession[]
    settings: import('@/types/settings').AppSettings | null
    streaks: import('@/types/streak').StreakData | null
    distractions: import('@/types/distraction').DistractionEntry[]
    plans: import('@/types/planning').MorningPlan[]
    achievements: import('@/types/streak').Achievement[]
  }
  if (data.version !== 1) throw new Error('Unsupported data version')

  const db = await getDB()
  const tx = db.transaction(['sessions', 'settings', 'streaks', 'distractions', 'plans', 'achievements'], 'readwrite')

  await tx.objectStore('sessions').clear()
  await tx.objectStore('settings').clear()
  await tx.objectStore('distractions').clear()
  await tx.objectStore('plans').clear()
  await tx.objectStore('achievements').clear()

  for (const session of data.sessions) {
    await tx.objectStore('sessions').put(session)
  }
  if (data.settings) await tx.objectStore('settings').put(data.settings)
  if (data.streaks) await tx.objectStore('streaks').put(data.streaks, 'streak-data')
  for (const d of data.distractions) await tx.objectStore('distractions').put(d)
  for (const p of data.plans) await tx.objectStore('plans').put(p)
  for (const a of data.achievements) await tx.objectStore('achievements').put(a)

  await tx.done
}
