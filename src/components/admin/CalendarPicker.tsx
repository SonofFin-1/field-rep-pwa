import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarPickerProps {
  value: string | null // YYYY-MM-DD format
  onChange: (date: string | null) => void
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function CalendarPicker({ value, onChange }: CalendarPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value + 'T00:00:00')
    return new Date()
  })
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  // Generate calendar days
  const days: (number | null)[] = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const handleSelectDate = (day: number) => {
    const selected = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange(selected)
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange(null)
    setIsOpen(false)
  }

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const isSelected = (day: number) => {
    if (!value) return false
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return dateStr === value
  }

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center bg-[#F0F5F7] rounded-full p-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
            value
              ? 'bg-white text-[#0061AA] shadow-sm'
              : 'text-[#778188] hover:text-[#46494B]'
          )}
        >
          <Calendar size={16} />
          {value ? formatDisplayDate(value) : 'Select Date'}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-[#DFEBF4] rounded-lg shadow-lg p-3 w-64">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-[#F0F5F7] rounded-full transition-colors"
            >
              <ChevronLeft size={18} className="text-[#778188]" />
            </button>
            <span className="text-sm font-semibold text-[#46494B]">
              {MONTHS[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-[#F0F5F7] rounded-full transition-colors"
            >
              <ChevronRight size={18} className="text-[#778188]" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map(day => (
              <div key={day} className="text-center text-xs font-medium text-[#778188] py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => (
              <div key={i} className="aspect-square">
                {day && (
                  <button
                    onClick={() => handleSelectDate(day)}
                    className={cn(
                      'w-full h-full flex items-center justify-center text-sm rounded-full transition-colors',
                      isSelected(day)
                        ? 'bg-[#0061AA] text-white'
                        : isToday(day)
                        ? 'bg-[#F0F5F7] text-[#0061AA] font-semibold'
                        : 'text-[#46494B] hover:bg-[#F0F5F7]'
                    )}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Clear button */}
          {value && (
            <button
              onClick={handleClear}
              className="w-full mt-3 py-1.5 text-sm text-[#778188] hover:text-[#46494B] transition-colors"
            >
              Clear selection
            </button>
          )}
        </div>
      )}
    </div>
  )
}
