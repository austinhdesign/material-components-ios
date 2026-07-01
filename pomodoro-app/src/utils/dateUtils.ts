import { format, startOfDay, isSameDay, startOfWeek, eachDayOfInterval, subDays, endOfDay, startOfMonth, endOfMonth } from 'date-fns'

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function getDayRange(date: Date): { start: Date; end: Date } {
  return { start: startOfDay(date), end: endOfDay(date) }
}

export function getWeekRange(date: Date): { start: Date; end: Date } {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  return { start, end: endOfDay(date) }
}

export function getMonthRange(date: Date): { start: Date; end: Date } {
  return { start: startOfMonth(date), end: endOfMonth(date) }
}

export function getLast7Days(): string[] {
  const today = new Date()
  return eachDayOfInterval({ start: subDays(today, 6), end: today }).map(getDateString)
}

export function getLast30Days(): string[] {
  const today = new Date()
  return eachDayOfInterval({ start: subDays(today, 29), end: today }).map(getDateString)
}

export function isSameDayDate(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2)
}
