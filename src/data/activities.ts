import type { Activity } from './types'

// Create timestamps for "X hours ago"
const now = new Date()
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)

export const activities: Activity[] = [
  {
    id: 'activity-1',
    type: 'visit',
    description: 'Completed visit',
    linkedName: 'Sarah Mitchell',
    leadId: 'lead-1',
    timestamp: twoHoursAgo,
  },
  {
    id: 'activity-2',
    type: 'notes',
    description: 'Added notes for',
    linkedName: 'James Rodriguez',
    leadId: 'lead-2',
    timestamp: twoHoursAgo,
  },
  {
    id: 'activity-3',
    type: 'lead_assigned',
    description: 'New lead assigned',
    linkedName: 'Linda Chen',
    leadId: 'lead-4',
    timestamp: twoHoursAgo,
  },
  {
    id: 'activity-4',
    type: 'plan_completed',
    description: 'Plan Completed •',
    linkedName: '5 Stops',
    timestamp: twoHoursAgo,
  },
  {
    id: 'activity-5',
    type: 'call',
    description: 'Follow-up call with',
    linkedName: 'Robert Thompson',
    leadId: 'lead-5',
    timestamp: twoHoursAgo,
  },
  {
    id: 'activity-6',
    type: 'visit',
    description: 'Completed visit',
    linkedName: 'Sarah Mitchell',
    leadId: 'lead-1',
    timestamp: twoHoursAgo,
  },
]
