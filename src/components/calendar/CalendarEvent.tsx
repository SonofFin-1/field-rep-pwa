import type { CalendarEvent as CalendarEventType } from '@/data/types'
import { statusColors } from '@/lib/calendar-utils'
import { cn } from '@/lib/utils'

interface CalendarEventProps {
  event: CalendarEventType
}

export function CalendarEvent({ event }: CalendarEventProps) {
  const getEventStyles = () => {
    // If event has status, use status colors
    if (event.status) {
      const colors = statusColors[event.status]
      return `${colors.bg} ${colors.text}`
    }

    // Otherwise use type-based colors (legacy events)
    switch (event.type) {
      case 'home_assessment':
        return 'bg-[#EBDBFE] text-[#311EAF]'
      case 'plan':
        return 'bg-[#DCFCE7] text-[#166534]'
      case 'appointment':
      default:
        return 'bg-[#F0F5F7] text-[#0061AA]'
    }
  }

  return (
    <div
      className={cn(
        'px-2 py-1 rounded text-xs font-medium truncate',
        getEventStyles()
      )}
    >
      {event.title}
    </div>
  )
}
