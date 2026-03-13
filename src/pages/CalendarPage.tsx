import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/shared/Card'
import {
  CalendarHeader,
  CalendarGrid,
  CalendarViewSwitcher,
  DayView,
  WeekView,
  ScheduleModal,
} from '@/components/calendar'
import { useSchedulesContext } from '@/contexts/ScheduleContext'
import { useCalendarState } from '@/hooks/useCalendarState'
import { useMyPlan } from '@/hooks/useMyPlan'
import { formatDateKey, formatTime24to12 } from '@/lib/calendar-utils'
import type { ScheduleEvent, CalendarEvent } from '@/data/types'

export function CalendarPage() {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | undefined>()

  const {
    viewMode,
    selectedDate,
    selectedDateKey,
    weekDates,
    setViewMode,
    goToToday,
    goToPrevious,
    goToNext,
    switchToDayView,
  } = useCalendarState()

  const {
    getEventsForDate,
    getEventsForDateRange,
    addEvent,
    updateEvent,
    deleteEvent,
    markComplete,
    markPending,
  } = useSchedulesContext()

  // Get plan functions for "View Plan" button and removing stops
  const { hasPlanForDate, removeStopByLeadId } = useMyPlan()

  // Navigate to planner with the selected date
  const handleViewPlan = useCallback((date: Date) => {
    const dateKey = formatDateKey(date)
    navigate(`/?date=${dateKey}`)
  }, [navigate])

  // Get month info
  const month = selectedDate.getMonth() + 1
  const year = selectedDate.getFullYear()

  // Get schedule events for the month and convert to CalendarEvent format
  const monthEvents = useMemo(() => {
    // Calculate first and last day of month
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const startDate = formatDateKey(firstDay)
    const endDate = formatDateKey(lastDay)

    const scheduleEventsByDate = getEventsForDateRange(startDate, endDate)
    const calendarEvents = new Map<string, CalendarEvent[]>()

    // Convert schedule events to CalendarEvent format
    scheduleEventsByDate.forEach((scheduleEvents, date) => {
      const convertedEvents: CalendarEvent[] = scheduleEvents.map(event => ({
        id: event.id,
        date: event.date,
        title: `${formatTime24to12(event.startTime)} ${event.leadName || event.title}`,
        type: event.type === 'follow-up' ? 'appointment' : event.type === 'task' ? 'plan' : 'appointment',
        time: formatTime24to12(event.startTime),
        status: event.status,
      }))

      calendarEvents.set(date, convertedEvents)
    })

    return calendarEvents
  }, [getEventsForDateRange, month, year])

  // Get scheduled events for day/week views
  const dayEvents = useMemo(
    () => getEventsForDate(selectedDateKey),
    [getEventsForDate, selectedDateKey]
  )

  const weekEventsByDate = useMemo(() => {
    const startDate = formatDateKey(weekDates[0])
    const endDate = formatDateKey(weekDates[6])
    return getEventsForDateRange(startDate, endDate)
  }, [getEventsForDateRange, weekDates])

  // Current day for month view highlighting
  const today = new Date()
  const currentDay =
    today.getMonth() + 1 === month && today.getFullYear() === year
      ? today.getDate()
      : -1

  const handleAddEvent = () => {
    setEditingEvent(undefined)
    setModalOpen(true)
  }

  const handleEventClick = (event: ScheduleEvent) => {
    setEditingEvent(event)
    setModalOpen(true)
  }

  const handleSaveEvent = (eventData: Omit<ScheduleEvent, 'id' | 'status'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData)
    } else {
      addEvent(eventData)
    }
    setModalOpen(false)
    setEditingEvent(undefined)
  }

  // Delete event from calendar and remove from plan
  const handleDeleteEvent = useCallback((eventId: string, leadId?: string, eventDate?: string) => {
    // Delete from calendar
    deleteEvent(eventId)

    // If event has a lead, also remove from the plan for that date
    if (leadId && eventDate) {
      const [year, month, day] = eventDate.split('-').map(Number)
      const eventDateObj = new Date(year, month - 1, day)
      removeStopByLeadId(leadId, eventDateObj)
    }

    setModalOpen(false)
    setEditingEvent(undefined)
  }, [deleteEvent, removeStopByLeadId])

  const handleMarkComplete = (eventId: string) => {
    // Find the event to check its current status
    const event = dayEvents.find(e => e.id === eventId)
    if (event) {
      if (event.status === 'completed') {
        markPending(eventId)
      } else {
        markComplete(eventId)
      }
    }
  }

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() - 1)
    switchToDayView(newDate)
    setViewMode('month')
  }

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + 1)
    switchToDayView(newDate)
    setViewMode('month')
  }

  return (
    <div className="px-[80px] pt-4 pb-8 h-full flex flex-col">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#46494B]">Calendar</h1>
        <CalendarViewSwitcher value={viewMode} onChange={setViewMode} />
      </div>

      {/* Calendar content */}
      <Card padding="lg" className="rounded-[24px] flex-1 flex flex-col overflow-hidden">
        {viewMode === 'day' && (
          <DayView
            selectedDate={selectedDate}
            events={dayEvents}
            onAddEvent={handleAddEvent}
            onEventClick={handleEventClick}
            onMarkComplete={handleMarkComplete}
            onPrevDay={goToPrevious}
            onNextDay={goToNext}
            onToday={goToToday}
            hasPlanForDate={hasPlanForDate}
            onViewPlan={handleViewPlan}
          />
        )}

        {viewMode === 'week' && (
          <WeekView
            selectedDate={selectedDate}
            weekDates={weekDates}
            eventsByDate={weekEventsByDate}
            onDayClick={switchToDayView}
            onPrevWeek={goToPrevious}
            onNextWeek={goToNext}
            onToday={goToToday}
            onAddEvent={handleAddEvent}
          />
        )}

        {viewMode === 'month' && (
          <>
            <CalendarHeader
              month={month}
              year={year}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onAddEvent={handleAddEvent}
            />
            <CalendarGrid
              month={month}
              year={year}
              events={monthEvents}
              currentDay={currentDay}
              onDayClick={switchToDayView}
            />
          </>
        )}
      </Card>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingEvent(undefined)
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialDate={selectedDate}
        editingEvent={editingEvent}
      />
    </div>
  )
}
