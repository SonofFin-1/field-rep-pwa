import type { Appointment, Lead } from './types'
import { leads } from './leads'

// Today's appointments - empty by default
export const appointments: Appointment[] = []

// Planner appointments - empty by default
export const plannerAppointments: Appointment[] = []

// Planner leads - use all generated leads
export const plannerLeads: Lead[] = leads
