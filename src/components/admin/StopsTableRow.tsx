import { MessageSquare } from 'lucide-react'
import { Avatar } from '@/components/shared'
import { StopStatusBadge } from './StopStatusBadge'
import { RatingDisplay } from './RatingDisplay'
import { formatShortDate } from '@/lib/utils'
import type { AdminStopRecord } from '@/data/admin-types'

interface StopsTableRowProps {
  stop: AdminStopRecord
  onClick: (stop: AdminStopRecord) => void
}

const outcomeLabels: Record<string, string> = {
  sale: 'Sale',
  callback: 'Callback',
  not_interested: 'Not Interested',
  not_home: 'Not Home',
}

export function StopsTableRow({ stop, onClick }: StopsTableRowProps) {
  const hasNotes = !!stop.feedback?.notes

  return (
    <div
      onClick={() => onClick(stop)}
      className="flex items-center py-3 px-4 border-b border-[#DFEBF4] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
    >
      {/* Rep */}
      <div className="w-[80px] flex items-center gap-2">
        <Avatar initials={stop.repInitials} size="sm" />
        <span className="text-sm text-[#46494B] font-medium">{stop.repInitials}</span>
      </div>

      {/* Lead Name */}
      <div className="w-[160px]">
        <span className="text-sm text-[#46494B] font-medium truncate block">
          {stop.leadName}
        </span>
      </div>

      {/* Address */}
      <div className="w-[200px]">
        <span className="text-sm text-[#778188] truncate block">
          {stop.address}, {stop.city}
        </span>
      </div>

      {/* Date */}
      <div className="w-[100px]">
        <span className="text-sm text-[#778188]">
          {formatShortDate(new Date(stop.date))}
        </span>
      </div>

      {/* Status */}
      <div className="w-[100px]">
        <StopStatusBadge status={stop.status} />
      </div>

      {/* Outcome */}
      <div className="w-[120px]">
        <span className="text-sm text-[#46494B]">
          {stop.outcome ? outcomeLabels[stop.outcome] : '—'}
        </span>
      </div>

      {/* Notes */}
      <div className="w-[60px] flex items-center justify-center">
        {hasNotes ? (
          <MessageSquare size={16} className="text-[#0061AA]" />
        ) : (
          <span className="text-[#778188]">—</span>
        )}
      </div>

      {/* Rating */}
      <div className="w-[100px]">
        <RatingDisplay rating={stop.feedback?.accuracyRating} showNumeric={false} />
      </div>
    </div>
  )
}
