import { SearchBar } from '@/components/shared'
import { DateRangePicker } from './DateRangePicker'
import { RepSelector } from './RepSelector'
import type { DateRangeFilter, FieldRep } from '@/data/admin-types'

interface AdminToolbarProps {
  dateRange: DateRangeFilter
  onDateRangeChange: (value: DateRangeFilter) => void
  repId: string | null
  onRepChange: (repId: string | null) => void
  reps: FieldRep[]
  search: string
  onSearchChange: (value: string) => void
}

export function AdminToolbar({
  dateRange,
  onDateRangeChange,
  repId,
  onRepChange,
  reps,
  search,
  onSearchChange,
}: AdminToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
        <RepSelector reps={reps} value={repId} onChange={onRepChange} />
      </div>
      <SearchBar
        value={search}
        onChange={onSearchChange}
        placeholder="Search stops..."
        className="w-64"
      />
    </div>
  )
}
