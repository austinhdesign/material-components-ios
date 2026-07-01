import { getDB } from './db'
import type { DistractionEntry } from '@/types/distraction'

export async function addDistraction(entry: DistractionEntry): Promise<void> {
  const db = await getDB()
  await db.put('distractions', entry)
}

export async function getDistractionsByDate(date: string): Promise<DistractionEntry[]> {
  const db = await getDB()
  return db.getAllFromIndex('distractions', 'by-date', date)
}

export async function getDistractionsBySession(sessionId: string): Promise<DistractionEntry[]> {
  const db = await getDB()
  return db.getAllFromIndex('distractions', 'by-session', sessionId)
}
