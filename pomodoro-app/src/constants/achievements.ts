import type { Achievement } from '@/types/streak'

export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  { id: 'first-session', name: 'First Step', description: 'Complete your very first focus session.', icon: 'Star', unlockedAt: null },
  { id: 'sessions-10', name: 'Getting Started', description: 'Complete 10 focus sessions.', icon: 'Zap', unlockedAt: null },
  { id: 'sessions-50', name: 'Committed', description: 'Complete 50 focus sessions.', icon: 'Target', unlockedAt: null },
  { id: 'sessions-100', name: 'Century', description: 'Complete 100 focus sessions.', icon: 'Award', unlockedAt: null },
  { id: 'sessions-500', name: 'Legend', description: 'Complete 500 focus sessions.', icon: 'Trophy', unlockedAt: null },
  { id: 'streak-3', name: 'On a Roll', description: 'Maintain a 3-day focus streak.', icon: 'Flame', unlockedAt: null },
  { id: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day focus streak.', icon: 'Flame', unlockedAt: null },
  { id: 'streak-30', name: 'Monthly Master', description: 'Maintain a 30-day focus streak.', icon: 'Crown', unlockedAt: null },
  { id: 'early-bird', name: 'Early Bird', description: 'Complete a focus session before 8am.', icon: 'Sunrise', unlockedAt: null },
  { id: 'night-owl', name: 'Night Owl', description: 'Complete a focus session after 10pm.', icon: 'Moon', unlockedAt: null },
  { id: 'deep-work', name: 'Deep Work', description: 'Complete 3 consecutive focus sessions without interruption.', icon: 'Brain', unlockedAt: null },
]
