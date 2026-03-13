import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

interface CalendarHeaderProps {
  month: number
  year: number
  onPrevMonth: () => void
  onNextMonth: () => void
  onAddEvent?: () => void
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function CalendarHeader({
  month,
  year,
  onPrevMonth,
  onNextMonth,
  onAddEvent,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-[#46494B]">
        {MONTH_NAMES[month - 1]} {year}
      </h2>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F0F5F7] hover:bg-[#DFEBF4] transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-[#46494B]" />
        </button>
        <button
          onClick={onNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F0F5F7] hover:bg-[#DFEBF4] transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-[#46494B]" />
        </button>
        {onAddEvent && (
          <button
            onClick={onAddEvent}
            className="flex items-center gap-2 px-4 py-2 bg-[#0061AA] text-white rounded-full hover:bg-[#004d88] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add</span>
          </button>
        )}
      </div>
    </div>
  )
}
