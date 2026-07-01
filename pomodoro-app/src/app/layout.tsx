import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/layout/AppShell'
import { ToastProvider } from '@/components/ui/toast'
import { ClientInit } from '@/components/ClientInit'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pomodoro — Focus Timer',
  description: 'A beautiful, distraction-free Pomodoro timer with streaks and analytics',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#ef4444',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ToastProvider>
          <ClientInit />
          <AppShell>
            {children}
          </AppShell>
        </ToastProvider>
      </body>
    </html>
  )
}
