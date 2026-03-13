import { useMemo } from 'react'
import { appointments, plannerAppointments } from '@/data/appointments'
import type { Appointment } from '@/data/types'

export function useAppointments(date?: string): Appointment[] {
  return useMemo(() => {
    if (!date) {
      return appointments
    }
    return appointments.filter(apt => apt.date === date)
  }, [date])
}

export function usePlannerAppointments(date?: string): Appointment[] {
  return useMemo(() => {
    if (!date) {
      return plannerAppointments
    }
    return plannerAppointments.filter(apt => apt.date === date)
  }, [date])
}
