import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FieldRep } from '@/data/admin-types'

interface RepSelectorProps {
  reps: FieldRep[]
  value: string | null
  onChange: (repId: string | null) => void
  className?: string
}

export function RepSelector({ reps, value, onChange, className }: RepSelectorProps) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value || null)}
        className={cn(
          'appearance-none bg-white border border-[#DFEBF4] rounded-full',
          'px-4 py-2 pr-10 text-sm font-medium text-[#46494B]',
          'cursor-pointer hover:border-[#0061AA] focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20'
        )}
      >
        <option value="">All Reps</option>
        {reps.map(rep => (
          <option key={rep.id} value={rep.id}>
            {rep.name}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#778188] pointer-events-none"
      />
    </div>
  )
}
