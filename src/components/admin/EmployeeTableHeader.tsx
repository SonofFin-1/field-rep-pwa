import { ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EmployeeSortField } from '@/data/admin-types'
import type { SortDirection } from '@/hooks/useAdminDashboard'

interface EmployeeTableHeaderProps {
  sortBy: EmployeeSortField
  sortDir: SortDirection
  onSort: (field: EmployeeSortField) => void
}

interface ColumnConfig {
  field: EmployeeSortField | null
  label: string
  width: string
  sortable: boolean
  align?: 'left' | 'center' | 'right'
}

const columns: ColumnConfig[] = [
  { field: 'name', label: 'Employee', width: 'flex-1', sortable: true },
  { field: 'completion', label: 'Stops', width: 'w-[200px]', sortable: true },
  { field: 'rating', label: 'Avg Stop Rating', width: 'w-[140px]', sortable: true },
  { field: null, label: '', width: 'w-[40px]', sortable: false }, // Arrow column
]

export function EmployeeTableHeader({ sortBy, sortDir, onSort }: EmployeeTableHeaderProps) {
  return (
    <div className="flex items-center py-3 px-4 border-b border-[#DFEBF4] bg-[#F8FAFC]">
      {columns.map((col, index) => (
        <div
          key={index}
          className={cn(
            col.width,
            col.align === 'center' && 'text-center',
            col.align === 'right' && 'text-right',
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
