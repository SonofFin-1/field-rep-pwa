import type { AppointmentStatus } from '@/data/types'

export const statusColors: Record<
  AppointmentStatus,
  { bg: string; text: string; border: string }
> = {
  pending: {
    bg: 'bg-[#F0F5F7]',
    text: 'text-[#778188]',
    border: 'border-[#DFEBF4]',
  },
  completed: {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#166534]',
    border: 'border-[#166534]',
  },
  overdue: {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#C08703]',
    border: 'border-[#C08703]',
  },
  'follow-up': {
    bg: 'bg-[#EBDBFE]',
    text: 'text-[#311EAF]',
    border: 'border-[#311EAF]',
  },
}

export function formatTime24to12(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatTime24to12(startTime)} - ${formatTime24to12(endTime)}`
}

export function getHourFromTime(time: string): number {
  return parseInt(time.split(':')[0], 10)
}

export function getMinutesFromTime(time: string): number {
  return parseInt(time.split(':')[1], 10)
}

export function isTimeInPast(date: string, time: string): boolean {
  const now = new Date()
  // Parse date as local time (not UTC) to avoid timezone issues
  const [year, month, day] = date.split('-').map(Number)
  const [hours, minutes] = time.split(':').map(Number)
  const eventDate = new Date(year, month - 1, day, hours, minutes, 0, 0)
  return eventDate < now
}

export function calculateEventPosition(
  startTime: string,
  startHour: number = 6
): number {
  const hour = getHourFromTime(startTime)
  const minutes = getMinutesFromTime(startTime)
  const totalMinutes = (hour - startHour) * 60 + minutes
  // Scale based on HOUR_HEIGHT_PX (pixels per 60 minutes)
  return totalMinutes * (HOUR_HEIGHT_PX / 60)
}

export function calculateEventHeight(
  startTime: string,
  endTime: string
): number {
  const startMinutes =
    getHourFromTime(startTime) * 60 + getMinutesFromTime(startTime)
  const endMinutes = getHourFromTime(endTime) * 60 + getMinutesFromTime(endTime)
  const durationMinutes = Math.max(endMinutes - startMinutes, 30) // Minimum 30 minutes
  // Scale based on HOUR_HEIGHT_PX (pixels per 60 minutes)
  return durationMinutes * (HOUR_HEIGHT_PX / 60)
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function getWeekDates(date: Date): Date[] {
  const dates: Date[] = []
  const day = date.getDay()
  const diff = date.getDate() - day

  for (let i = 0; i < 7; i++) {
    const weekDate = new Date(date)
    weekDate.setDate(diff + i)
    dates.push(weekDate)
  }

  return dates
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function formatShortDate(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return `${days[date.getDay()]} ${date.getDate()}`
}

export function formatFullDate(date: Date): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

export const TIMELINE_START_HOUR = 6
export const TIMELINE_END_HOUR = 21 // 9 PM
export const HOUR_HEIGHT_PX = 100
