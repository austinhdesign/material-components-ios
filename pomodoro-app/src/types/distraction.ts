export type DistractionCategory =
  | 'phone'
  | 'social-media'
  | 'email'
  | 'meeting'
  | 'notification'
  | 'random-thought'
  | 'other'

export interface DistractionEntry {
  id: string
  sessionId: string | null
  timestamp: number
  category: DistractionCategory
  note: string
  date: string
}
