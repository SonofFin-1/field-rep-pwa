import { ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SortField, SortDirection } from '@/hooks/useAdminDashboard'

interface StopsTableHeaderProps {
  sortBy: SortField
  sortDir: SortDirection
  onSort: (field: SortField) => void
}

interface ColumnConfig {
  field: SortField | null
  label: string
  width: string
  sortable: boolean
  align?: 'left' | 'center'
}

const columns: ColumnConfig[] = [
  { field: 'rep', label: 'Rep', width: 'w-[80px]', sortable: true },
  { field: 'lead', label: 'Lead', width: 'w-[180px]', sortable: true },
  { field: null, label: 'Address', width: 'w-[220px]', sortable: false },
  { field: 'date', label: 'Date', width: 'w-[100px]', sortable: true },
  { field: 'status', label: 'Status', width: 'w-[100px]', sortable: true },
  { field: null, label: 'Notes', width: 'w-[80px]', sortable: false, align: 'center' },
  { field: 'rating', label: 'Rating', width: 'w-[120px]', sortable: true },
]

export function StopsTableHeader({ sortBy, sortDir, onSort }: StopsTableHeaderProps) {
  return (
    <div className="flex items-center py-3 px-4 border-b border-[#DFEBF4] bg-[#F8FAFC]">
      {columns.map((col, index) => (
        <div
          key={index}
          className={cn(
            col.width,
            col.align === 'center' && 'text-center',
            col.sortable && 'cursor-pointer hover:text-[#0061AA]',
            col.field && sortBy === col.field ? 'text-[#0061AA]' : 'text-[#778188]'
          )}
          onClick={() => col.sortable && col.field && onSort(col.field)}
        >
          <span className="text-xs font-medium uppercase tracking-wide flex items-center gap-1">
            {col.label}
            {col.sortable && col.field && sortBy === col.field && (
              <ArrowUpDown size={12} className={sortDir === 'asc' ? 'rotate-180' : ''} />
            )}
          </span>
        </div>
      ))}
    </div>
  )
}
