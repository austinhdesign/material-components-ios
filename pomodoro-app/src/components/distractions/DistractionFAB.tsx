'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useDistractionStore } from '@/stores/distractionStore'
import { useTimerStore } from '@/stores/timerStore'
import { DistractionLoggerModal } from '@/components/modals/DistractionLoggerModal'

export function DistractionFAB() {
  const { status, phase, sessionId } = useTimerStore()
  const { showLogModal, openModal, closeModal, logDistraction } = useDistractionStore()

  const isVisible = status === 'running' && phase === 'focus'

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={openModal}
            className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-14 h-14 rounded-full bg-amber-500 text-white shadow-lg flex items-center justify-center z-30"
            aria-label="Log distraction (D)"
            title="Log distraction (D)"
          >
            <Zap className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {showLogModal && (
        <DistractionLoggerModal
          open={showLogModal}
          sessionId={sessionId}
          onClose={closeModal}
          onLog={logDistraction}
        />
      )}
    </>
  )
}
