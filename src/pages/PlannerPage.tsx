import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePlannerState } from '@/hooks/usePlannerState'
import { usePlannerSelection } from '@/hooks/usePlannerSelection'
import { useMyPlan } from '@/hooks/useMyPlan'
import { useSchedulesContext } from '@/contexts/ScheduleContext'
import { plannerAppointments, plannerLeads } from '@/data/appointments'
import { mapLeads, leads as allLeadsData } from '@/data/leads'
import { formatDateKey, formatTime24to12 } from '@/lib/calendar-utils'
import type { Appointment, Lead, ScheduleEvent } from '@/data/types'
import type { LeadsFilters, ScoreFilter, ValueFilter } from '@/components/leads/LeadsFilterModal'
import { defaultFilters } from '@/components/leads/LeadsFilterModal'

import {
  PlannerSidebar,
  LeadDetailPanel,
  MyPlanView,
  FeedbackModal,
  MapFilterBar,
  type ScheduleFilter,
} from '@/components/planner'
import type { SidebarTab } from '@/components/planner/PlannerSidebar'
import { PlannerMapGoogle } from '@/components/google-maps/PlannerMapGoogle'
import { ScheduleModal } from '@/components/calendar/ScheduleModal'

// Filter helper functions
function matchesScoreFilter(score: number, filter: ScoreFilter): boolean {
  switch (filter) {
    case 'excellent': return score >= 85
    case 'great': return score >= 70 && score < 85
    case 'low': return score < 70
    default: return true
  }
}

function matchesValueFilter(value: number, filter: ValueFilter): boolean {
  switch (filter) {
    case 'high': return value >= 5000
    case 'medium': return value >= 2000 && value < 5000
    case 'low': return value < 2000
    default: return true
  }
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function PlannerPage() {
  // Check for date param from URL (e.g., from calendar "View Plan" button)
  const [searchParams, setSearchParams] = useSearchParams()
  const urlDateParam = searchParams.get('date')

  // State management
  const {
    view,
    selectedLead,
    selectedAppointmentId,
    showFeedbackModal,
    viewLead,
    closeLead,
    openFeedbackModal,
    closeFeedbackModal,
  } = usePlannerState()

  // Selection management for appointments only (leads no longer use multi-select)
  const {
    selectedLeadIds: selectedAppointmentIds,
    toggleLead: toggleAppointment,
  } = usePlannerSelection()

  // Schedule modal state for scheduling individual leads
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [leadToSchedule, setLeadToSchedule] = useState<Lead | null>(null)

  // Selected plan date state - initialize from URL param if present
  const [selectedPlanDate, setSelectedPlanDate] = useState<Date>(() => {
    if (urlDateParam && /^\d{4}-\d{2}-\d{2}$/.test(urlDateParam)) {
      return parseDateKey(urlDateParam)
    }
    return new Date()
  })

  // State for showing plan view when navigating from calendar
  const [showPlanFromUrl, setShowPlanFromUrl] = useState(false)

  // Handle URL date param - switch to plan view if date param is present
  useEffect(() => {
    if (urlDateParam && /^\d{4}-\d{2}-\d{2}$/.test(urlDateParam)) {
      const date = parseDateKey(urlDateParam)
      setSelectedPlanDate(date)
      setPlanDate(date)
      setShowPlanFromUrl(true) // Show plan view from URL navigation
      // Clear the URL param
      setSearchParams({}, { replace: true })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // My Plan state with multi-date support
  const {
    stops,
    createdDate,
    completeStop: baseCompleteStop,
    completeAllStops,
    acceptRecommended,
    denyRecommended,
    routeCoordinates,
    addLeadToPlan,
    reorderStops,
    planDate,
    setPlanDate,
    hasPlanForDate,
  } = useMyPlan(selectedPlanDate)

  // Schedules context for syncing calendar events and getting today's appointments
  const { syncStopCompletion, getEventsForDate, deleteEvent, addEvent, updatePlanTimesOnCalendar } = useSchedulesContext()

  // Sidebar tab state
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('appointments')

  // Lead filter state
  const [leadFilters, setLeadFilters] = useState<LeadsFilters>(defaultFilters)

  // Schedule filter state (all, scheduled, unscheduled)
  const [scheduleFilter, setScheduleFilter] = useState<ScheduleFilter>('all')

  // Get today's date key
  const todayKey = useMemo(() => formatDateKey(new Date()), [])

  // Convert schedule events to Appointment format and merge with static appointments
  const todaysAppointments = useMemo(() => {
    const scheduleEvents = getEventsForDate(todayKey)

    // Filter to only appointment events with leadId
    const appointmentEvents = scheduleEvents.filter(
      (event): event is ScheduleEvent & { leadId: string } =>
        !!event.leadId && event.type === 'appointment'
    )

    // Convert schedule events with leads to Appointment format
    const scheduleAppointments: Appointment[] = []
    for (const event of appointmentEvents) {
      // Find the lead data
      const lead = [...allLeadsData, ...mapLeads, ...plannerLeads].find(
        l => l.id === event.leadId
      )

      if (lead) {
        scheduleAppointments.push({
          id: event.id,
          leadId: event.leadId,
          lead: {
            ...lead,
            name: event.leadName || lead.name,
          },
          time: formatTime24to12(event.startTime),
          date: event.date,
          type: 'Appointment',
          notes: event.notes || '',
        })
      }
    }

    // Filter plannerAppointments to today only
    const todaysPlannerAppointments = plannerAppointments.filter(
      a => a.date === todayKey
    )

    // Merge with schedule appointments, avoiding duplicates by leadId
    const existingLeadIds = new Set(
      todaysPlannerAppointments.map(a => a.leadId)
    )

    const uniqueScheduleAppts = scheduleAppointments.filter(
      a => !existingLeadIds.has(a.leadId)
    )

    // Combine and sort by time
    return [...todaysPlannerAppointments, ...uniqueScheduleAppts].sort((a, b) => {
      // Parse times for comparison (handle AM/PM)
      const parseTime = (t: string) => {
        const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i)
        if (!match) return 0
        let hours = parseInt(match[1])
        const mins = parseInt(match[2])
        const isPM = match[3].toUpperCase() === 'PM'
        if (isPM && hours !== 12) hours += 12
        if (!isPM && hours === 12) hours = 0
        return hours * 60 + mins
      }
      return parseTime(a.time) - parseTime(b.time)
    })
  }, [getEventsForDate, todayKey])

  // Wrap completeStop to sync with calendar using planDate
  const completeStop = useCallback(
    (stopId: string) => {
      const stop = stops.find(s => s.id === stopId)
      if (stop?.lead && !stop.isCompleted) {
        // Sync completion to calendar for the plan's date
        syncStopCompletion(stop.lead.id, planDate)
      }
      baseCompleteStop(stopId)
    },
    [baseCompleteStop, stops, syncStopCompletion, planDate]
  )

  // Handle plan date change from MyPlanView
  const handlePlanDateChange = useCallback((newDate: Date) => {
    setSelectedPlanDate(newDate)
    setPlanDate(newDate)
  }, [setPlanDate])

  // Handle going back from plan view (when navigated from calendar)
  const handleBackFromPlanView = useCallback(() => {
    setShowPlanFromUrl(false)
  }, [])

  // All leads (unfiltered)
  const allLeads = useMemo(() => plannerLeads, [])

  // Filtered leads based on filter state
  const filteredLeads = useMemo(() => {
    return allLeads.filter(lead => {
      // Name search filter
      if (leadFilters.name && !lead.name.toLowerCase().includes(leadFilters.name.toLowerCase())) {
        return false
      }
      if (leadFilters.score !== 'all' && !matchesScoreFilter(lead.score, leadFilters.score)) {
        return false
      }
      if (leadFilters.status !== 'all' && lead.status !== leadFilters.status) {
        return false
      }
      if (leadFilters.zips.length > 0 && !leadFilters.zips.includes(lead.zip)) {
        return false
      }
      if (leadFilters.value !== 'all' && !matchesValueFilter(lead.value, leadFilters.value)) {
        return false
      }
      return true
    })
  }, [allLeads, leadFilters])

  // Count active filters (including schedule filter)
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (leadFilters.name) count++
    if (leadFilters.score !== 'all') count++
    if (leadFilters.status !== 'all') count++
    if (leadFilters.zips.length > 0) count++
    if (leadFilters.value !== 'all') count++
    if (scheduleFilter !== 'all') count++
    return count
  }, [leadFilters, scheduleFilter])

  // All leads for map pins - include plannerLeads so they show on map
  const allMapLeads = useMemo(() => {
    // Combine mapLeads with plannerLeads, avoiding duplicates by ID
    const leadMap = new Map<string, typeof mapLeads[0]>()
    mapLeads.forEach(lead => leadMap.set(lead.id, lead))
    plannerLeads.forEach(lead => leadMap.set(lead.id, lead))
    return Array.from(leadMap.values())
  }, [])

  // Leads that are part of the current plan (for plan view)
  const planLeads = useMemo(() => {
    return stops
      .filter(stop => stop.lead) // Only stops with leads (not commutes)
      .map(stop => stop.lead!)
  }, [stops])

  // Scheduled lead IDs - leads that have calendar events on any date
  const scheduledLeadIds = useMemo(() => {
    const scheduled = new Set<string>()
    // Get events for a range of dates (next 30 days)
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateKey = formatDateKey(date)
      const events = getEventsForDate(dateKey)
      events.forEach(event => {
        if (event.leadId) {
          scheduled.add(event.leadId)
        }
      })
    }
    return scheduled
  }, [getEventsForDate])

  // Filtered leads for map based on active tab, filters, and schedule filter
  const visibleMapLeads = useMemo(() => {
    let leads: Lead[]

    if (sidebarTab === 'appointments') {
      // Only show leads that have appointments today
      const appointmentLeadIds = new Set(todaysAppointments.map(apt => apt.leadId))
      leads = allMapLeads.filter(lead => appointmentLeadIds.has(lead.id))
    } else {
      // Show filtered leads when on leads tab
      leads = filteredLeads
    }

    // Apply schedule filter
    if (scheduleFilter === 'scheduled') {
      leads = leads.filter(lead => scheduledLeadIds.has(lead.id))
    } else if (scheduleFilter === 'unscheduled') {
      leads = leads.filter(lead => !scheduledLeadIds.has(lead.id))
    }

    return leads
  }, [sidebarTab, todaysAppointments, allMapLeads, filteredLeads, scheduleFilter, scheduledLeadIds])

  // Completed lead IDs for map (grayed out pins)
  const completedLeadIds = useMemo(() => {
    const completed = new Set<string>()
    stops.forEach(stop => {
      if (stop.isCompleted && stop.lead) {
        completed.add(stop.lead.id)
      }
    })
    return completed
  }, [stops])

  // Event handlers
  const handleViewAppointment = useCallback(
    (appointment: Appointment) => {
      viewLead(appointment.lead, appointment.id)
    },
    [viewLead]
  )

  const handleViewLead = useCallback(
    (lead: Lead) => {
      viewLead(lead)
    },
    [viewLead]
  )

  const handleMapSelectLead = useCallback(
    (_lead: Lead) => {
      // Just select it on the map, popup will handle view details
    },
    []
  )

  const handleMapAddToPlan = useCallback(
    (leadId: string) => {
      console.log('[AddToPlan] Called with:', { leadId, showPlanFromUrl })

      // If we're in the plan view (from URL), add the lead directly to the plan
      if (showPlanFromUrl) {
        const lead = allMapLeads.find(l => l.id === leadId)
        console.log('[AddToPlan] Found lead:', lead)
        if (lead) {
          addLeadToPlan(lead)
        }
      }
    },
    [showPlanFromUrl, allMapLeads, addLeadToPlan]
  )

  const handleMapViewDetails = useCallback(
    (lead: Lead) => {
      viewLead(lead)
    },
    [viewLead]
  )

  const handleAddToPlan = useCallback(() => {
    closeLead()
  }, [closeLead])

  // Handler to open schedule modal with a lead pre-filled
  const handleScheduleLead = useCallback((lead: Lead) => {
    setLeadToSchedule(lead)
    setShowScheduleModal(true)
  }, [])

  // Handler when schedule modal saves
  const handleScheduleModalSave = useCallback((eventData: Omit<ScheduleEvent, 'id' | 'status'>) => {
    addEvent(eventData)
    setShowScheduleModal(false)
    setLeadToSchedule(null)
  }, [addEvent])

  // Handler to close schedule modal
  const handleScheduleModalClose = useCallback(() => {
    setShowScheduleModal(false)
    setLeadToSchedule(null)
  }, [])

  const handleGetDirections = useCallback(() => {
    // Get all stops with leads (excluding commutes)
    const stopsWithLeads = stops.filter(s => s.lead)
    if (stopsWithLeads.length === 0) return

    // Build Google Maps directions URL with all stops
    const addresses = stopsWithLeads.map(stop => {
      const lead = stop.lead!
      return `${lead.address}, ${lead.city}, ${lead.state} ${lead.zip}`
    })

    // Google Maps URL format: origin -> waypoints -> destination
    const destination = encodeURIComponent(addresses[addresses.length - 1])
    const waypoints = addresses.slice(0, -1).map(a => encodeURIComponent(a)).join('|')

    // Use the directions URL format
    let url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`
    if (waypoints) {
      url += `&waypoints=${waypoints}`
    }
    url += '&travelmode=driving'

    window.open(url, '_blank')
  }, [stops])

  const navigate = useNavigate()

  const handleSchedule = useCallback(() => {
    // Navigate to calendar month view for the plan's date
    const dateKey = formatDateKey(planDate)
    navigate(`/calendar?date=${dateKey}&view=month`)
  }, [navigate, planDate])

  const handleRemoveAppointment = useCallback(() => {
    if (selectedAppointmentId) {
      deleteEvent(selectedAppointmentId)
      closeLead()
    }
  }, [selectedAppointmentId, deleteEvent, closeLead])

  // Remove all calendar events for the selected lead
  const handleRemoveFromCalendar = useCallback(() => {
    if (!selectedLead) return

    // Find and delete all events for this lead across dates
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateKey = formatDateKey(date)
      const events = getEventsForDate(dateKey)
      events.forEach(event => {
        if (event.leadId === selectedLead.id) {
          deleteEvent(event.id)
        }
      })
    }
    closeLead()
  }, [selectedLead, getEventsForDate, deleteEvent, closeLead])

  const handleFeedbackComplete = useCallback(
    (notes: string, accuracy: number) => {
      console.log('Feedback submitted:', { notes, accuracy })
      closeFeedbackModal()
    },
    [closeFeedbackModal]
  )

  // Handle reordering stops and sync with calendar
  const handleReorderStops = useCallback(
    (fromIndex: number, toIndex: number) => {
      reorderStops(fromIndex, toIndex)
    },
    [reorderStops]
  )

  // Sync calendar times when stops change (after reorder)
  const stopsRef = useRef(stops)
  useEffect(() => {
    // Only update if stops have actually changed (not on initial render)
    if (stopsRef.current !== stops && stops.length > 0) {
      updatePlanTimesOnCalendar(stops, planDate)
    }
    stopsRef.current = stops
  }, [stops, updatePlanTimesOnCalendar, planDate])

  // Show plan view only when navigated from calendar URL
  const isMyPlanView = showPlanFromUrl
  const isViewingLead = view === 'viewLead' && selectedLead

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left sidebar - Selection or My Plan view */}
      {isMyPlanView ? (
        <MyPlanView
          stops={stops}
          createdDate={createdDate}
          planDate={planDate}
          onBack={handleBackFromPlanView}
          onCompleteStop={completeStop}
          onMarkAllComplete={completeAllStops}
          onAcceptRecommended={acceptRecommended}
          onDenyRecommended={denyRecommended}
          onReorderStops={handleReorderStops}
          onGetDirections={handleGetDirections}
          onSchedule={handleSchedule}
          onOpenFeedback={openFeedbackModal}
          onDeletePlan={handleBackFromPlanView}
          onDateChange={handlePlanDateChange}
          hasPlanForDate={hasPlanForDate}
        />
      ) : (
        <PlannerSidebar
          appointments={todaysAppointments}
          leads={filteredLeads}
          selectedAppointmentIds={selectedAppointmentIds}
          onToggleAppointment={toggleAppointment}
          onViewAppointment={handleViewAppointment}
          onViewLead={handleViewLead}
          onScheduleLead={handleScheduleLead}
          scheduledLeadIds={scheduledLeadIds}
          activeTab={sidebarTab}
          onTabChange={setSidebarTab}
          totalLeadCount={allLeads.length}
        />
      )}

      {/* Map */}
      <div className="flex-1 h-full relative">
        {!isMyPlanView && sidebarTab === 'leads' && (
          <MapFilterBar
            filters={leadFilters}
            onFiltersChange={setLeadFilters}
            activeFilterCount={activeFilterCount}
            visibleCount={visibleMapLeads.length}
            totalCount={allLeads.length}
            scheduleFilter={scheduleFilter}
            onScheduleFilterChange={setScheduleFilter}
          />
        )}
        <PlannerMapGoogle
          leads={isMyPlanView ? planLeads : visibleMapLeads}
          selectedLeadIds={new Set<string>()}
          completedLeadIds={completedLeadIds}
          scheduledLeadIds={scheduledLeadIds}
          onSelectLead={handleMapSelectLead}
          onAddToPlan={handleMapAddToPlan}
          onViewDetails={handleMapViewDetails}
          routeCoordinates={routeCoordinates}
          showRoute={isMyPlanView}
          focusedLeadId={selectedLead?.id}
        />
      </div>

      {/* Right panel - Lead details */}
      {isViewingLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={closeLead}
          onAddToPlan={handleAddToPlan}
          appointmentId={selectedAppointmentId}
          onRemoveAppointment={handleRemoveAppointment}
          isScheduled={scheduledLeadIds.has(selectedLead.id)}
          onRemoveFromCalendar={handleRemoveFromCalendar}
        />
      )}

      {/* Schedule Modal for individual lead scheduling */}
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={handleScheduleModalClose}
        onSave={handleScheduleModalSave}
        prefilledLead={leadToSchedule || undefined}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        score={selectedLead?.score ?? 91}
        isOpen={showFeedbackModal}
        onClose={closeFeedbackModal}
        onComplete={handleFeedbackComplete}
      />
    </div>
  )
}
