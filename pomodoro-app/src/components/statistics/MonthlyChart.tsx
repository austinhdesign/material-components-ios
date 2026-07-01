'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { FocusSession } from '@/types/session'
import { format } from 'date-fns'

interface MonthlyChartProps {
  sessions: FocusSession[]
  days: string[] // YYYY-MM-DD strings, 30 entries
}

export default function MonthlyChart({ sessions, days }: MonthlyChartProps) {
  const data = days.map(date => {
    const daySessions = sessions.filter(
      s => s.date === date && s.phase === 'focus' && s.status === 'completed'
    )
    return {
      day: format(new Date(date + 'T12:00:00'), 'MMM d'),
      sessions: daySessions.length,
      minutes: Math.round(daySessions.reduce((sum, s) => sum + s.actualDuration, 0) / 60),
    }
  })

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          interval={4}
        />
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
        <Area
          type="monotone"
          dataKey="sessions"
          stroke="#ef4444"
          strokeWidth={2}
          fill="url(#sessionGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
