export interface ScoreInput {
  completedFocusSessions: number
  dailyGoal: number
  avgFocusRating: number | null
  distractionCount: number
  sessionHours: number[]
  currentStreak: number
}

export function calculateProductivityScore(input: ScoreInput): number {
  const { completedFocusSessions, dailyGoal, avgFocusRating, distractionCount, sessionHours, currentStreak } = input

  // sessionCompletion: 0-30 points
  const sessionCompletion = Math.min(30, (completedFocusSessions / Math.max(dailyGoal, 1)) * 30)

  // focusQuality: 0-25 points
  const focusQuality = avgFocusRating !== null
    ? (avgFocusRating / 5) * 25
    : 12.5

  // distractionPenalty: 0-20 points
  const distractionPenalty = Math.max(0, 20 - Math.min(20, distractionCount * 2))

  // consistencyBonus: 0-15 points (spread of sessions across hours)
  const uniqueHours = new Set(sessionHours).size
  const consistencyBonus = completedFocusSessions > 0
    ? Math.min(15, (uniqueHours / Math.min(completedFocusSessions, 8)) * 15)
    : 0

  // streakBonus: 0-10 points
  const streakBonus = currentStreak > 0
    ? (Math.log10(currentStreak + 1) / Math.log10(31)) * 10
    : 0

  const total = sessionCompletion + focusQuality + distractionPenalty + consistencyBonus + streakBonus
  return Math.round(Math.min(100, Math.max(0, total)))
}
