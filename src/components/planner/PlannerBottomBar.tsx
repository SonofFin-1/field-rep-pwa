import { Avatar } from '@/components/shared'
import { PlanDatePicker } from './PlanDatePicker'

interface PlannerBottomBarProps {
  selectedCount: number
  onCreatePlan: () => void
  existingPlanCount?: number
  onViewPlan?: () => void
  selectedDate: Date
  onDateChange: (date: Date) => void
  hasPlanForDate?: (date: Date) => boolean
}

function formatDateLabel(date: Date): string {
  const today = new Date()
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return 'Today'
  }

  if (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  ) {
    return 'Tomorrow'
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getDate()}`
}

export function PlannerBottomBar({
  selectedCount,
  onCreatePlan,
  existingPlanCount = 0,
  onViewPlan,
  selectedDate,
  onDateChange,
  hasPlanForDate,
}: PlannerBottomBarProps) {
  const dateLabel = formatDateLabel(selectedDate)

  return (
    <div className="absolute bottom-0 left-0 right-0 w-[374px] bg-white border-t border-[#DFEBF4] px-3 py-2">
      {/* Top row: Avatar, selection count, date picker */}
      <div className="flex items-center gap-2 mb-2">
        <Avatar initials="MN" size="sm" />
        <span className="text-xs font-medium text-[#46494B]">
          {selectedCount} Selected
        </span>
        <div className="ml-auto">
          <PlanDatePicker
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            hasPlanForDate={hasPlanForDate}
          />
        </div>
      </div>

      {/* Bottom row: Buttons */}
      <div className="flex items-center gap-2">
        {existingPlanCount > 0 && onViewPlan && (
          <button
            type="button"
            onClick={onViewPlan}
            className="flex-1 px-3 py-2 border-2 border-[#0061AA] text-[#0061AA] text-xs font-semibold rounded-full hover:bg-[#F0F5F7] transition-colors"
          >
            View Plan ({existingPlanCount})
          </button>
        )}

        <button
          type="button"
          onClick={onCreatePlan}
          disabled={selectedCount === 0}
          className="flex-1 px-3 py-2 bg-[#0061AA] text-white text-xs font-semibold rounded-full hover:bg-[#005090] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Plan for {dateLabel}
        </button>
      </div>
    </div>
  )
}
