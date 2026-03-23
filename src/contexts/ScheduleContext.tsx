import { createContext, useContext, useCallback, type ReactNode } from 'react'
import { useSchedules } from '@/hooks/useSchedules'
import { formatDateKey } from '@/lib/calendar-utils'
import type { PlanStop } from '@/data/types'

type SchedulesContextType = ReturnType<typeof useSchedules> & {
  syncStopCompletion: (leadId: string, date?: Date) => void
  syncPlanToCalendar: (stops: PlanStop[], date?: Date, options?: { replaceExisting?: boolean }) => void
  updatePlanTimesOnCalendar: (stops: PlanStop[], date?: Date) => void
}

const SchedulesContext = createContext<SchedulesContextType | null>(null)

// Parse a time range string like "9:00 AM-10:30 AM" into 24-hour format times
function parseTimeRange(timeRange: string): { startTime: string; endTime: string } | null {
  // Match both start and end times from format like "9:00 AM-10:30 AM"
  const regex = /(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/i
  const match = timeRange.match(regex)

  if (!match) return null

  // Parse start time
  let startHours = parseInt(match[1])
  const startMins = match[2]
  const startIsPM = match[3].toUpperCase() === 'PM'
  if (startIsPM && startHours !== 12) startHours += 12
  if (!startIsPM && startHours === 12) startHours = 0

  // Parse end time
  let endHours = parseInt(match[4])
  const endMins = match[5]
  const endIsPM = match[6].toUpperCase() === 'PM'
  if (endIsPM && endHours !== 12) endHours += 12
  if (!endIsPM && endHours === 12) endHours = 0

  return {
    startTime: `${startHours.toString().padStart(2, '0')}:${startMins}`,
    endTime: `${endHours.toString().padStart(2, '0')}:${endMins}`,
  }
}

export function SchedulesProvider({ children }: { children: ReactNode }) {
  const schedules = useSchedules()

  const syncStopCompletion = useCallback(
    (leadId: string, date?: Date) => {
      const dateKey = date ? formatDateKey(date) : formatDateKey(new Date())
      schedules.completeEventByLeadAndDate(leadId, dateKey)
    },
    [schedules]
  )

  // Sync plan stops to calendar
  const syncPlanToCalendar = useCallback(
    (stops: PlanStop[], date?: Date, options?: { replaceExisting?: boolean }) => {
      const dateKey = date ? formatDateKey(date) : formatDateKey(new Date())
      const replaceExisting = options?.replaceExisting ?? false

      // Filter to only stops with leads (not commutes)
      const stopsWithLeads = stops.filter(stop => stop.lead && stop.type !== 'Commute')

      // Get the set of lead IDs that should be in the plan
      const planLeadIds = new Set(stopsWithLeads.map(s => s.lead!.id))

      // Get existing events once before the loop
      const existingEvents = schedules.getEventsForDate(dateKey)

      // If replaceExisting, remove events for leads NOT in the new plan (and not completed)
      if (replaceExisting) {
        existingEvents.forEach(event => {
          if (event.leadId && !planLeadIds.has(event.leadId) && event.status !== 'completed') {
            schedules.deleteEvent(event.id)
          }
        })
      }

      // Re-fetch existing events after deletions
      const currentEvents = schedules.getEventsForDate(dateKey)

      // Track leads we add in this batch to prevent duplicates
      const addedLeadIds = new Set<string>()

      stopsWithLeads.forEach(stop => {
        if (!stop.lead) return

        // Check if this lead already has an event
        const existingEvent = currentEvents.find(e => e.leadId === stop.lead!.id)

        if (existingEvent) {
          // Update completion status if stop is completed but event isn't
          if (stop.isCompleted && existingEvent.status !== 'completed') {
            schedules.updateEvent(existingEvent.id, { status: 'completed' })
          }
          return
        }

        // Skip if already added in this batch
        if (addedLeadIds.has(stop.lead.id)) {
          return
        }

        // Parse time range (e.g., "9:00 AM-9:45 AM")
        const times = parseTimeRange(stop.timeRange)
        if (!times) return

        const newEvent = schedules.addEvent({
          title: stop.lead.name,
          leadId: stop.lead.id,
          leadName: stop.lead.name,
          address: stop.address,
          date: dateKey,
          startTime: times.startTime,
          endTime: times.endTime,
          type: 'appointment',
          notes: stop.notes || '',
        })

        // If the stop is already completed, update the new event's status
        if (stop.isCompleted) {
          schedules.updateEvent(newEvent.id, { status: 'completed' })
        }

        // Track that we added this lead
        addedLeadIds.add(stop.lead.id)
      })
    },
    [schedules]
  )

  // Update calendar event times when plan is reordered
  const updatePlanTimesOnCalendar = useCallback(
    (stops: PlanStop[], date?: Date) => {
      const dateKey = date ? formatDateKey(date) : formatDateKey(new Date())

      // Filter to only stops with leads (not commutes)
      const stopsWithLeads = stops.filter(stop => stop.lead && stop.type !== 'Commute')

      // Get existing events for today
      const existingEvents = schedules.getEventsForDate(dateKey)

      stopsWithLeads.forEach(stop => {
        if (!stop.lead) return

        // Find existing event for this lead
        const existingEvent = existingEvents.find(e => e.leadId === stop.lead!.id)
        if (!existingEvent) return

        // Parse time range (e.g., "9:00 AM-10:30 AM")
        const times = parseTimeRange(stop.timeRange)
        if (!times) return

        // Update the event with new times and completion status
        schedules.updateEvent(existingEvent.id, {
          startTime: times.startTime,
          endTime: times.endTime,
          status: stop.isCompleted ? 'completed' : existingEvent.status,
        })
      })
    },
    [schedules]
  )

  return (
    <SchedulesContext.Provider value={{ ...schedules, syncStopCompletion, syncPlanToCalendar, updatePlanTimesOnCalendar }}>
      {children}
    </SchedulesContext.Provider>
  )
}

export function useSchedulesContext(): SchedulesContextType {
  const context = useContext(SchedulesContext)
  if (!context) {
    throw new Error('useSchedulesContext must be used within a SchedulesProvider')
  }
  return context
}
