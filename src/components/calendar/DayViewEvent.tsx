import type { ScheduleEvent } from '@/data/types'
import { statusColors, formatTime24to12 } from '@/lib/calendar-utils'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface DayViewEventProps {
  event: ScheduleEvent
  onClick?: (event: ScheduleEvent) => void
  onMarkComplete?: (eventId: string) => void
  column?: number
  totalColumns?: number
  style?: React.CSSProperties
}

const LEFT_MARGIN = 60 // px from left for time labels
const RIGHT_MARGIN = 16 // px from right edge

export function DayViewEvent({ event, onClick, onMarkComplete, column = 0, totalColumns = 1, style }: DayViewEventProps) {
  const colors = statusColors[event.status]
  const isCompleted = event.status === 'completed'

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMarkComplete?.(event.id)
  }

  // Calculate width and left position based on column layout
  // Available width = 100% - LEFT_MARGIN - RIGHT_MARGIN
  // Each column gets an equal share, with a small gap between them
  const gap = 4 // px gap between overlapping events
  const columnWidth = `calc((100% - ${LEFT_MARGIN}px - ${RIGHT_MARGIN}px - ${(totalColumns - 1) * gap}px) / ${totalColumns})`
  const leftOffset = `calc(${LEFT_MARGIN}px + ${column} * ((100% - ${LEFT_MARGIN}px - ${RIGHT_MARGIN}px - ${(totalColumns - 1) * gap}px) / ${totalColumns} + ${gap}px))`

  return (
    <div
      style={{
        ...style,
        left: leftOffset,
        width: columnWidth,
      }}
      className={cn(
        'absolute rounded-lg border-l-4 p-2 text-left transition-shadow hover:shadow-md overflow-hidden cursor-pointer',
        colors.bg,
        colors.border
      )}
    >
      <div className="flex items-start gap-2 h-full overflow-hidden">
        {/* Completion checkbox */}
        <button
          type="button"
          onClick={handleCheckboxClick}
          className={cn(
            'w-5 h-5 mt-0.5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors',
            isCompleted
              ? 'bg-[#166534] border-[#166534]'
              : 'border-[#778188] hover:border-[#0061AA] hover:bg-[#F0F5F7]'
          )}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isCompleted && <Check className="w-3 h-3 text-white" />}
        </button>

        {/* Event content - clickable to edit */}
        <button
          type="button"
          onClick={() => onClick?.(event)}
          className="flex-1 min-w-0 overflow-hidden text-left"
        >
          <p className={cn('text-sm font-medium truncate', colors.text, isCompleted && 'line-through opacity-75')}>
            {event.title}
          </p>
          <p className={cn('text-xs truncate', colors.text)}>
            {formatTime24to12(event.startTime)} - {formatTime24to12(event.endTime)}
          </p>
          {event.leadName && (
            <p className={cn('text-xs truncate mt-0.5', colors.text)}>
              {event.leadName}
            </p>
          )}
          {event.address && (
            <p className={cn('text-xs truncate opacity-75', colors.text)}>
              {event.address}
            </p>
          )}
        </button>
      </div>
    </div>
  )
}
