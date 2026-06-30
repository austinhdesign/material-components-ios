import type { DistractionCategory } from '@/types/distraction'

export const DISTRACTION_CATEGORIES: Record<DistractionCategory, { label: string; icon: string }> = {
  phone: { label: 'Phone', icon: 'Smartphone' },
  'social-media': { label: 'Social Media', icon: 'Share2' },
  email: { label: 'Email', icon: 'Mail' },
  meeting: { label: 'Meeting', icon: 'Users' },
  notification: { label: 'Notification', icon: 'Bell' },
  'random-thought': { label: 'Random Thought', icon: 'Lightbulb' },
  other: { label: 'Other', icon: 'MoreHorizontal' },
}
