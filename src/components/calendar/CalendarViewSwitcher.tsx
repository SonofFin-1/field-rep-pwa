import type { CalendarViewMode } from '@/data/types'
import { cn } from '@/lib/utils'

interface CalendarViewSwitcherProps {
  value: CalendarViewMode
  onChange: (mode: CalendarViewMode) => void
}

const views: { value: CalendarViewMode; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

export function CalendarViewSwitcher({
  value,
  onChange,
}: CalendarViewSwitcherProps) {
  return (
    <div className="inline-flex bg-[#F0F5F7] rounded-full p-1">
      {views.map(view => (
        <button
          key={view.value}
          onClick={() => onChange(view.value)}
          className={cn(
            'px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
            value === view.value
              ? 'bg-white text-[#46494B] shadow-sm'
              : 'text-[#778188] hover:text-[#46494B]'
          )}
        >
          {view.label}
        </button>
      ))}
    </div>
  )
}
