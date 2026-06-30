'use client'
import Link from 'next/link'
import { useSessionStore } from '@/stores/sessionStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { usePlanningStore } from '@/stores/planningStore'
import { useDistractionStore } from '@/stores/distractionStore'
import { useStreakStore } from '@/stores/streakStore'
import { useTimerStore } from '@/stores/timerStore'
import { useProductivityScore } from '@/hooks/useProductivityScore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatHHMM, formatTimeOfDay } from '@/utils/timeFormat'
import {
  Target, Flame, Timer, Clock, Zap, Coffee, AlertCircle, TrendingUp, Play, CheckCircle2, XCircle
} from 'lucide-react'
import { cn } from '@/utils/cn'

export default function DashboardPage() {
  const { todaysSessions, completedFocusCount, totalFocusMinutes } = useSessionStore()
  const { settings } = useSettingsStore()
  const { todaysPlan } = usePlanningStore()
  const { todaysDistractions } = useDistractionStore()
  const { streakData } = useStreakStore()
  const { status } = useTimerStore()
  const score = useProductivityScore()

  const breakSessions = todaysSessions.filter(s => s.phase !== 'focus' && s.status === 'completed').length
  const goalProgress = Math.min(100, (completedFocusCount / settings.dailySessionGoal) * 100)
  const currentStreak = streakData?.currentDailyStreak ?? 0

  const scoreColor = score >= 91 ? 'text-emerald-500' : score >= 71 ? 'text-green-500' : score >= 41 ? 'text-yellow-500' : 'text-red-500'
  const scoreLabel = score >= 91 ? 'Excellent' : score >= 71 ? 'Great' : score >= 41 ? 'Good' : 'Needs Work'

  const isTimerActive = status === 'running' || status === 'paused'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {!isTimerActive && (
          <Link href="/timer">
            <Button className="gap-2">
              <Play className="w-4 h-4" />
              Start Focusing
            </Button>
          </Link>
        )}
      </div>

      {/* Today's priorities */}
      {todaysPlan && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-red-500" />
              Today&apos;s Priorities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {todaysPlan.priorities.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className={i === 0 ? 'font-medium' : 'text-[var(--muted-foreground)]'}>{p}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Focus Sessions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2">
              <Timer className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Focus Sessions</span>
            </div>
            <p className="text-3xl font-bold">{completedFocusCount}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">of {settings.dailySessionGoal} goal</p>
          </CardContent>
        </Card>

        {/* Total Focus Time */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Focus Time</span>
            </div>
            <p className="text-3xl font-bold">{formatHHMM(totalFocusMinutes)}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">hours:minutes</p>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Streak</span>
            </div>
            <p className="text-3xl font-bold">{currentStreak}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">day{currentStreak !== 1 ? 's' : ''}</p>
          </CardContent>
        </Card>

        {/* Productivity Score */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Score</span>
            </div>
            <p className={cn('text-3xl font-bold', scoreColor)}>{score}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">{scoreLabel}</p>
          </CardContent>
        </Card>
      </div>

      {/* Goal progress */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-[var(--muted-foreground)]" />
              Daily Goal Progress
            </span>
            <span className="text-sm font-bold">{completedFocusCount}/{settings.dailySessionGoal}</span>
          </div>
          <Progress value={goalProgress} className="h-2" />
          <p className="text-xs text-[var(--muted-foreground)]">{Math.round(goalProgress)}% complete</p>
        </CardContent>
      </Card>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2">
              <Coffee className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Breaks Taken</span>
            </div>
            <p className="text-2xl font-bold">{breakSessions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Distractions</span>
            </div>
            <p className="text-2xl font-bold">{todaysDistractions.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent sessions timeline */}
      {todaysSessions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...todaysSessions].reverse().slice(0, 5).map(session => (
                <div key={session.id} className="flex items-center gap-3 text-sm">
                  <div className="shrink-0">
                    {session.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : session.status === 'skipped' ? (
                      <XCircle className="w-4 h-4 text-[var(--muted-foreground)]" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium capitalize">
                      {session.phase === 'focus' ? 'Focus' : session.phase === 'short-break' ? 'Short Break' : 'Long Break'}
                    </span>
                    <span className="text-[var(--muted-foreground)] ml-2">
                      {formatTimeOfDay(session.startTime)} – {formatTimeOfDay(session.endTime)}
                    </span>
                  </div>
                  <Badge
                    variant={session.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {session.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
