import { X, AlertCircle } from 'lucide-react'
import { Card, Avatar } from '@/components/shared'
import { StopsTable } from './StopsTable'
import type { AdminStopRecord, RepPerformance } from '@/data/admin-types'
import type { SortField, SortDirection } from '@/hooks/useAdminDashboard'

interface EmployeeStopsModalProps {
  employee: RepPerformance
  stops: AdminStopRecord[]
  sortBy: SortField
  sortDir: SortDirection
  hasAlert: boolean
  onSort: (field: SortField) => void
  onClickStop: (stop: AdminStopRecord) => void
  onDismissAlert: (repId: string) => void
  onClose: () => void
}

export function EmployeeStopsModal({
  employee,
  stops,
  sortBy,
  sortDir,
  hasAlert,
  onSort,
  onClickStop,
  onDismissAlert,
  onClose,
}: EmployeeStopsModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-[960px] max-h-[80vh] overflow-hidden z-10" padding="none">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#DFEBF4]">
          <div className="flex items-center gap-3">
            <Avatar initials={employee.repInitials} size="lg" />
            <div>
              <h2 className="text-lg font-semibold text-[#46494B]">{employee.repName}</h2>
              <p className="text-sm text-[#778188]">
                {employee.completedStops}/{employee.totalStops} stops completed • {employee.totalSales} sales • {employee.conversionRate.toFixed(0)}% conversion
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasAlert && (
              <button
                onClick={() => onDismissAlert(employee.repId)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
              >
                <AlertCircle size={14} />
                Remove Alert
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-[#778188] hover:text-[#46494B] rounded-full hover:bg-[#F0F5F7]"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Stops Table */}
        <div className="max-h-[calc(80vh-100px)] overflow-y-auto">
          <StopsTable
            stops={stops}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={onSort}
            onClickStop={onClickStop}
          />
        </div>
      </Card>
    </div>
  )
}
