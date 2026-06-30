'use client'
import { useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { MorningPlanningModal } from '@/components/modals/MorningPlanningModal'
import { SessionReflectionModal } from '@/components/modals/SessionReflectionModal'
import { useTheme } from '@/hooks/useTheme'
import { useMorningPlanning } from '@/hooks/useMorningPlanning'
import { usePlanningStore } from '@/stores/planningStore'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  useTheme()
  useMorningPlanning()

  const { showMorningModal, showReflectionModal, pendingReflectionSessionId, saveMorningPlan, dismissMorningModal, saveReflection, dismissReflection } = usePlanningStore()

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <BottomNav />
      </div>

      {/* Modals */}
      {showMorningModal && (
        <MorningPlanningModal
          open={showMorningModal}
          onSave={saveMorningPlan}
          onSkip={dismissMorningModal}
        />
      )}
      {showReflectionModal && pendingReflectionSessionId && (
        <SessionReflectionModal
          open={showReflectionModal}
          sessionId={pendingReflectionSessionId}
          onSave={saveReflection}
          onDismiss={dismissReflection}
        />
      )}
    </div>
  )
}
