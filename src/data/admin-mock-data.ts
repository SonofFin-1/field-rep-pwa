/**
 * Admin Dashboard Mock Data
 * Generates 30 days of historical data for 4 field reps
 */

import type {
  AdminStopRecord,
  FieldRep,
  StopStatus,
  StopOutcome,
  StopFeedback,
} from './admin-types'

// Seeded random for reproducible data
function seededRandom(seed: number) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

const random = seededRandom(12345)

// Field Reps
export const fieldReps: FieldRep[] = [
  { id: 'rep-1', name: 'Mandi Nelson', initials: 'MN' },
  { id: 'rep-2', name: 'Sarah Johnson', initials: 'SJ' },
  { id: 'rep-3', name: 'Mike Chen', initials: 'MC' },
  { id: 'rep-4', name: 'Lisa Park', initials: 'LP' },
]

// Lead names for mock data
const firstNames = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Daniel', 'Nancy', 'Matthew', 'Lisa',
  'Anthony', 'Betty', 'Mark', 'Margaret', 'Donald', 'Sandra', 'Steven', 'Ashley',
  'Paul', 'Kimberly', 'Andrew', 'Emily', 'Joshua', 'Donna', 'Kenneth', 'Michelle',
]

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
]

// Streets for Minneapolis area
const streets = [
  'Lake St', 'Hennepin Ave', 'Nicollet Ave', 'France Ave', 'Excelsior Blvd',
  'Cedar Ave', 'Portland Ave', 'Park Ave', 'Chicago Ave', 'Bloomington Ave',
  'Minnehaha Ave', 'University Ave', 'Franklin Ave', 'Broadway St', 'Central Ave',
  'Lyndale Ave', 'Bryant Ave', 'Aldrich Ave', 'Dupont Ave', 'Emerson Ave',
]

const cities = [
  { name: 'Minneapolis', state: 'MN', zips: ['55401', '55402', '55403', '55404', '55405'] },
  { name: 'Edina', state: 'MN', zips: ['55410', '55416', '55424', '55435', '55436'] },
  { name: 'St. Louis Park', state: 'MN', zips: ['55416', '55426'] },
  { name: 'Bloomington', state: 'MN', zips: ['55420', '55425', '55431', '55437', '55438'] },
]

// Sample notes
const sampleNotes = [
  'Homeowner very interested in solar panels. Has south-facing roof with good sun exposure.',
  'Discussed energy savings. Will need to consult with spouse before making decision.',
  'Current customer - checking on system performance. Very satisfied with previous installation.',
  'Not home - left door hanger with contact information.',
  'Interested but concerned about upfront costs. Explained financing options.',
  'Roof needs repair before solar installation. Referred to roofing contractor.',
  'Great conversation! Scheduled follow-up for detailed assessment.',
  'Customer had questions about battery storage. Provided brochures.',
  'New construction - builder already has solar partner. Left business card.',
  'Elderly homeowner - concerned about long-term commitment. Explained warranties.',
  'Very receptive! Booked home assessment for next week.',
  'Customer comparison shopping. Provided competitive analysis.',
  'Property has significant shading issues. May not be ideal candidate.',
  'Tenant - provided landlord contact information for follow-up.',
  'HOA restrictions may limit installation options. Need to investigate.',
]

// Helper to generate random date in last 30 days
function getRandomDate(daysAgo: number): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

// Helper to generate random time
function getRandomTime(): string {
  const hour = Math.floor(random() * 8) + 8 // 8 AM to 4 PM
  const minute = Math.floor(random() * 4) * 15 // 0, 15, 30, 45
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

// Generate stop status with realistic distribution
function generateStatus(rep: FieldRep, isToday: boolean): StopStatus {
  // Different completion rates per rep
  const completionRates: Record<string, number> = {
    'rep-1': 0.75, // Mandi - 75%
    'rep-2': 0.82, // Sarah - 82%
    'rep-3': 0.65, // Mike - 65%
    'rep-4': 0.78, // Lisa - 78%
  }

  if (isToday) {
    // Today's stops: some completed, some pending
    const r = random()
    if (r < 0.4) return 'completed'
    if (r < 0.9) return 'pending'
    return 'missed'
  }

  const rate = completionRates[rep.id] || 0.7
  const r = random()
  if (r < rate) return 'completed'
  if (r < rate + 0.1) return 'missed'
  return 'pending' // Historical pending are actually missed
}

// Generate outcome based on status
function generateOutcome(status: StopStatus): StopOutcome {
  if (status !== 'completed') return null

  const r = random()
  if (r < 0.35) return 'sale' // 35% conversion
  if (r < 0.50) return 'callback'
  if (r < 0.75) return 'not_interested'
  return 'not_home'
}

// Generate feedback for completed stops
function generateFeedback(status: StopStatus, outcome: StopOutcome): StopFeedback | null {
  if (status !== 'completed') return null

  // 70% of completed stops have notes
  if (random() > 0.7) return null

  const noteIndex = Math.floor(random() * sampleNotes.length)

  // Rating depends on outcome
  let rating: number
  if (outcome === 'not_home') {
    // Not home: only rate location accuracy (2-3 stars max)
    rating = Math.floor(random() * 2) + 2 // 2 or 3
  } else if (outcome === 'not_interested') {
    // Not interested: lower ratings (2-3 stars)
    rating = Math.floor(random() * 2) + 2 // 2 or 3
  } else {
    // Sale or callback: positive interaction, can rate 4-5
    rating = Math.floor(random() * 2) + 4 // 4 or 5
  }

  return {
    notes: sampleNotes[noteIndex],
    accuracyRating: rating,
  }
}

// Generate all mock stops
function generateMockStops(): AdminStopRecord[] {
  const stops: AdminStopRecord[] = []
  let stopId = 1

  const today = new Date().toISOString().split('T')[0]

  for (let day = 0; day < 30; day++) {
    const date = getRandomDate(day)
    const isToday = date === today

    for (const rep of fieldReps) {
      // Skip Mandi (rep-1) - her data comes from real plans
      if (rep.id === 'rep-1') continue

      // 6-12 stops per rep per day (target: 10)
      const numStops = Math.floor(random() * 7) + 6

      for (let i = 0; i < numStops; i++) {
        const firstName = firstNames[Math.floor(random() * firstNames.length)]
        const lastName = lastNames[Math.floor(random() * lastNames.length)]
        const street = streets[Math.floor(random() * streets.length)]
        const streetNum = Math.floor(random() * 9000) + 1000
        const cityData = cities[Math.floor(random() * cities.length)]
        const zip = cityData.zips[Math.floor(random() * cityData.zips.length)]

        const status = generateStatus(rep, isToday)
        const outcome = generateOutcome(status)
        const feedback = generateFeedback(status, outcome)

        const scheduledTime = getRandomTime()
        const completedTime = status === 'completed'
          ? scheduledTime.replace(/:\d{2}$/, `:${Math.floor(random() * 60).toString().padStart(2, '0')}`)
          : null

        stops.push({
          id: `stop-${stopId++}`,
          repId: rep.id,
          repName: rep.name,
          repInitials: rep.initials,
          leadId: `lead-${stopId}`,
          leadName: `${firstName} ${lastName}`,
          address: `${streetNum} ${street}`,
          city: cityData.name,
          state: cityData.state,
          zip,
          date,
          scheduledTime,
          completedTime,
          status,
          outcome,
          feedback,
        })
      }
    }
  }

  // Sort by date (newest first), then by time
  return stops.sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date)
    if (dateCompare !== 0) return dateCompare
    return a.scheduledTime.localeCompare(b.scheduledTime)
  })
}

// Export generated stops
export const adminStops: AdminStopRecord[] = generateMockStops()

// Helper to get stops by date range
export function getStopsByDateRange(
  startDate: string,
  endDate: string
): AdminStopRecord[] {
  return adminStops.filter(
    stop => stop.date >= startDate && stop.date <= endDate
  )
}

// Helper to get stops by rep
export function getStopsByRep(repId: string): AdminStopRecord[] {
  return adminStops.filter(stop => stop.repId === repId)
}

// Helper to get stop by ID
export function getStopById(id: string): AdminStopRecord | undefined {
  return adminStops.find(stop => stop.id === id)
}
