'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { FocusSession } from '@/types/session'
import { format, subDays, eachDayOfInterval } from 'date-fns'

interface FocusRatingChartProps {
  sessions: FocusSession[]
}

export default function FocusRatingChart({ sessions }: FocusRatingChartProps) {
  const today = new Date()
  const days = eachDayOfInterval({ start: subDays(today, 13), end: today })

  const data = days.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const daySessions = sessions.filter(
      s => s.date === dateStr && s.phase === 'focus' && s.status === 'completed' && s.focusRating !== null
    )
    const avgRating = daySessions.length > 0
      ? daySessions.reduce((sum, s) => sum + (s.focusRating ?? 0), 0) / daySessions.length
      : null
    return {
      day: format(date, 'MMM d'),
      rating: avgRating !== null ? parseFloat(avgRating.toFixed(1)) : null,
    }
  })

  const hasRatings = data.some(d => d.rating !== null)

  if (!hasRatings) {
    return (
      <div className="flex items-center justify-center h-32 text-[var(--muted-foreground)] text-sm">
        No rated sessions yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} interval={2} />
        <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
        <Tooltip
          contentStyle={{
            background: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--popover-foreground)',
            fontSize: '12px',
          }}
          formatter={(value) => [Number(value).toFixed(1), 'Avg Rating']}
        />
        <Line
          type="monotone"
          dataKey="rating"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ fill: '#f59e0b', r: 3 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
