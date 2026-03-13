import { useState, useCallback, useEffect } from 'react'
import type { ScheduleEvent, AppointmentStatus } from '@/data/types'
import { calendarEvents } from '@/data/calendar-events'
import { isTimeInPast } from '@/lib/calendar-utils'

const STORAGE_KEY = 'field-rep-schedules'
const SEED_VERSION_KEY = 'field-rep-schedules-seed-version'
const CURRENT_SEED_VERSION = '4' // Bump this to re-seed static events

// Convert 12h time string (e.g., "9:00 AM") to 24h format (e.g., "09:00")
function parse12hTo24h(time: string): string {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return '09:00'

  let hours = parseInt(match[1])
  const mins = match[2]
  const isPM = match[3].toUpperCase() === 'PM'

  if (isPM && hours !== 12) hours += 12
  if (!isPM && hours === 12) hours = 0

  return `${hours.toString().padStart(2, '0')}:${mins}`
}

// Convert static CalendarEvent to ScheduleEvent format
function convertStaticEvents(): ScheduleEvent[] {
  return calendarEvents
    .filter(event => event.type !== 'plan') // Exclude "Plan • X Stops" events
    .filter(event => event.time) // Must have a time
    .map(event => {
      const startTime = parse12hTo24h(event.time!)
      // Assume 1 hour duration
      const startHour = parseInt(startTime.split(':')[0])
      const endHour = startHour + 1
      const endTime = `${endHour.toString().padStart(2, '0')}:${startTime.split(':')[1]}`

      // Extract name from title (e.g., "9:00 AM Sarah Mitchell" -> "Sarah Mitchell")
      const nameMatch = event.title.match(/\d+:\d+\s*(?:AM|PM)\s+(.+)/i)
      const name = nameMatch ? nameMatch[1] : event.title

      return {
        id: event.id,
        title: name,
        leadName: name,
        date: event.date,
        startTime,
        endTime,
        type: 'appointment' as const,
        status: 'pending' as AppointmentStatus,
      }
    })
}

function loadSchedules(): ScheduleEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const seedVersion = localStorage.getItem(SEED_VERSION_KEY)
    const staticEvents = convertStaticEvents()
    const staticIds = new Set(staticEvents.map(e => e.id))

    // If seed version changed or no version, re-seed
    if (seedVersion !== CURRENT_SEED_VERSION) {
      localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION)

      if (stored) {
        // Keep user-created events (those not in static list)
        const parsed = JSON.parse(stored) as ScheduleEvent[]
        const userEvents = parsed.filter(e => !staticIds.has(e.id))
        return [...staticEvents, ...userEvents]
      }

      return staticEvents
    }

    if (stored) {
      return JSON.parse(stored)
    }

    return staticEvents
  } catch {
    return convertStaticEvents()
  }
}

function saveSchedules(schedules: ScheduleEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules))
}

function generateId(): string {
  return `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function determineStatus(event: ScheduleEvent): AppointmentStatus {
  if (event.status === 'completed' || event.status === 'follow-up') {
    return event.status
  }
  if (isTimeInPast(event.date, event.endTime)) {
    return 'overdue'
  }
  return 'pending'
}

export function useSchedules() {
  const [schedules, setSchedules] = useState<ScheduleEvent[]>(() =>
    loadSchedules()
  )

  // Persist to localStorage when schedules change
  useEffect(() => {
    saveSchedules(schedules)
  }, [schedules])

  // Update overdue statuses periodically
  useEffect(() => {
    const updateOverdueStatuses = () => {
      setSchedules(prev =>
        prev.map(event => ({
          ...event,
          status: determineStatus(event),
        }))
      )
    }

    // Check every minute
    const interval = setInterval(updateOverdueStatuses, 60000)
    updateOverdueStatuses() // Initial check

    return () => clearInterval(interval)
  }, [])

  const getEventsForDate = useCallback(
    (date: string): ScheduleEvent[] => {
      return schedules
        .filter(event => event.date === date)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
    },
    [schedules]
  )

  const getEventsForDateRange = useCallback(
    (startDate: string, endDate: string): Map<string, ScheduleEvent[]> => {
      const eventsByDate = new Map<string, ScheduleEvent[]>()

      schedules.forEach(event => {
        if (event.date >= startDate && event.date <= endDate) {
          const existing = eventsByDate.get(event.date) || []
          eventsByDate.set(event.date, [...existing, event])
        }
      })

      // Sort events within each day
      eventsByDate.forEach((events, date) => {
        eventsByDate.set(
          date,
          events.sort((a, b) => a.startTime.localeCompare(b.startTime))
        )
      })

      return eventsByDate
    },
    [schedules]
  )

  const addEvent = useCallback(
    (
      event: Omit<ScheduleEvent, 'id' | 'status'>
    ): ScheduleEvent => {
      const newEvent: ScheduleEvent = {
        ...event,
        id: generateId(),
        status: 'pending',
      }

      // Determine initial status
      newEvent.status = determineStatus(newEvent)

      setSchedules(prev => [...prev, newEvent])
      return newEvent
    },
    []
  )

  const updateEvent = useCallback(
    (id: string, updates: Partial<Omit<ScheduleEvent, 'id'>>): void => {
      setSchedules(prev =>
        prev.map(event => {
          if (event.id !== id) return event
          const updated = { ...event, ...updates }
          // Recalculate status if not explicitly set
          if (!updates.status) {
            updated.status = determineStatus(updated)
          }
          return updated
        })
      )
    },
    []
  )

  const deleteEvent = useCallback((id: string): void => {
    setSchedules(prev => prev.filter(event => event.id !== id))
  }, [])

  const markComplete = useCallback((id: string): void => {
    setSchedules(prev =>
      prev.map(event =>
        event.id === id ? { ...event, status: 'completed' as const } : event
      )
    )
  }, [])

  const markFollowUp = useCallback((id: string): void => {
    setSchedules(prev =>
      prev.map(event =>
        event.id === id ? { ...event, status: 'follow-up' as const } : event
      )
    )
  }, [])

  const markPending = useCallback((id: string): void => {
    setSchedules(prev =>
      prev.map(event => {
        if (event.id !== id) return event
        const updated = { ...event, status: 'pending' as AppointmentStatus }
        updated.status = determineStatus(updated)
        return updated
      })
    )
  }, [])

  const findEventByLeadAndDate = useCallback(
    (leadId: string, date: string): ScheduleEvent | undefined => {
      return schedules.find(
        event => event.leadId === leadId && event.date === date
      )
    },
    [schedules]
  )

  const completeEventByLeadAndDate = useCallback(
    (leadId: string, date: string): void => {
      setSchedules(prev =>
        prev.map(event =>
          event.leadId === leadId && event.date === date
            ? { ...event, status: 'completed' as const }
            : event
        )
      )
    },
    []
  )

  // Reset all schedules to default state
  const resetAll = useCallback((): void => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(SEED_VERSION_KEY)
    // Reset to initial static events
    const initialEvents = convertStaticEvents()
    setSchedules(initialEvents)
    // Save the seed version so it doesn't re-seed on next load
    localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION)
  }, [])

  return {
    schedules,
    getEventsForDate,
    getEventsForDateRange,
    addEvent,
    updateEvent,
    deleteEvent,
    markComplete,
    markFollowUp,
    markPending,
    findEventByLeadAndDate,
    completeEventByLeadAndDate,
    resetAll,
  }
}

// Create a singleton instance for cross-component access
let schedulesInstance: ReturnType<typeof useSchedules> | null = null

export function getSchedulesInstance(): ReturnType<typeof useSchedules> | null {
  return schedulesInstance
}

export function setSchedulesInstance(
  instance: ReturnType<typeof useSchedules>
): void {
  schedulesInstance = instance
}
