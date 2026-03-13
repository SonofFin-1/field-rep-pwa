import { ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SortField, SortDirection } from '@/hooks/useLeads'

interface LeadsTableHeaderProps {
  sortBy: SortField
  sortDir: SortDirection
  onSort: (field: SortField) => void
}

interface ColumnConfig {
  field: SortField | null
  label: string
  sortable: boolean
  className: string
}

const columns: ColumnConfig[] = [
  { field: 'name', label: 'Name', sortable: true, className: 'w-[240px] pl-4' },
  { field: 'score', label: 'Score', sortable: true, className: 'w-[100px]' },
  { field: 'location', label: 'Location', sortable: true, className: 'w-[200px]' },
  { field: 'value', label: 'Value', sortable: true, className: 'w-[100px]' },
  { field: null, label: 'Status', sortable: false, className: 'w-[120px]' },
  { field: null, label: 'Contact', sortable: false, className: 'w-[140px] pr-4' },
]

export function LeadsTableHeader({
  sortBy,
  sortDir: _sortDir,
  onSort,
}: LeadsTableHeaderProps) {
  return (
    <div className="flex items-center py-3 border-b border-[#DFEBF4]">
      {columns.map((column, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-1 text-sm font-medium text-[#778188]',
            column.className,
            column.sortable && 'cursor-pointer hover:text-[#46494B] select-none'
          )}
          onClick={() => column.sortable && column.field && onSort(column.field)}
        >
          <span>{column.label}</span>
          {column.sortable && (
            <ArrowUpDown
              className={cn(
                'w-3.5 h-3.5',
                column.field === sortBy
                  ? 'text-[#0061AA]'
                  : 'text-[#778188]'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
