import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import type { ScheduleEvent } from '@/data/types'
import {
  formatDateKey,
  formatShortDate,
  isSameDay,
  statusColors,
  formatTime24to12,
} from '@/lib/calendar-utils'
import { cn } from '@/lib/utils'

interface WeekViewProps {
  selectedDate: Date
  weekDates: Date[]
  eventsByDate: Map<string, ScheduleEvent[]>
  onDayClick: (date: Date) => void
  onPrevWeek: () => void
  onNextWeek: () => void
  onToday: () => void
  onAddEvent: () => void
}

function getMonthYearLabel(dates: Date[]): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const firstMonth = dates[0].getMonth()
  const lastMonth = dates[6].getMonth()
  const firstYear = dates[0].getFullYear()
  const lastYear = dates[6].getFullYear()

  if (firstYear !== lastYear) {
    return `${months[firstMonth]} ${firstYear} - ${months[lastMonth]} ${lastYear}`
  }
  if (firstMonth !== lastMonth) {
    return `${months[firstMonth]} - ${months[lastMonth]} ${firstYear}`
  }
  return `${months[firstMonth]} ${firstYear}`
}

export function WeekView({
  selectedDate,
  weekDates,
  eventsByDate,
  onDayClick,
  onPrevWeek,
  onNextWeek,
  onToday,
  onAddEvent,
}: WeekViewProps) {
  const today = new Date()
  const isThisWeek = weekDates.some(date => isSameDay(date, today))

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-[#46494B]">
            {getMonthYearLabel(weekDates)}
          </h2>
          {!isThisWeek && (
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
            onClick={onPrevWeek}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F0F5F7] hover:bg-[#DFEBF4] transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4 text-[#46494B]" />
          </button>
          <button
            onClick={onNextWeek}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F0F5F7] hover:bg-[#DFEBF4] transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="w-4 h-4 text-[#46494B]" />
          </button>
          <button
            onClick={onAddEvent}
            className="flex items-center gap-2 px-4 py-2 bg-[#0061AA] text-white rounded-full hover:bg-[#004d88] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add</span>
          </button>
        </div>
      </div>

      {/* Week grid */}
      <div className="flex-1 grid grid-cols-7 gap-2">
        {weekDates.map(date => {
          const dateKey = formatDateKey(date)
          const dayEvents = eventsByDate.get(dateKey) || []
          const isToday = isSameDay(date, today)
          const isSelected = isSameDay(date, selectedDate)

          return (
            <button
              key={dateKey}
              onClick={() => onDayClick(date)}
              className={cn(
                'flex flex-col rounded-lg border transition-colors text-left p-2 min-h-[150px]',
                isSelected
                  ? 'border-[#0061AA] bg-[#F0F5F7]'
                  : 'border-[#DFEBF4] hover:border-[#0061AA]/50 bg-white'
              )}
            >
              {/* Day header */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    'text-sm font-medium',
                    isToday ? 'text-[#0061AA]' : 'text-[#46494B]'
                  )}
                >
                  {formatShortDate(date)}
                </span>
                {isToday && (
                  <span className="w-2 h-2 rounded-full bg-[#0061AA]" />
                )}
              </div>

              {/* Events */}
              <div className="flex-1 space-y-1 overflow-y-auto">
                {dayEvents.map(event => {
                  const colors = statusColors[event.status]
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        'text-xs p-1.5 rounded truncate border-l-2',
                        colors.bg,
                        colors.border,
                        colors.text
                      )}
                    >
                      <span className="font-medium">
                        {formatTime24to12(event.startTime)}
                      </span>{' '}
                      {event.title}
                    </div>
                  )
                })}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
