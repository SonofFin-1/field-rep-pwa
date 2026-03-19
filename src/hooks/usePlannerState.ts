import { useState, useCallback } from 'react'
import type { Lead } from '@/data/types'

export type PlannerView = 'selection' | 'viewLead' | 'myPlan'

export function usePlannerState() {
  const [view, setView] = useState<PlannerView>('selection')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackStopId, setFeedbackStopId] = useState<string | null>(null)

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
  }, [])

  const openFeedbackModal = useCallback((stopId: string) => {
    setFeedbackStopId(stopId)
    setShowFeedbackModal(true)
  }, [])

  const closeFeedbackModal = useCallback(() => {
    setShowFeedbackModal(false)
    setFeedbackStopId(null)
  }, [])

  return {
    view,
    selectedLead,
    selectedAppointmentId,
    showFeedbackModal,
    feedbackStopId,
    viewLead,
    closeLead,
    createPlan,
    backToSelection,
    openFeedbackModal,
    closeFeedbackModal,
  }
}
