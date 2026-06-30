import { getDB } from './db'
import type { AppSettings } from '@/types/settings'

export async function getSettings(): Promise<AppSettings | null> {
  try {
    const db = await getDB()
    const all = await db.getAll('settings')
    return all[0] ?? null
  } catch {
    return null
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await getDB()
  // Clear existing and put new
  const tx = db.transaction('settings', 'readwrite')
  await tx.store.clear()
  await tx.store.put(settings)
  await tx.done
}
