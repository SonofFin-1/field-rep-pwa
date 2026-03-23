import { useState } from 'react'
import { Card } from '@/components/shared'
import { EmployeeTableHeader } from './EmployeeTableHeader'
import { EmployeeTableRow } from './EmployeeTableRow'
import type { RepPerformance, EmployeeSortField, DateRangeFilter } from '@/data/admin-types'
import type { SortDirection } from '@/hooks/useAdminDashboard'

interface EmployeeTableProps {
  employees: RepPerformance[]
  sortBy: EmployeeSortField
  sortDir: SortDirection
  dateRange: DateRangeFilter
  dismissedAlerts: Set<string>
  onSort: (field: EmployeeSortField) => void
  onClickEmployee: (employee: RepPerformance) => void
}

export function EmployeeTable({
  employees,
  sortBy,
  sortDir,
  dateRange,
  dismissedAlerts,
  onSort,
  onClickEmployee,
}: EmployeeTableProps) {
  const [activeWarningId, setActiveWarningId] = useState<string | null>(null)

  const handleWarningToggle = (repId: string) => {
    setActiveWarningId(prev => (prev === repId ? null : repId))
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <EmployeeTableHeader sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
      <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
        {employees.length === 0 ? (
          <div className="py-12 text-center text-[#778188]">
            No employees found.
          </div>
        ) : (
          employees.map(employee => (
            <EmployeeTableRow
              key={employee.repId}
              employee={employee}
              dateRange={dateRange}
              showWarning={activeWarningId === employee.repId}
              isAlertDismissed={dismissedAlerts.has(employee.repId)}
              onWarningToggle={handleWarningToggle}
              onClick={onClickEmployee}
            />
          ))
        )}
      </div>
    </Card>
  )
}
