'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WELLNESS_TIPS } from '@/constants/wellnessTips'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function WellnessTip() {
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * WELLNESS_TIPS.length))

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % WELLNESS_TIPS.length)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const tip = WELLNESS_TIPS[currentIndex]
  const Icon = (LucideIcons[tip.icon as keyof typeof LucideIcons] ?? LucideIcons.Heart) as LucideIcon

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="flex items-start gap-3 text-center max-w-xs"
      >
        <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p className="text-sm text-[var(--muted-foreground)] text-left leading-relaxed">{tip.text}</p>
      </motion.div>
    </AnimatePresence>
  )
}
