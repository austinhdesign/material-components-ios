'use client'
import { useState, useCallback } from 'react'
import * as notificationService from '@/services/notificationService'

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'denied'
  )

  const requestPermission = useCallback(async () => {
    const result = await notificationService.requestPermission()
    setPermission(result)
    return result
  }, [])

  const sendNotification = useCallback((title: string, body: string) => {
    notificationService.sendNotification(title, body)
  }, [])

  return { permission, requestPermission, sendNotification }
}
