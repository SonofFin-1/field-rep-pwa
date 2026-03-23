import { useState, useCallback, useRef } from 'react'
import type { Lead } from '@/data/types'

export type PlannerView = 'selection' | 'viewLead' | 'myPlan'

export function usePlannerState() {
  const [view, setView] = useState<PlannerView>('selection')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackStopId, setFeedbackStopId] = useState<string | null>(null)
  // Track the previous view to return to after closing lead detail
  const previousViewRef = useRef<PlannerView>('selection')

  const viewLead = useCallback((lead: Lead, appointmentId?: string) => {
    // Store current view before switching to viewLead
    previousViewRef.current = view === 'viewLead' ? previousViewRef.current : view
    setSelectedLead(lead)
    setSelectedAppointmentId(appointmentId ?? null)
    setView('viewLead')
  }, [view])

  const closeLead = useCallback(() => {
    setSelectedLead(null)
    setSelectedAppointmentId(null)
    // Return to the previous view (myPlan or selection)
    setView(previousViewRef.current)
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

  // Determine if we should show plan view (either in myPlan or viewing lead from myPlan)
  const shouldShowPlanView = view === 'myPlan' || (view === 'viewLead' && previousViewRef.current === 'myPlan')

  return {
    view,
    selectedLead,
    selectedAppointmentId,
    showFeedbackModal,
    feedbackStopId,
    shouldShowPlanView,
    viewLead,
    closeLead,
    createPlan,
    backToSelection,
    openFeedbackModal,
    closeFeedbackModal,
  }
}
