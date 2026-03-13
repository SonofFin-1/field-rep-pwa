import type { CalendarEvent as CalendarEventType } from '@/data/types'
import { CalendarDay } from './CalendarDay'

interface CalendarGridProps {
  month: number
  year: number
  events: Map<string, CalendarEventType[]>
  currentDay: number
  onDayClick?: (date: Date) => void
}

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfMonth(month: number, year: number): number {
  return new Date(year, month - 1, 1).getDay()
}

function formatDateKey(year: number, month: number, day: number): string {
  const monthStr = month.toString().padStart(2, '0')
  const dayStr = day.toString().padStart(2, '0')
  return `${year}-${monthStr}-${dayStr}`
}

export function CalendarGrid({
  month,
  year,
  events,
  currentDay,
  onDayClick,
}: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(month, year)
  const firstDayOfMonth = getFirstDayOfMonth(month, year)

  // Build calendar grid
  const calendarDays: (number | null)[] = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Fill remaining cells to complete the last week
  const remainingCells = 7 - (calendarDays.length % 7)
  if (remainingCells < 7) {
    for (let i = 0; i < remainingCells; i++) {
      calendarDays.push(null)
    }
  }

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[#DFEBF4]">
        {DAY_HEADERS.map(day => (
          <div
            key={day}
            className="py-3 text-center text-sm font-medium text-[#778188]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dateKey = day ? formatDateKey(year, month, day) : ''
          const dayEvents = day ? events.get(dateKey) || [] : []

          return (
            <CalendarDay
              key={index}
              day={day}
              events={dayEvents}
              isCurrentDay={day === currentDay}
              isCurrentMonth={true}
              onClick={day && onDayClick ? () => onDayClick(new Date(year, month - 1, day)) : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}
