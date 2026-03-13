import { useMemo } from 'react'
import { calendarEvents } from '@/data/calendar-events'
import type { CalendarEvent } from '@/data/types'

export function useCalendarEvents(
  month: number,
  year: number
): Map<string, CalendarEvent[]> {
  return useMemo(() => {
    const events = new Map<string, CalendarEvent[]>()

    calendarEvents.forEach(event => {
      const eventDate = new Date(event.date)
      if (eventDate.getMonth() + 1 === month && eventDate.getFullYear() === year) {
        const existing = events.get(event.date) || []
        events.set(event.date, [...existing, event])
      }
    })

    return events
  }, [month, year])
}
