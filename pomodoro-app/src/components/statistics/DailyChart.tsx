'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { FocusSession } from '@/types/session'

interface DailyChartProps {
  sessions: FocusSession[]
}

export default function DailyChart({ sessions }: DailyChartProps) {
  // Create hourly buckets 0-23
  const hourlyCounts = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    sessions: 0,
    minutes: 0,
  }))

  sessions
    .filter(s => s.phase === 'focus' && s.status === 'completed')
    .forEach(s => {
      const hour = new Date(s.startTime).getHours()
      hourlyCounts[hour].sessions++
      hourlyCounts[hour].minutes += Math.round(s.actualDuration / 60)
    })

  // Only show hours 6-22 (trimmed) or all if sessions outside
  const hasOutOfRange = sessions.some(s => {
    const h = new Date(s.startTime).getHours()
    return h < 6 || h > 22
  })
  const data = hasOutOfRange ? hourlyCounts : hourlyCounts.slice(6, 23)

  if (sessions.filter(s => s.phase === 'focus' && s.status === 'completed').length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-[var(--muted-foreground)] text-sm">
        No focus sessions today yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="hour" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} interval={2} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--popover-foreground)',
            fontSize: '12px',
          }}
          formatter={(value) => [Number(value), 'Sessions']}
        />
        <Bar dataKey="sessions" fill="#ef4444" radius={[3, 3, 0, 0]} name="sessions" />
      </BarChart>
    </ResponsiveContainer>
  )
}
