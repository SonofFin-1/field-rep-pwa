import { useState, useCallback } from 'react'
import type { Lead } from '@/data/types'

export type PlannerView = 'selection' | 'viewLead' | 'myPlan'

export function usePlannerState() {
  const [view, setView] = useState<PlannerView>('selection')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  const viewLead = useCallback((lead: Lead, appointmentId?: string) => {
    setSelectedLead(lead)
    setSelectedAppointmentId(appointmentId ?? null)
    setView('viewLead')
  }, [])

  const closeLead = useCallback(() => {
    setSelectedLead(null)
    setSelectedAppointmentId(null)
    setView('selection')
  }, [])

  const createPlan = useCallback(() => {
    setView('myPlan')
    setSelectedLead(null)
  }, [])

  const backToSelection = useCallback(() => {
    setView('selection')
    setSelectedLead(null)
  }, [])

  const openFeedbackModal = useCallback(() => {
    setShowFeedbackModal(true)
  }, [])

  const closeFeedbackModal = useCallback(() => {
    setShowFeedbackModal(false)
  }, [])

  return {
    view,
    selectedLead,
    selectedAppointmentId,
    showFeedbackModal,
    viewLead,
    closeLead,
    createPlan,
    backToSelection,
    openFeedbackModal,
    closeFeedbackModal,
  }
}
