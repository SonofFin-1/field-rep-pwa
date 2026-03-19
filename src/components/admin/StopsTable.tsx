import { Card } from '@/components/shared'
import { StopsTableHeader } from './StopsTableHeader'
import { StopsTableRow } from './StopsTableRow'
import type { AdminStopRecord } from '@/data/admin-types'
import type { SortField, SortDirection } from '@/hooks/useAdminDashboard'

interface StopsTableProps {
  stops: AdminStopRecord[]
  sortBy: SortField
  sortDir: SortDirection
  onSort: (field: SortField) => void
  onClickStop: (stop: AdminStopRecord) => void
}

export function StopsTable({
  stops,
  sortBy,
  sortDir,
  onSort,
  onClickStop,
}: StopsTableProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      <StopsTableHeader sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
      <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
        {stops.length === 0 ? (
          <div className="py-12 text-center text-[#778188]">
            No stops found for the selected filters.
          </div>
        ) : (
          stops.map(stop => (
            <StopsTableRow key={stop.id} stop={stop} onClick={onClickStop} />
          ))
        )}
      </div>
    </Card>
  )
}
