export interface User {
  id: string
  name: string
  initials: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  score: number
  value: number
  status: 'New' | 'Returning'
  lat: number
  lng: number
  notes?: string
  summary?: string
  purchaseHistory?: PurchaseHistoryItem[]
  visitHistory?: VisitHistoryItem[]
}

export interface PurchaseHistoryItem {
  date: string
  item: string
  amount: number
}

export interface VisitHistoryItem {
  date: string
  notes: string
  followUp?: string
}

export interface Appointment {
  id: string
  leadId: string
  lead: Lead
  time: string
  date: string
  type: 'Appointment' | 'Home Assessment'
  notes: string
}

export type ActivityType = 'visit' | 'notes' | 'lead_assigned' | 'plan_completed' | 'call'

export interface Activity {
  id: string
  type: ActivityType
  description: string
  linkedName?: string
  linkedValue?: string
  leadId?: string
  timestamp: Date
}

export type CalendarEventType = 'appointment' | 'home_assessment' | 'plan'

export interface CalendarEvent {
  id: string
  date: string // YYYY-MM-DD
  title: string
  type: CalendarEventType
  time?: string
  stops?: number
  status?: AppointmentStatus // For status color coding
}

export interface PlanStop {
  id: string
  type: 'Appointment' | 'Commute' | 'Home Assessment' | 'Follow-up'
  timeRange: string
  lead?: Lead
  address: string
  notes?: string
  isCompleted: boolean
  isRecommended?: boolean
}

// Calendar Schedule Types
export type AppointmentStatus = 'pending' | 'completed' | 'overdue' | 'follow-up'

export type ScheduleEventType = 'appointment' | 'task' | 'follow-up'

export interface ScheduleEvent {
  id: string
  title: string
  leadId?: string
  leadName?: string
  address?: string
  date: string // YYYY-MM-DD
  startTime: string // HH:MM (24h)
  endTime: string // HH:MM (24h)
  type: ScheduleEventType
  status: AppointmentStatus
  notes?: string
}

export type CalendarViewMode = 'day' | 'week' | 'month'
