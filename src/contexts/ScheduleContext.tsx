import { createContext, useContext, useCallback, type ReactNode } from 'react'
import { useSchedules } from '@/hooks/useSchedules'
import { formatDateKey } from '@/lib/calendar-utils'
import type { PlanStop } from '@/data/types'

type SchedulesContextType = ReturnType<typeof useSchedules> & {
  syncStopCompletion: (leadId: string, date?: Date) => void
  syncPlanToCalendar: (stops: PlanStop[], date?: Date) => void
  updatePlanTimesOnCalendar: (stops: PlanStop[], date?: Date) => void
}

const SchedulesContext = createContext<SchedulesContextType | null>(null)

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
    (stops: PlanStop[], date?: Date) => {
      const dateKey = date ? formatDateKey(date) : formatDateKey(new Date())

      // Filter to only stops with leads (not commutes)
      const stopsWithLeads = stops.filter(stop => stop.lead && stop.type !== 'Commute')

      // Get existing events once before the loop
      const existingEvents = schedules.getEventsForDate(dateKey)
      const existingLeadIds = new Set(
        existingEvents.filter(e => e.leadId).map(e => e.leadId)
      )

      // Track leads we add in this batch to prevent duplicates
      const addedLeadIds = new Set<string>()

      stopsWithLeads.forEach(stop => {
        if (!stop.lead) return

        // Skip if this lead already has an event or was already added in this batch
        if (existingLeadIds.has(stop.lead.id) || addedLeadIds.has(stop.lead.id)) {
          return
        }

        // Parse time range (e.g., "9:00 AM-9:45 AM")
        const timeMatch = stop.timeRange.match(/(\d+):(\d+)\s*(AM|PM)/i)
        if (!timeMatch) return

        let hours = parseInt(timeMatch[1])
        const mins = timeMatch[2]
        const isPM = timeMatch[3].toUpperCase() === 'PM'

        if (isPM && hours !== 12) hours += 12
        if (!isPM && hours === 12) hours = 0

        const startTime = `${hours.toString().padStart(2, '0')}:${mins}`
        const endHour = hours + 1
        const endTime = `${endHour.toString().padStart(2, '0')}:${mins}`

        schedules.addEvent({
          title: stop.lead.name,
          leadId: stop.lead.id,
          leadName: stop.lead.name,
          address: stop.address,
          date: dateKey,
          startTime,
          endTime,
          type: 'appointment',
          notes: stop.notes || '',
        })

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

        // Parse time range (e.g., "9:00 AM-9:45 AM")
        const timeMatch = stop.timeRange.match(/(\d+):(\d+)\s*(AM|PM)/i)
        if (!timeMatch) return

        let hours = parseInt(timeMatch[1])
        const mins = timeMatch[2]
        const isPM = timeMatch[3].toUpperCase() === 'PM'

        if (isPM && hours !== 12) hours += 12
        if (!isPM && hours === 12) hours = 0

        const startTime = `${hours.toString().padStart(2, '0')}:${mins}`
        const endHour = hours + 1
        const endTime = `${endHour.toString().padStart(2, '0')}:${mins}`

        // Update the event with new times
        schedules.updateEvent(existingEvent.id, {
          startTime,
          endTime,
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
