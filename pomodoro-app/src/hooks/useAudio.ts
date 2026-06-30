'use client'
import { useRef, useCallback } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const { settings } = useSettingsStore()

  const getCtx = useCallback((): AudioContext | null => {
    if (!settings.soundEnabled) return null
    if (typeof window === 'undefined') return null
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return audioCtxRef.current
  }, [settings.soundEnabled])

  const playTone = useCallback((frequency: number, duration: number, volume: number, delay = 0) => {
    const ctx = getCtx()
    if (!ctx) return
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay)
    gainNode.gain.linearRampToValueAtTime(volume * settings.volume, ctx.currentTime + delay + 0.01)
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + duration)
    oscillator.start(ctx.currentTime + delay)
    oscillator.stop(ctx.currentTime + delay + duration + 0.1)
  }, [getCtx, settings.volume])

  const playSessionComplete = useCallback(() => {
    playTone(440, 0.3, 0.5, 0)
    playTone(554, 0.3, 0.5, 0.35)
    playTone(659, 0.5, 0.5, 0.7)
  }, [playTone])

  const playBreakComplete = useCallback(() => {
    playTone(330, 0.3, 0.4, 0)
    playTone(440, 0.4, 0.4, 0.35)
  }, [playTone])

  const playTick = useCallback(() => {
    if (!settings.tickSoundEnabled) return
    playTone(1000, 0.05, 0.05)
  }, [playTone, settings.tickSoundEnabled])

  return { playSessionComplete, playBreakComplete, playTick }
}
