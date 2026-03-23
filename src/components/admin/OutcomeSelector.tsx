import { cn } from '@/lib/utils'
import type { OutcomeFilter } from '@/data/admin-types'

interface OutcomeSelectorProps {
  value: OutcomeFilter
  onChange: (value: OutcomeFilter) => void
  className?: string
}

const options: { value: OutcomeFilter; label: string }[] = [
  { value: 'sale', label: 'Sale' },
  { value: 'callback', label: 'Callback' },
  { value: 'not_interested', label: 'Not Interested' },
  { value: 'not_home', label: 'Not Home' },
  { value: 'all', label: 'All' },
]

export function OutcomeSelector({ value, onChange, className }: OutcomeSelectorProps) {
  return (
    <div className={cn('flex items-center bg-[#F0F5F7] rounded-full p-1', className)}>
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap',
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
