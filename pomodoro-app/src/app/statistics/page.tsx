'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSessionStore } from '@/stores/sessionStore'
import { useStreakStore } from '@/stores/streakStore'
import { useDistractionStore } from '@/stores/distractionStore'
import { useSettingsStore } from '@/stores/settingsStore'
import type { FocusSession } from '@/types/session'
import { getLast7Days, getLast30Days, getTodayString } from '@/utils/dateUtils'
import { formatHHMM } from '@/utils/timeFormat'
import { getAllSessions } from '@/services/sessionService'
import { ACHIEVEMENT_DEFINITIONS } from '@/constants/achievements'
import { cn } from '@/utils/cn'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Lazy load recharts components
const DailyChart = dynamic(() => import('@/components/statistics/DailyChart'), { ssr: false })
const WeeklyChart = dynamic(() => import('@/components/statistics/WeeklyChart'), { ssr: false })
const MonthlyChart = dynamic(() => import('@/components/statistics/MonthlyChart'), { ssr: false })
const DistractionBreakdown = dynamic(() => import('@/components/statistics/DistractionBreakdown'), { ssr: false })

export default function StatisticsPage() {
  const { todaysSessions, completedFocusCount, totalFocusMinutes } = useSessionStore()
  const { streakData, achievements } = useStreakStore()
  const { todaysDistractions } = useDistractionStore()
  const { settings } = useSettingsStore()
  const [allSessions, setAllSessions] = useState<FocusSession[]>([])

  useEffect(() => {
    getAllSessions().then(setAllSessions).catch(console.error)
  }, [])

  const todayFocusSessions = todaysSessions.filter(s => s.phase === 'focus' && s.status === 'completed')
  const ratedSessions = todayFocusSessions.filter(s => s.focusRating !== null)
  const avgRating = ratedSessions.length > 0
    ? ratedSessions.reduce((sum, s) => sum + (s.focusRating ?? 0), 0) / ratedSessions.length
    : null

  // Weekly stats
  const last7Days = getLast7Days()
  const weekSessions = allSessions.filter(s => last7Days.includes(s.date) && s.phase === 'focus' && s.status === 'completed')
  const weekMinutes = Math.floor(weekSessions.reduce((sum, s) => sum + s.actualDuration, 0) / 60)

  // Monthly stats
  const last30Days = getLast30Days()
  const monthSessions = allSessions.filter(s => last30Days.includes(s.date) && s.phase === 'focus' && s.status === 'completed')
  const monthMinutes = Math.floor(monthSessions.reduce((sum, s) => sum + s.actualDuration, 0) / 60)

  // All time
  const allFocus = allSessions.filter(s => s.phase === 'focus' && s.status === 'completed')
  const allMinutes = Math.floor(allFocus.reduce((sum, s) => sum + s.actualDuration, 0) / 60)

  function StatSummary({ sessions, minutes, distractionsCount }: { sessions: number; minutes: number; distractionsCount?: number }) {
    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{sessions}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Focus Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{formatHHMM(minutes)}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Focus Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{distractionsCount ?? 0}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Distractions</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const unlockedAchievements = achievements.filter(a => a.unlockedAt !== null)
  const lockedAchievements = achievements.filter(a => a.unlockedAt === null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Statistics</h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-0.5">Track your focus trends and progress</p>
      </div>

      <Tabs defaultValue="today">
        <TabsList className="w-full">
          <TabsTrigger value="today" className="flex-1">Today</TabsTrigger>
          <TabsTrigger value="week" className="flex-1">Week</TabsTrigger>
          <TabsTrigger value="month" className="flex-1">Month</TabsTrigger>
          <TabsTrigger value="all" className="flex-1">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4 mt-4">
          <StatSummary sessions={completedFocusCount} minutes={totalFocusMinutes} distractionsCount={todaysDistractions.length} />
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">Sessions by Hour</CardTitle></CardHeader>
            <CardContent>
              <DailyChart sessions={todaysSessions} />
            </CardContent>
          </Card>
          {todaysDistractions.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-sm font-medium">Distraction Types</CardTitle></CardHeader>
              <CardContent>
                <DistractionBreakdown distractions={todaysDistractions} />
              </CardContent>
            </Card>
          )}
          {avgRating !== null && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-[var(--muted-foreground)]">Average Focus Rating</p>
                <p className="text-2xl font-bold mt-1">{'⭐'.repeat(Math.round(avgRating))} {avgRating.toFixed(1)}/5</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="week" className="space-y-4 mt-4">
          <StatSummary sessions={weekSessions.length} minutes={weekMinutes} />
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">Sessions per Day (Last 7 Days)</CardTitle></CardHeader>
            <CardContent>
              <WeeklyChart sessions={allSessions} days={last7Days} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="space-y-4 mt-4">
          <StatSummary sessions={monthSessions.length} minutes={monthMinutes} />
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">Sessions per Day (Last 30 Days)</CardTitle></CardHeader>
            <CardContent>
              <MonthlyChart sessions={allSessions} days={last30Days} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-4">
          <StatSummary sessions={allFocus.length} minutes={allMinutes} />
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{streakData?.currentDailyStreak ?? 0}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Current Streak</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{streakData?.longestDailyStreak ?? 0}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Longest Streak</p>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Achievements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...unlockedAchievements, ...lockedAchievements].map(achievement => {
                const isUnlocked = achievement.unlockedAt !== null
                const Icon = (LucideIcons[achievement.icon as keyof typeof LucideIcons] ?? LucideIcons.Award) as LucideIcon
                return (
                  <Card key={achievement.id} className={cn(!isUnlocked && 'opacity-50')}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                        isUnlocked ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-[var(--muted)]'
                      )}>
                        <Icon className={cn('w-5 h-5', isUnlocked ? 'text-amber-600 dark:text-amber-400' : 'text-[var(--muted-foreground)]')} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{achievement.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{achievement.description}</p>
                        {isUnlocked && achievement.unlockedAt && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
