import { SearchBar } from '@/components/shared'
import { CalendarPicker } from './CalendarPicker'
import { DateRangePicker } from './DateRangePicker'
import { OutcomeSelector } from './OutcomeSelector'
import type { DateRangeFilter, OutcomeFilter } from '@/data/admin-types'

interface AdminToolbarProps {
  dateRange: DateRangeFilter
  onDateRangeChange: (value: DateRangeFilter) => void
  specificDate: string | null
  onSpecificDateChange: (value: string | null) => void
  outcome: OutcomeFilter
  onOutcomeChange: (value: OutcomeFilter) => void
  search: string
  onSearchChange: (value: string) => void
}

export function AdminToolbar({
  dateRange,
  onDateRangeChange,
  specificDate,
  onSpecificDateChange,
  outcome,
  onOutcomeChange,
  search,
  onSearchChange,
}: AdminToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
        <CalendarPicker value={specificDate} onChange={onSpecificDateChange} />
        <OutcomeSelector value={outcome} onChange={onOutcomeChange} />
      </div>
      <SearchBar
        value={search}
        onChange={onSearchChange}
        placeholder="Search employees..."
        className="w-64"
      />
    </div>
  )
}
