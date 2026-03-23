/**
 * Admin Dashboard Types
 */

export type StopStatus = 'completed' | 'pending' | 'missed'

export type StopOutcome = 'sale' | 'callback' | 'not_interested' | 'not_home' | null

export interface StopFeedback {
  notes: string
  accuracyRating: number // 1-5 rating
}

export interface AdminStopRecord {
  id: string
  repId: string
  repName: string
  repInitials: string
  leadId: string
  leadName: string
  address: string
  city: string
  state: string
  zip: string
  date: string // YYYY-MM-DD
  scheduledTime: string
  completedTime: string | null
  status: StopStatus
  outcome: StopOutcome
  feedback: StopFeedback | null
}

export interface RepPerformance {
  repId: string
  repName: string
  repInitials: string
  totalStops: number
  completedStops: number
  pendingStops: number
  missedStops: number
  completionRate: number
  averageRating: number
  totalSales: number
  conversionRate: number
  hasIncompletePastStops: boolean
}

export interface AdminKpiSummary {
  totalStops: number
  completedStops: number
  pendingStops: number
  missedStops: number
  completionRate: number
  averageRating: number
  totalSales: number
  conversionRate: number
}

export interface FieldRep {
  id: string
  name: string
  initials: string
}

export type DateRangeFilter = 'today' | 'week' | 'month' | 'all'

export type OutcomeFilter = 'all' | 'sale' | 'callback' | 'not_interested' | 'not_home'

export type EmployeeSortField = 'name' | 'completion' | 'rating' | 'sales' | 'conversion'

export interface AdminFilters {
  dateRange: DateRangeFilter
  specificDate: string | null // YYYY-MM-DD format, overrides dateRange when set
  repId: string | null // null = all reps
  outcome: OutcomeFilter
}
