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
    <div className="absolute bottom-0 left-0 right-0 h-[72px] bg-white border-t border-[#DFEBF4] flex items-center px-4 gap-4">
      <Avatar initials="MN" size="sm" />

      <span className="text-sm font-medium text-[#46494B]">
        {selectedCount} Leads Selected
      </span>

      <div className="ml-auto flex items-center gap-3">
        <PlanDatePicker
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          hasPlanForDate={hasPlanForDate}
        />

        {existingPlanCount > 0 && onViewPlan && (
          <button
            type="button"
            onClick={onViewPlan}
            className="px-5 py-2.5 border-2 border-[#0061AA] text-[#0061AA] text-sm font-semibold rounded-full hover:bg-[#F0F5F7] transition-colors"
          >
            View Plan ({existingPlanCount})
          </button>
        )}

        <button
          type="button"
          onClick={onCreatePlan}
          disabled={selectedCount === 0}
          className="px-6 py-2.5 bg-[#0061AA] text-white text-sm font-semibold rounded-full hover:bg-[#005090] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Plan for {dateLabel}
        </button>
      </div>
    </div>
  )
}
