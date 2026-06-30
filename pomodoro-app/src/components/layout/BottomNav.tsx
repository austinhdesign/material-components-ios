'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Timer, BarChart2, Settings } from 'lucide-react'
import { cn } from '@/utils/cn'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/timer', icon: Timer, label: 'Timer' },
  { href: '/statistics', icon: BarChart2, label: 'Stats' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-stretch bg-[var(--card)] border-t border-[var(--border)] h-16">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
              isActive
                ? 'text-red-500'
                : 'text-[var(--muted-foreground)]'
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
