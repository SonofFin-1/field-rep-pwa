import type { Appointment, Lead } from './types'
import { leads, getLeadById } from './leads'

// Helper to get lead or fallback
const getLead = (id: string): Lead => {
  const lead = getLeadById(id)
  if (lead) return lead
  // Fallback to first lead if not found
  return leads[0]
}

// Get today's date in YYYY-MM-DD format
function getTodayKey(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

const todayKey = getTodayKey()

// Today's appointments - using first few leads from the generated data
export const appointments: Appointment[] = [
  {
    id: 'apt-1',
    leadId: 'lead-1',
    lead: getLead('lead-1'),
    time: '9:00 AM',
    date: todayKey,
    type: 'Appointment',
    notes: 'Upgrade Follow-up',
  },
  {
    id: 'apt-2',
    leadId: 'lead-5',
    lead: getLead('lead-5'),
    time: '11:00 AM',
    date: todayKey,
    type: 'Home Assessment',
    notes: 'Interested in replacing old devices',
  },
]

// Planner appointments - use base lead data for consistency
export const plannerAppointments: Appointment[] = [
  {
    id: 'apt-1',
    leadId: 'lead-1',
    lead: {
      ...getLead('lead-1'),
      summary: 'Follow-up visit after initial consultation. Customer received competitor quote - need to present value proposition and match pricing if possible.',
    },
    time: '9:00 AM',
    date: todayKey,
    type: 'Appointment',
    notes: 'Upgrade Follow-up',
  },
  {
    id: 'apt-2',
    leadId: 'lead-5',
    lead: {
      ...getLead('lead-5'),
      summary: 'Returning customer ready for technology refresh. Current panel is outdated and sensors need replacement. Offer bundle deal.',
    },
    time: '11:00 AM',
    date: todayKey,
    type: 'Home Assessment',
    notes: 'Interested in replacing old devices',
  },
]

// Planner leads - use all generated leads
export const plannerLeads: Lead[] = leads
