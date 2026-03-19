import { X, MapPin, Calendar, Clock, User, MessageSquare } from 'lucide-react'
import { Card, Avatar } from '@/components/shared'
import { StopStatusBadge } from './StopStatusBadge'
import { RatingDisplay } from './RatingDisplay'
import { formatShortDate } from '@/lib/utils'
import type { AdminStopRecord } from '@/data/admin-types'

interface StopDetailModalProps {
  stop: AdminStopRecord
  onClose: () => void
}

const outcomeLabels: Record<string, string> = {
  sale: 'Sale',
  callback: 'Callback Requested',
  not_interested: 'Not Interested',
  not_home: 'Not Home',
}

export function StopDetailModal({ stop, onClose }: StopDetailModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-[420px] max-h-[80vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-[#DFEBF4]">
          <div className="flex items-center gap-3">
            <Avatar initials={stop.repInitials} size="lg" />
            <div>
              <h2 className="text-lg font-semibold text-[#46494B]">{stop.leadName}</h2>
              <p className="text-sm text-[#778188]">Rep: {stop.repName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#778188] hover:text-[#46494B] rounded-full hover:bg-[#F0F5F7]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status & Rating */}
          <div className="flex items-center justify-between">
            <StopStatusBadge status={stop.status} />
            <RatingDisplay rating={stop.feedback?.accuracyRating} />
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-[#778188] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-[#46494B]">{stop.address}</p>
                <p className="text-sm text-[#778188]">
                  {stop.city}, {stop.state} {stop.zip}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-[#778188]" />
              <p className="text-sm text-[#46494B]">{formatShortDate(new Date(stop.date))}</p>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={18} className="text-[#778188]" />
              <p className="text-sm text-[#46494B]">
                Scheduled: {stop.scheduledTime}
                {stop.completedTime && ` • Completed: ${stop.completedTime}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <User size={18} className="text-[#778188]" />
              <p className="text-sm text-[#46494B]">
                {stop.outcome ? outcomeLabels[stop.outcome] : 'No outcome recorded'}
              </p>
            </div>
          </div>

          {/* Notes */}
          {stop.feedback?.notes && (
            <div className="pt-3 border-t border-[#DFEBF4]">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={16} className="text-[#0061AA]" />
                <span className="text-sm font-medium text-[#46494B]">Visit Notes</span>
              </div>
              <p className="text-sm text-[#778188] leading-relaxed">
                {stop.feedback.notes}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-[#DFEBF4]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#0061AA] text-white text-sm font-medium rounded-full hover:bg-[#004d8a] transition-colors"
          >
            Close
          </button>
        </div>
      </Card>
    </div>
  )
}
