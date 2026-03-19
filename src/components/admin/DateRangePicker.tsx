import { cn } from '@/lib/utils'
import type { DateRangeFilter } from '@/data/admin-types'

interface DateRangePickerProps {
  value: DateRangeFilter
  onChange: (value: DateRangeFilter) => void
  className?: string
}

const options: { value: DateRangeFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'all', label: 'All' },
]

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  return (
    <div className={cn('flex items-center bg-[#F0F5F7] rounded-full p-1', className)}>
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
            value === option.value
              ? 'bg-white text-[#0061AA] shadow-sm'
              : 'text-[#778188] hover:text-[#46494B]'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
