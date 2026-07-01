'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { DistractionEntry, DistractionCategory } from '@/types/distraction'
import { DISTRACTION_CATEGORIES } from '@/constants/distractionCategories'

interface DistractionBreakdownProps {
  distractions: DistractionEntry[]
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

export default function DistractionBreakdown({ distractions }: DistractionBreakdownProps) {
  // Count by category
  const counts: Partial<Record<DistractionCategory, number>> = {}
  distractions.forEach(d => {
    counts[d.category] = (counts[d.category] ?? 0) + 1
  })

  const data = Object.entries(counts)
    .map(([category, count]) => ({
      name: DISTRACTION_CATEGORIES[category as DistractionCategory]?.label ?? category,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-[var(--muted-foreground)] text-sm">
        No distractions recorded
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--popover-foreground)',
            fontSize: '12px',
          }}
          formatter={(value, name) => [Number(value), String(name)]}
        />
        <Legend
          formatter={(value: string) => <span style={{ color: 'var(--foreground)', fontSize: '12px' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
