import { Card } from '@/components/shared'
import { LeadsTableHeader } from './LeadsTableHeader'
import { LeadsTableRow } from './LeadsTableRow'
import type { Lead } from '@/data/types'
import type { SortField, SortDirection } from '@/hooks/useLeads'

interface LeadsTableProps {
  leads: Lead[]
  sortBy: SortField
  sortDir: SortDirection
  onSort: (field: SortField) => void
  onClickLead?: (lead: Lead) => void
}

export function LeadsTable({
  leads,
  sortBy,
  sortDir,
  onSort,
  onClickLead,
}: LeadsTableProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      <LeadsTableHeader
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={onSort}
      />
      <div>
        {leads.map(lead => (
          <LeadsTableRow key={lead.id} lead={lead} onClickName={onClickLead} />
        ))}
      </div>
    </Card>
  )
}
