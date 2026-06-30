'use client'
import { useEffect } from 'react'
import { useTimerStore } from '@/stores/timerStore'
import { useDistractionStore } from '@/stores/distractionStore'

export function useKeyboardShortcuts() {
  const { status, start, pause, resume, restart, skip } = useTimerStore()
  const { openModal } = useDistractionStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          if (status === 'idle') start()
          else if (status === 'running') pause()
          else if (status === 'paused') resume()
          break
        case 'KeyR':
          e.preventDefault()
          if (status !== 'idle') restart()
          break
        case 'KeyS':
          e.preventDefault()
          skip()
          break
        case 'KeyD':
          e.preventDefault()
          openModal()
          break
        case 'KeyF':
          e.preventDefault()
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(console.error)
          } else {
            document.documentElement.requestFullscreen().catch(console.error)
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [status, start, pause, resume, restart, skip, openModal])
}
