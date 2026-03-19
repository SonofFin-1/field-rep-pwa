import { useState, useCallback, useMemo, useEffect } from 'react'
import type { PlanStop, Lead, StopOutcome } from '@/data/types'

const PLAN_STORAGE_KEY_PREFIX = 'field-rep-plan-'
const LEGACY_PLAN_STORAGE_KEY = 'field-rep-plan'

interface StoredPlan {
  stops: PlanStop[]
  createdDate: string
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function getPlanStorageKey(date: Date | string): string {
  const dateKey = typeof date === 'string' ? date : formatDateKey(date)
  return `${PLAN_STORAGE_KEY_PREFIX}${dateKey}`
}

function loadPlanFromStorage(date: Date): { stops: PlanStop[]; createdDate: Date } {
  try {
    const key = getPlanStorageKey(date)
    const stored = localStorage.getItem(key)
    if (stored) {
      const parsed: StoredPlan = JSON.parse(stored)
      return {
        stops: parsed.stops || [],
        createdDate: new Date(parsed.createdDate),
      }
    }
  } catch (e) {
    console.error('Failed to load plan from storage:', e)
  }
  return { stops: [], createdDate: new Date() }
}

function savePlanToStorage(stops: PlanStop[], createdDate: Date, planDate: Date): void {
  try {
    const key = getPlanStorageKey(planDate)
    const data: StoredPlan = {
      stops,
      createdDate: createdDate.toISOString(),
    }
    localStorage.setItem(key, JSON.stringify(data))
    // Dispatch custom event for same-tab listeners (e.g., Admin Dashboard)
    window.dispatchEvent(new CustomEvent('plan-updated', { detail: { key } }))
  } catch (e) {
    console.error('Failed to save plan to storage:', e)
  }
}

function clearPlanFromStorage(planDate: Date): void {
  try {
    const key = getPlanStorageKey(planDate)
    localStorage.removeItem(key)
  } catch (e) {
    console.error('Failed to clear plan from storage:', e)
  }
}

function migrateLegacyPlan(): void {
  try {
    const legacyData = localStorage.getItem(LEGACY_PLAN_STORAGE_KEY)
    if (legacyData) {
      // Validate the data can be parsed before migrating
      JSON.parse(legacyData) as StoredPlan
      // Migrate to today's date key
      const todayKey = getPlanStorageKey(new Date())
      // Only migrate if there's no plan for today already
      if (!localStorage.getItem(todayKey)) {
        localStorage.setItem(todayKey, legacyData)
      }
      // Remove legacy key
      localStorage.removeItem(LEGACY_PLAN_STORAGE_KEY)
      console.log('Migrated legacy plan to date-keyed storage')
    }
  } catch (e) {
    console.error('Failed to migrate legacy plan:', e)
  }
}

function hasPlanForDateKey(dateKey: string): boolean {
  try {
    const key = `${PLAN_STORAGE_KEY_PREFIX}${dateKey}`
    const stored = localStorage.getItem(key)
    if (stored) {
      const parsed: StoredPlan = JSON.parse(stored)
      return parsed.stops && parsed.stops.length > 0
    }
  } catch (e) {
    // Ignore errors
  }
  return false
}

function getAllPlanDateKeys(): string[] {
  const keys: string[] = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(PLAN_STORAGE_KEY_PREFIX)) {
        const dateKey = key.replace(PLAN_STORAGE_KEY_PREFIX, '')
        if (hasPlanForDateKey(dateKey)) {
          keys.push(dateKey)
        }
      }
    }
  } catch (e) {
    console.error('Failed to get plan date keys:', e)
  }
  return keys.sort()
}

// Work day: 8 AM to 6 PM (600 minutes)
// Client stop: 30 min, Commute: 15 min
// Pattern: Client (30) + Commute (15) = 45 min per cycle
const WORK_START_HOUR = 8
const CLIENT_DURATION = 30 // minutes
const COMMUTE_DURATION = 15 // minutes

function generateTimeRange(index: number): string {
  // Even indices are client stops, odd indices are commutes
  const isCommute = index % 2 === 1
  const cycleIndex = Math.floor(index / 2)

  // Calculate start time in minutes from work start
  const minutesFromStart = cycleIndex * (CLIENT_DURATION + COMMUTE_DURATION) +
    (isCommute ? CLIENT_DURATION : 0)

  const startHour = WORK_START_HOUR + Math.floor(minutesFromStart / 60)
  const startMin = minutesFromStart % 60

  const duration = isCommute ? COMMUTE_DURATION : CLIENT_DURATION
  const endMinutes = minutesFromStart + duration
  const endHour = WORK_START_HOUR + Math.floor(endMinutes / 60)
  const endMin = endMinutes % 60

  const formatTime = (hour: number, min: number) => {
    const h = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    return `${h}:${min.toString().padStart(2, '0')} ${ampm}`
  }

  return `${formatTime(startHour, startMin)}-${formatTime(endHour, endMin)}`
}

export function generateStopsFromLeads(selectedLeads: Lead[]): PlanStop[] {
  const stops: PlanStop[] = []

  selectedLeads.forEach((lead, index) => {
    // Add the stop for this lead
    stops.push({
      id: `stop-${index * 2 + 1}`,
      type: index === 0 ? 'Appointment' : 'Home Assessment',
      timeRange: generateTimeRange(index * 2),
      lead: lead,
      address: `${lead.address}, ${lead.city} ${lead.zip}`,
      notes: '',
      isCompleted: false,
    })

    // Add commute after each stop (except the last one)
    if (index < selectedLeads.length - 1) {
      const nextLead = selectedLeads[index + 1]
      stops.push({
        id: `stop-${index * 2 + 2}`,
        type: 'Commute',
        timeRange: generateTimeRange(index * 2 + 1),
        address: `${nextLead.address}, ${nextLead.city}`,
        isCompleted: false,
      })
    }
  })

  return stops
}

export function useMyPlan(initialDate?: Date) {
  // Migrate legacy plan on first load
  useEffect(() => {
    migrateLegacyPlan()
  }, [])

  // Plan date state - which date this plan is for
  const [planDate, setPlanDateState] = useState<Date>(() => initialDate || new Date())

  // Initialize from localStorage based on planDate
  const [stops, setStops] = useState<PlanStop[]>(() => loadPlanFromStorage(initialDate || new Date()).stops)
  const [createdDate, setCreatedDate] = useState<Date>(() => loadPlanFromStorage(initialDate || new Date()).createdDate)

  // Computed date key for the current plan date
  const planDateKey = useMemo(() => formatDateKey(planDate), [planDate])

  // Save to localStorage whenever stops change
  useEffect(() => {
    savePlanToStorage(stops, createdDate, planDate)
  }, [stops, createdDate, planDate])

  // Load plan when planDate changes
  const setPlanDate = useCallback((newDate: Date) => {
    setPlanDateState(newDate)
    const loaded = loadPlanFromStorage(newDate)
    setStops(loaded.stops)
    setCreatedDate(loaded.createdDate)
  }, [])

  // Check if a date has a plan
  const hasPlanForDate = useCallback((date: Date): boolean => {
    return hasPlanForDateKey(formatDateKey(date))
  }, [])

  // Get all dates that have plans
  const getDatesWithPlans = useCallback((): Date[] => {
    return getAllPlanDateKeys().map(parseDateKey)
  }, [])

  // Generate stops when selected leads change
  const createPlanFromLeads = useCallback((leads: Lead[], targetDate?: Date) => {
    const newStops = generateStopsFromLeads(leads)
    setStops(newStops)
    setCreatedDate(new Date())
    if (targetDate) {
      setPlanDateState(targetDate)
    }
  }, [])

  const completeStop = useCallback((stopId: string) => {
    setStops(prev =>
      prev.map(stop =>
        stop.id === stopId ? { ...stop, isCompleted: !stop.isCompleted } : stop
      )
    )
  }, [])

  // Complete stop with feedback and outcome (for Admin Dashboard integration)
  const completeStopWithFeedback = useCallback((
    stopId: string,
    outcome: StopOutcome,
    feedback: { notes: string; accuracyRating: number }
  ) => {
    const now = new Date()
    const completedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    setStops(prev =>
      prev.map(stop =>
        stop.id === stopId
          ? {
              ...stop,
              isCompleted: true,
              completedTime,
              outcome,
              feedback,
            }
          : stop
      )
    )
  }, [])

  const completeAllStops = useCallback(() => {
    setStops(prev =>
      prev.map(stop => ({ ...stop, isCompleted: true }))
    )
  }, [])

  const acceptRecommended = useCallback((stopId: string) => {
    setStops(prev =>
      prev.map(stop =>
        stop.id === stopId ? { ...stop, isRecommended: false } : stop
      )
    )
  }, [])

  const denyRecommended = useCallback((stopId: string) => {
    setStops(prev => prev.filter(stop => stop.id !== stopId))
  }, [])

  const addLeadToPlan = useCallback((lead: Lead) => {
    console.log('[useMyPlan] addLeadToPlan called with:', lead.name, lead.id)
    setStops(prev => {
      console.log('[useMyPlan] Current stops:', prev.length)
      // Check if lead is already in the plan
      if (prev.some(stop => stop.lead?.id === lead.id)) {
        console.log('[useMyPlan] Lead already in plan, skipping')
        return prev
      }

      // Find the last non-commute stop to get the next index
      const lastStopIndex = prev.filter(s => s.type !== 'Commute').length

      // Create new stop
      const newStop: PlanStop = {
        id: `stop-${Date.now()}`,
        type: 'Home Assessment',
        timeRange: generateTimeRange(lastStopIndex * 2),
        lead: lead,
        address: `${lead.address}, ${lead.city} ${lead.zip}`,
        notes: '',
        isCompleted: false,
      }

      // Add commute before the new stop if there are existing stops
      if (prev.length > 0) {
        const commuteStop: PlanStop = {
          id: `commute-${Date.now()}`,
          type: 'Commute',
          timeRange: generateTimeRange(lastStopIndex * 2 - 1),
          address: `${lead.address}, ${lead.city}`,
          isCompleted: false,
        }
        return [...prev, commuteStop, newStop]
      }

      return [...prev, newStop]
    })
  }, [])

  const routeCoordinates = useMemo(() => {
    return stops
      .filter(stop => stop.lead)
      .map(stop => ({
        lat: stop.lead!.lat,
        lng: stop.lead!.lng,
      }))
  }, [stops])

  const clearPlan = useCallback(() => {
    setStops([])
    setCreatedDate(new Date())
    clearPlanFromStorage(planDate)
  }, [planDate])

  // Remove a stop by lead ID (also removes associated commute)
  const removeStopByLeadId = useCallback((leadId: string, forDate?: Date) => {
    // If a specific date is provided and it's different from current planDate,
    // we need to load that plan, modify it, and save it back
    const targetDate = forDate || planDate

    if (forDate && formatDateKey(forDate) !== formatDateKey(planDate)) {
      // Load the plan for the specified date
      const loaded = loadPlanFromStorage(targetDate)
      const leadStops = loaded.stops.filter(s => s.type !== 'Commute' && s.lead?.id !== leadId)

      // Rebuild stops with commutes
      const newStops: PlanStop[] = []
      leadStops.forEach((stop, index) => {
        newStops.push({
          ...stop,
          timeRange: generateTimeRange(index * 2),
        })
        if (index < leadStops.length - 1) {
          const nextLead = leadStops[index + 1].lead
          newStops.push({
            id: `commute-${Date.now()}-${index}`,
            type: 'Commute',
            timeRange: generateTimeRange(index * 2 + 1),
            address: nextLead ? `${nextLead.address}, ${nextLead.city}` : '',
            isCompleted: false,
          })
        }
      })

      savePlanToStorage(newStops, loaded.createdDate, targetDate)
    } else {
      // Modify the current plan
      setStops(prev => {
        const leadStops = prev.filter(s => s.type !== 'Commute' && s.lead?.id !== leadId)

        // Rebuild stops with commutes
        const newStops: PlanStop[] = []
        leadStops.forEach((stop, index) => {
          newStops.push({
            ...stop,
            timeRange: generateTimeRange(index * 2),
          })
          if (index < leadStops.length - 1) {
            const nextLead = leadStops[index + 1].lead
            newStops.push({
              id: `commute-${Date.now()}-${index}`,
              type: 'Commute',
              timeRange: generateTimeRange(index * 2 + 1),
              address: nextLead ? `${nextLead.address}, ${nextLead.city}` : '',
              isCompleted: false,
            })
          }
        })

        return newStops
      })
    }
  }, [planDate])

  // Reorder stops (only non-commute stops) and recalculate times
  const reorderStops = useCallback((fromIndex: number, toIndex: number) => {
    setStops(prev => {
      // Get only the lead stops (non-commute)
      const leadStops = prev.filter(s => s.type !== 'Commute')

      // Reorder the lead stops
      const [movedStop] = leadStops.splice(fromIndex, 1)
      leadStops.splice(toIndex, 0, movedStop)

      // Rebuild the stops array with commutes and recalculate times
      const newStops: PlanStop[] = []

      leadStops.forEach((stop, index) => {
        // Add the stop with updated time
        newStops.push({
          ...stop,
          timeRange: generateTimeRange(index * 2),
        })

        // Add commute after each stop (except the last one)
        if (index < leadStops.length - 1) {
          const nextLead = leadStops[index + 1].lead
          newStops.push({
            id: `commute-${Date.now()}-${index}`,
            type: 'Commute',
            timeRange: generateTimeRange(index * 2 + 1),
            address: nextLead ? `${nextLead.address}, ${nextLead.city}` : '',
            isCompleted: false,
          })
        }
      })

      return newStops
    })
  }, [])

  // Update the time range for a specific stop
  const updateStopTime = useCallback((stopId: string, newTimeRange: string) => {
    setStops(prev =>
      prev.map(stop =>
        stop.id === stopId ? { ...stop, timeRange: newTimeRange } : stop
      )
    )
  }, [])

  return {
    // Existing
    stops,
    createdDate,
    completeStop,
    completeStopWithFeedback,
    completeAllStops,
    acceptRecommended,
    denyRecommended,
    routeCoordinates,
    createPlanFromLeads,
    addLeadToPlan,
    clearPlan,
    reorderStops,
    removeStopByLeadId,
    updateStopTime,
    // New - multi-date support
    planDate,
    planDateKey,
    setPlanDate,
    hasPlanForDate,
    getDatesWithPlans,
  }
}
