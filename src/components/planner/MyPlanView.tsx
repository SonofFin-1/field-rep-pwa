import { ArrowLeft, Trash2, Navigation, Calendar, Search, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { PlanTimeline } from './PlanTimeline'
import { Avatar } from '@/components/shared'
import type { PlanStop } from '@/data/types'

interface MyPlanViewProps {
  stops: PlanStop[]
  createdDate: Date
  planDate: Date
  onBack: () => void
  onCompleteStop: (stopId: string) => void
  onMarkAllComplete: () => void
  onAcceptRecommended: (stopId: string) => void
  onDenyRecommended: (stopId: string) => void
  onReorderStops: (fromIndex: number, toIndex: number) => void
  onUpdateStopTime?: (stopId: string, newTimeRange: string) => void
  onGetDirections: () => void
  onSchedule: () => void
  onOpenFeedback: () => void
  onDeletePlan?: () => void
  onDateChange?: (date: Date) => void
  hasPlanForDate?: (date: Date) => boolean
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function formatPlanDateLabel(date: Date): string {
  const today = new Date()
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)

  if (isSameDay(date, today)) {
    return 'Today'
  }
  if (isSameDay(date, tomorrow)) {
    return 'Tomorrow'
  }
  if (isSameDay(date, yesterday)) {
    return 'Yesterday'
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })
}

export function MyPlanView({
  stops,
  createdDate,
  planDate,
  onBack,
  onCompleteStop,
  onMarkAllComplete,
  onAcceptRecommended,
  onDenyRecommended,
  onReorderStops,
  onUpdateStopTime,
  onGetDirections,
  onSchedule,
  onDeletePlan,
  onDateChange,
  hasPlanForDate,
}: MyPlanViewProps) {
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const planDateLabel = formatPlanDateLabel(planDate)

  // Navigation helpers
  const handlePrevDay = () => {
    const prevDay = new Date(planDate)
    prevDay.setDate(prevDay.getDate() - 1)
    onDateChange?.(prevDay)
  }

  const handleNextDay = () => {
    const nextDay = new Date(planDate)
    nextDay.setDate(nextDay.getDate() + 1)
    onDateChange?.(nextDay)
  }

  // Check if adjacent days have plans for showing nav arrows
  const prevDay = new Date(planDate)
  prevDay.setDate(prevDay.getDate() - 1)
  const nextDay = new Date(planDate)
  nextDay.setDate(nextDay.getDate() + 1)

  const hasPrevPlan = hasPlanForDate?.(prevDay) ?? false
  const hasNextPlan = hasPlanForDate?.(nextDay) ?? false

  return (
    <div className="w-[374px] h-full flex flex-col bg-white border-r border-[#DFEBF4]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#DFEBF4]">
        <button
          type="button"
          onClick={onBack}
          className="p-2 hover:bg-[#F0F5F7] rounded-full transition-colors -ml-2"
        >
          <ArrowLeft className="w-5 h-5 text-[#46494B]" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm('Delete this plan?')) {
              onDeletePlan?.()
            }
          }}
          className="p-2 hover:bg-[#F0F5F7] rounded-full transition-colors"
        >
          <Trash2 className="w-5 h-5 text-[#778188]" />
        </button>
      </div>

      {/* Plan Title with Date Navigation */}
      <div className="px-4 py-3 border-b border-[#DFEBF4]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Date Navigation */}
            {onDateChange && (
              <button
                type="button"
                onClick={handlePrevDay}
                disabled={!hasPrevPlan}
                className={`p-1 rounded-full transition-colors ${
                  hasPrevPlan
                    ? 'hover:bg-[#F0F5F7] text-[#778188]'
                    : 'text-[#DFEBF4] cursor-not-allowed'
                }`}
                title={hasPrevPlan ? 'Previous day with plan' : 'No plan for previous day'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-semibold text-[#46494B]">
                Plan for {planDateLabel}
              </h2>
              <p className="text-xs text-[#778188] mt-0.5">Created {formattedDate}</p>
            </div>
            {onDateChange && (
              <button
                type="button"
                onClick={handleNextDay}
                disabled={!hasNextPlan}
                className={`p-1 rounded-full transition-colors ${
                  hasNextPlan
                    ? 'hover:bg-[#F0F5F7] text-[#778188]'
                    : 'text-[#DFEBF4] cursor-not-allowed'
                }`}
                title={hasNextPlan ? 'Next day with plan' : 'No plan for next day'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onMarkAllComplete}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#166534] bg-[#DCFCE7] rounded-full hover:bg-[#BBF7D0] transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark All Complete
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <PlanTimeline
          stops={stops}
          onCompleteStop={onCompleteStop}
          onAcceptRecommended={onAcceptRecommended}
          onDenyRecommended={onDenyRecommended}
          onReorderStops={onReorderStops}
          onUpdateStopTime={onUpdateStopTime}
        />
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-3 px-4 py-4 border-t border-[#DFEBF4]">
        <Avatar initials="MN" size="sm" />
        <button
          type="button"
          onClick={onGetDirections}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0061AA] text-white text-sm font-semibold rounded-full hover:bg-[#005090] transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </button>
        <button
          type="button"
          onClick={onSchedule}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-[#46494B] text-sm font-semibold rounded-full border border-[#DFEBF4] hover:bg-[#F0F5F7] transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Schedule
        </button>
      </div>
    </div>
  )
}

// Search bar for the map when in My Plan view
export function PlanMapSearchBar() {
  return (
    <div className="absolute top-4 left-4 right-4 z-[1000]">
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#778188]" />
        <input
          type="text"
          placeholder="Search along the route"
          className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border border-[#DFEBF4] rounded-full text-sm text-[#46494B] placeholder-[#778188] focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 focus:border-[#0061AA] shadow-sm"
        />
      </div>
    </div>
  )
}
