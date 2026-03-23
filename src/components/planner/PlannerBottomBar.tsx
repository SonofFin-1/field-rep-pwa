import { Avatar } from '@/components/shared'
import { PlanDatePicker } from './PlanDatePicker'

interface PlannerBottomBarProps {
  onGenerateRoute: () => void
  existingPlanCount?: number
  onViewPlan?: () => void
  selectedDate: Date
  onDateChange: (date: Date) => void
  hasPlanForDate?: (date: Date) => boolean
}

export function PlannerBottomBar({
  onGenerateRoute,
  existingPlanCount = 0,
  onViewPlan,
  selectedDate,
  onDateChange,
  hasPlanForDate,
}: PlannerBottomBarProps) {

  return (
    <div className="absolute bottom-0 left-0 right-0 w-[374px] bg-white border-t border-[#DFEBF4] px-3 py-2">
      {/* Top row: Avatar and date picker */}
      <div className="flex items-center gap-2 mb-2">
        <Avatar initials="MN" size="sm" />
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
          onClick={onGenerateRoute}
          className="flex-1 px-3 py-2 bg-[#0061AA] text-white text-xs font-semibold rounded-full hover:bg-[#005090] transition-colors"
        >
          {existingPlanCount > 0 ? 'Regenerate Route' : 'Generate Route'}
        </button>
      </div>
    </div>
  )
}
