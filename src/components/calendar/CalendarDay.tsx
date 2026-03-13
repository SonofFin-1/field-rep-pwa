import type { CalendarEvent as CalendarEventType } from '@/data/types'
import { CalendarEvent } from './CalendarEvent'
import { cn } from '@/lib/utils'

interface CalendarDayProps {
  day: number | null
  events: CalendarEventType[]
  isCurrentDay: boolean
  isCurrentMonth: boolean
  onClick?: () => void
}

const MAX_VISIBLE_EVENTS = 2

export function CalendarDay({
  day,
  events,
  isCurrentDay,
  isCurrentMonth,
  onClick,
}: CalendarDayProps) {
  const visibleEvents = events.slice(0, MAX_VISIBLE_EVENTS)
  const remainingCount = events.length - MAX_VISIBLE_EVENTS

  if (day === null) {
    return <div className="min-h-[120px] border-t border-[#DFEBF4]" />
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'min-h-[120px] border-t border-[#DFEBF4] p-2',
        !isCurrentMonth && 'opacity-50',
        onClick && 'cursor-pointer hover:bg-[#F8FAFC] transition-colors'
      )}
    >
      <div className="flex items-start justify-start mb-2">
        <span
          className={cn(
            'w-7 h-7 flex items-center justify-center text-sm font-medium',
            isCurrentDay
              ? 'bg-[#0061AA] text-white rounded-full'
              : 'text-[#46494B]'
          )}
        >
          {day}
        </span>
      </div>
      <div className="space-y-1">
        {visibleEvents.map(event => (
          <CalendarEvent key={event.id} event={event} />
        ))}
        {remainingCount > 0 && (
          <div className="text-xs text-[#778188] pl-2">
            +{remainingCount} more
          </div>
        )}
      </div>
    </div>
  )
}
