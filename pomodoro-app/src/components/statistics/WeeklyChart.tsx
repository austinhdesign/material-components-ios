'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { FocusSession } from '@/types/session'
import { format } from 'date-fns'

interface WeeklyChartProps {
  sessions: FocusSession[]
  days: string[] // YYYY-MM-DD strings
}

export default function WeeklyChart({ sessions, days }: WeeklyChartProps) {
  const data = days.map(date => {
    const daySessions = sessions.filter(
      s => s.date === date && s.phase === 'focus' && s.status === 'completed'
    )
    return {
      day: format(new Date(date + 'T12:00:00'), 'EEE'),
      date,
      sessions: daySessions.length,
      minutes: Math.round(daySessions.reduce((sum, s) => sum + s.actualDuration, 0) / 60),
    }
  })

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
        <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--popover-foreground)',
            fontSize: '12px',
          }}
          formatter={(value) => [Number(value), 'Sessions']}
          labelFormatter={(label) => `Day: ${String(label)}`}
        />
        <Bar dataKey="sessions" fill="#ef4444" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
