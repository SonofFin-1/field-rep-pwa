import { useState, useRef, useEffect, useMemo } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

interface PlanDatePickerProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  hasPlanForDate?: (date: Date) => boolean
  className?: string
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function formatShortDate(date: Date): string {
  const month = MONTH_NAMES[date.getMonth()].slice(0, 3)
  return `${month} ${date.getDate()}`
}

export function PlanDatePicker({
  selectedDate,
  onDateChange,
  hasPlanForDate,
  className = '',
}: PlanDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(() => new Date(selectedDate))
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Reset view month when selected date changes externally
  useEffect(() => {
    setViewMonth(new Date(selectedDate))
  }, [selectedDate])

  const today = useMemo(() => new Date(), [])

  // Generate calendar days for the current view month
  const calendarDays = useMemo(() => {
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    const startDayOfWeek = firstDay.getDay()

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    // Build array of days
    const days: (Date | null)[] = []

    // Add empty slots for days before the first day
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }, [viewMonth])

  const handlePrevMonth = () => {
    setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handleSelectDate = (date: Date) => {
    onDateChange(date)
    setIsOpen(false)
  }

  const isToday = isSameDay(selectedDate, today)

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#DFEBF4] text-[#46494B] text-sm font-medium rounded-full hover:bg-[#F0F5F7] transition-colors"
      >
        <Calendar className="w-4 h-4 text-[#778188]" />
        <span>{isToday ? 'Today' : formatShortDate(selectedDate)}</span>
      </button>

      {/* Dropdown Calendar - opens above since we're in the bottom bar */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-[280px] bg-white border border-[#DFEBF4] rounded-[14px] shadow-lg z-50 p-4">
          {/* Month/Year Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-[#F0F5F7] rounded-full transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#778188]" />
            </button>
            <span className="text-sm font-semibold text-[#46494B]">
              {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-[#F0F5F7] rounded-full transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#778188]" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAY_NAMES.map(day => (
              <div
                key={day}
                className="text-center text-xs font-medium text-[#778188] py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="w-8 h-8" />
              }

              const isSelected = isSameDay(date, selectedDate)
              const isCurrentDay = isSameDay(date, today)
              const hasPlan = hasPlanForDate?.(date) ?? false

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => handleSelectDate(date)}
                  className={`
                    relative w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors
                    ${isSelected
                      ? 'bg-[#0061AA] text-white font-semibold'
                      : isCurrentDay
                        ? 'bg-[#F0F5F7] text-[#0061AA] font-semibold'
                        : 'text-[#46494B] hover:bg-[#F0F5F7]'
                    }
                  `}
                >
                  {date.getDate()}
                  {/* Plan indicator dot */}
                  {hasPlan && !isSelected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0061AA]" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-3 border-t border-[#DFEBF4] flex gap-2">
            <button
              type="button"
              onClick={() => handleSelectDate(today)}
              className={`flex-1 py-2 text-xs font-medium rounded-full transition-colors ${
                isToday
                  ? 'bg-[#0061AA] text-white'
                  : 'bg-[#F0F5F7] text-[#46494B] hover:bg-[#DFEBF4]'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleSelectDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1))}
              className="flex-1 py-2 text-xs font-medium bg-[#F0F5F7] text-[#46494B] rounded-full hover:bg-[#DFEBF4] transition-colors"
            >
              Tomorrow
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
