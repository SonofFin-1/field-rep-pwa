import { ChevronRight, AlertCircle } from 'lucide-react'
import { Avatar } from '@/components/shared'
import { StopsProgressBar } from './StopsProgressBar'
import { RatingDisplay } from './RatingDisplay'
import type { RepPerformance, DateRangeFilter } from '@/data/admin-types'

interface EmployeeTableRowProps {
  employee: RepPerformance
  dateRange: DateRangeFilter
  showWarning: boolean
  isAlertDismissed: boolean
  onWarningToggle: (repId: string) => void
  onClick: (employee: RepPerformance) => void
}

const periodLabels: Record<DateRangeFilter, string> = {
  today: 'day',
  week: 'week',
  month: 'month',
  all: 'selected period',
}

export function EmployeeTableRow({ employee, dateRange, showWarning, isAlertDismissed, onWarningToggle, onClick }: EmployeeTableRowProps) {
  const handleWarningClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onWarningToggle(employee.repId)
  }

  return (
    <div
      onClick={() => onClick(employee)}
      className="flex items-center py-3 px-4 border-b border-[#DFEBF4] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
    >
      {/* Employee */}
      <div className="flex-1 flex items-center gap-3 relative">
        <Avatar initials={employee.repInitials} size="md" />
        <span className="text-sm text-[#0061AA] font-medium truncate">
          {employee.repName}
        </span>
        {employee.hasIncompletePastStops && !isAlertDismissed && (
          <div className="relative flex items-center">
            <button
              onClick={handleWarningClick}
              className="p-1 hover:bg-red-100 rounded-full transition-colors flex items-center justify-center"
            >
              <AlertCircle size={20} className="text-red-500" />
            </button>
            {showWarning && (
              <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-72 p-2 bg-white border border-[#DFEBF4] rounded-lg shadow-lg text-sm text-[#46494B]">
                {employee.repName} missed {employee.missedStops} {employee.missedStops === 1 ? 'stop' : 'stops'} this {periodLabels[dateRange]}.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stops Progress */}
      <div className="w-[200px] pr-4">
        <StopsProgressBar
          completed={employee.completedStops}
          total={employee.totalStops}
        />
      </div>

      {/* Avg Stop Rating */}
      <div className="w-[140px]">
        <RatingDisplay rating={employee.averageRating} showNumeric={false} />
      </div>

      {/* Arrow */}
      <div className="w-[40px] flex items-center justify-center">
        <ChevronRight size={18} className="text-[#778188]" />
      </div>
    </div>
  )
}
