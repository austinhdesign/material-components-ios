export interface MorningPlan {
  date: string
  priorities: [string, string, string]
  expectedPomodoros: number
  createdAt: number
}

export interface SessionReflection {
  sessionId: string
  focusRating: 1 | 2 | 3 | 4 | 5
  note: string
  submittedAt: number
}
