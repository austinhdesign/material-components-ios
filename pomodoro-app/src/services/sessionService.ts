import { getDB } from './db'
import type { FocusSession } from '@/types/session'

export async function addSession(session: FocusSession): Promise<void> {
  const db = await getDB()
  await db.put('sessions', session)
}

export async function getSessionsByDate(date: string): Promise<FocusSession[]> {
  const db = await getDB()
  return db.getAllFromIndex('sessions', 'by-date', date)
}

export async function getSessionsByDateRange(startDate: string, endDate: string): Promise<FocusSession[]> {
  const db = await getDB()
  const all = await db.getAll('sessions')
  return all.filter(s => s.date >= startDate && s.date <= endDate)
}

export async function updateSession(id: string, updates: Partial<FocusSession>): Promise<void> {
  const db = await getDB()
  const existing = await db.get('sessions', id)
  if (existing) {
    await db.put('sessions', { ...existing, ...updates })
  }
}

export async function getAllSessions(): Promise<FocusSession[]> {
  const db = await getDB()
  return db.getAll('sessions')
}
