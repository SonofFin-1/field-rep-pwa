import { useMemo } from 'react'
import { Plus, ChevronLeft, ChevronRight, Map } from 'lucide-react'
import type { ScheduleEvent } from '@/data/types'
import { DayViewEvent } from './DayViewEvent'
import {
  formatFullDate,
  TIMELINE_START_HOUR,
  TIMELINE_END_HOUR,
  HOUR_HEIGHT_PX,
  calculateEventPosition,
  calculateEventHeight,
  getHourFromTime,
  getMinutesFromTime,
} from '@/lib/calendar-utils'

interface EventWithLayout extends ScheduleEvent {
  column: number
  totalColumns: number
}

function getTimeInMinutes(time: string): number {
  return getHourFromTime(time) * 60 + getMinutesFromTime(time)
}

function eventsOverlap(a: ScheduleEvent, b: ScheduleEvent): boolean {
  const aStart = getTimeInMinutes(a.startTime)
  const aEnd = getTimeInMinutes(a.endTime)
  const bStart = getTimeInMinutes(b.startTime)
  const bEnd = getTimeInMinutes(b.endTime)
  return aStart < bEnd && bStart < aEnd
}

function calculateEventColumns(events: ScheduleEvent[]): EventWithLayout[] {
  if (events.length === 0) return []

  // Sort events by start time, then by end time (longer events first)
  const sortedEvents = [...events].sort((a, b) => {
    const aStart = getTimeInMinutes(a.startTime)
    const bStart = getTimeInMinutes(b.startTime)
    if (aStart !== bStart) return aStart - bStart
    const aEnd = getTimeInMinutes(a.endTime)
    const bEnd = getTimeInMinutes(b.endTime)
    return bEnd - aEnd // Longer events first
  })

  const result: EventWithLayout[] = []
  const columns: ScheduleEvent[][] = []

  for (const event of sortedEvents) {
    // Find first column where this event doesn't overlap with existing events
    let placed = false
    for (let col = 0; col < columns.length; col++) {
      const columnEvents = columns[col]
      const hasOverlap = columnEvents.some(e => eventsOverlap(e, event))
      if (!hasOverlap) {
        columns[col].push(event)
        result.push({ ...event, column: col, totalColumns: 0 })
        placed = true
        break
      }
    }

    if (!placed) {
      // Create new column
      columns.push([event])
      result.push({ ...event, column: columns.length - 1, totalColumns: 0 })
    }
  }

  // Now calculate totalColumns for each event based on its overlap group
  // Group events that overlap with each other
  for (let i = 0; i < result.length; i++) {
    const event = result[i]
    let maxColumn = event.column

    // Find all events that overlap with this one
    for (let j = 0; j < result.length; j++) {
      if (i !== j && eventsOverlap(event, result[j])) {
        maxColumn = Math.max(maxColumn, result[j].column)
      }
    }

    result[i].totalColumns = maxColumn + 1
  }

  return result
}

interface DayViewProps {
  selectedDate: Date
  events: ScheduleEvent[]
  onAddEvent: () => void
  onEventClick: (event: ScheduleEvent) => void
  onMarkComplete?: (eventId: string) => void
  onPrevDay: () => void
  onNextDay: () => void
  onToday: () => void
  hasPlanForDate?: (date: Date) => boolean
  onViewPlan?: (date: Date) => void
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM'
  if (hour === 12) return '12 PM'
  if (hour < 12) return `${hour} AM`
  return `${hour - 12} PM`
}

export function DayView({
  selectedDate,
  events,
  onAddEvent,
  onEventClick,
  onMarkComplete,
  onPrevDay,
  onNextDay,
  onToday,
  hasPlanForDate,
  onViewPlan,
}: DayViewProps) {
  const hours = useMemo(() => {
    const result: number[] = []
    for (let i = TIMELINE_START_HOUR; i <= TIMELINE_END_HOUR; i++) {
      result.push(i)
    }
    return result
  }, [])

  const isToday = useMemo(() => {
    const today = new Date()
    return (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate()
    )
  }, [selectedDate])

  const currentTimePosition = useMemo(() => {
    if (!isToday) return null
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    if (hours < TIMELINE_START_HOUR || hours > TIMELINE_END_HOUR) return null
    // Calculate position: hours * HOUR_HEIGHT_PX + scaled minutes
    return (hours - TIMELINE_START_HOUR) * HOUR_HEIGHT_PX + (minutes * HOUR_HEIGHT_PX / 60)
  }, [isToday])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-[#46494B]">
            {formatFullDate(selectedDate)}
          </h2>
          {!isToday && (
            <button
              onClick={onToday}
              className="px-3 py-1 text-sm font-medium text-[#0061AA] hover:bg-[#F0F5F7] rounded-full transition-colors"
            >
              Return to Today
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevDay}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F0F5F7] hover:bg-[#DFEBF4] transition-colors"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4 text-[#46494B]" />
          </button>
          <button
            onClick={onNextDay}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F0F5F7] hover:bg-[#DFEBF4] transition-colors"
            aria-label="Next day"
          >
            <ChevronRight className="w-4 h-4 text-[#46494B]" />
          </button>
          {hasPlanForDate?.(selectedDate) && onViewPlan && (
            <button
              onClick={() => onViewPlan(selectedDate)}
              className="flex items-center gap-2 px-4 py-2 border border-[#0061AA] text-[#0061AA] rounded-full hover:bg-[#F0F5F7] transition-colors"
            >
              <Map className="w-4 h-4" />
              <span className="text-sm font-medium">View Plan</span>
            </button>
          )}
          <button
            onClick={onAddEvent}
            className="flex items-center gap-2 px-4 py-2 bg-[#0061AA] text-white rounded-full hover:bg-[#004d88] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add</span>
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto border border-[#DFEBF4] rounded-lg bg-white">
        <div className="relative" style={{ height: `${hours.length * HOUR_HEIGHT_PX}px` }}>
          {/* Hour lines */}
          {hours.map((hour, index) => (
            <div
              key={hour}
              className="absolute left-0 right-0 border-t border-[#DFEBF4]"
              style={{ top: `${index * HOUR_HEIGHT_PX}px` }}
            >
              <span className="absolute left-2 -top-3 text-xs text-[#778188] bg-white px-1">
                {formatHour(hour)}
              </span>
            </div>
          ))}

          {/* Current time indicator */}
          {currentTimePosition !== null && (
            <div
              className="absolute left-[50px] right-0 flex items-center z-10"
              style={{ top: `${currentTimePosition}px` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1.5" />
              <div className="flex-1 h-0.5 bg-red-500" />
            </div>
          )}

          {/* Events with overlap handling */}
          {calculateEventColumns(events).map(event => {
            const top = calculateEventPosition(event.startTime, TIMELINE_START_HOUR)
            const height = calculateEventHeight(event.startTime, event.endTime)

            return (
              <DayViewEvent
                key={event.id}
                event={event}
                onClick={onEventClick}
                onMarkComplete={onMarkComplete}
                column={event.column}
                totalColumns={event.totalColumns}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
