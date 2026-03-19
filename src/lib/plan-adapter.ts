/**
 * Plan Adapter
 * Converts PlanStop data from localStorage to AdminStopRecord format
 */

import type { PlanStop, StopOutcome } from '@/data/types'
import type { AdminStopRecord, StopStatus } from '@/data/admin-types'

const PLAN_STORAGE_KEY_PREFIX = 'field-rep-plan-'

// Mandi Nelson's rep info (rep-1)
const MANDI_REP = {
  id: 'rep-1',
  name: 'Mandi Nelson',
  initials: 'MN',
}

interface StoredPlan {
  stops: PlanStop[]
  createdDate: string
}

/**
 * Parse time range "8:00 AM-8:30 AM" to "08:00" (24h format)
 */
export function parseTimeRange(timeRange: string): string {
  const match = timeRange.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!match) return '08:00'

  let hours = parseInt(match[1], 10)
  const minutes = match[2]
  const isPM = match[3].toUpperCase() === 'PM'

  if (isPM && hours !== 12) hours += 12
  if (!isPM && hours === 12) hours = 0

  return `${hours.toString().padStart(2, '0')}:${minutes}`
}

/**
 * Determine stop status based on completion and date
 */
export function determineStatus(isCompleted: boolean, dateKey: string): StopStatus {
  if (isCompleted) return 'completed'

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayKey = today.toISOString().split('T')[0]

  if (dateKey < todayKey) return 'missed'
  return 'pending'
}

/**
 * Convert a PlanStop to AdminStopRecord
 */
export function planStopToAdminRecord(
  stop: PlanStop,
  dateKey: string,
  stopIndex: number
): AdminStopRecord | null {
  // Skip commute stops - they don't have leads
  if (stop.type === 'Commute' || !stop.lead) return null

  const lead = stop.lead
  const status = determineStatus(stop.isCompleted, dateKey)

  // Parse address parts (format: "123 Main St, City 55555")
  const addressParts = stop.address.split(',')
  const streetAddress = addressParts[0]?.trim() || lead.address
  const cityZip = addressParts[1]?.trim() || ''
  const cityMatch = cityZip.match(/^([^\d]+)/)
  const zipMatch = cityZip.match(/(\d{5})/)

  return {
    id: `mandi-${dateKey}-${stopIndex}`,
    repId: MANDI_REP.id,
    repName: MANDI_REP.name,
    repInitials: MANDI_REP.initials,
    leadId: lead.id,
    leadName: lead.name,
    address: streetAddress,
    city: cityMatch ? cityMatch[1].trim() : lead.city,
    state: lead.state || 'MN',
    zip: zipMatch ? zipMatch[1] : lead.zip,
    date: dateKey,
    scheduledTime: parseTimeRange(stop.timeRange),
    completedTime: stop.completedTime || null,
    status,
    outcome: (stop.outcome as StopOutcome) || null,
    feedback: stop.feedback || null,
  }
}

/**
 * Load all of Mandi's stops from localStorage
 * Scans all field-rep-plan-* keys and converts to AdminStopRecords
 */
export function loadMandiStopsFromStorage(): AdminStopRecord[] {
  const stops: AdminStopRecord[] = []

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key || !key.startsWith(PLAN_STORAGE_KEY_PREFIX)) continue

      const dateKey = key.replace(PLAN_STORAGE_KEY_PREFIX, '')

      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) continue

      const stored = localStorage.getItem(key)
      if (!stored) continue

      const plan: StoredPlan = JSON.parse(stored)
      if (!plan.stops || !Array.isArray(plan.stops)) continue

      // Convert each stop
      plan.stops.forEach((stop, index) => {
        const adminRecord = planStopToAdminRecord(stop, dateKey, index)
        if (adminRecord) {
          stops.push(adminRecord)
        }
      })
    }
  } catch (e) {
    console.error('Failed to load Mandi stops from storage:', e)
  }

  // Sort by date (newest first), then by time
  return stops.sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date)
    if (dateCompare !== 0) return dateCompare
    return a.scheduledTime.localeCompare(b.scheduledTime)
  })
}
