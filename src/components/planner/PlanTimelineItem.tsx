import { Check, X, Sparkles, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConversionScoreTag, StatusTag, ContactActions } from '@/components/shared'
import type { PlanStop } from '@/data/types'

interface PlanTimelineItemProps {
  stop: PlanStop
  onComplete?: () => void
  onAccept?: () => void
  onDeny?: () => void
  isDragging?: boolean
}

export function PlanTimelineItem({
  stop,
  onComplete,
  onAccept,
  onDeny,
  isDragging = false,
}: PlanTimelineItemProps) {
  const isCommute = stop.type === 'Commute'
  const isRecommended = stop.isRecommended

  return (
    <div className={cn("flex gap-3", isDragging && "opacity-50")}>
      {/* Drag handle for non-commute stops */}
      {!isCommute && (
        <div className="flex items-start pt-0.5">
          <GripVertical className="w-4 h-4 text-[#778188] cursor-grab active:cursor-grabbing" />
        </div>
      )}

      {/* Timeline indicator */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
            stop.isCompleted
              ? 'bg-[#166534]'
              : isRecommended
              ? 'bg-[#FEF3C7]'
              : 'bg-white border-2 border-[#DFEBF4]'
          )}
        >
          {stop.isCompleted && <Check className="w-4 h-4 text-white" />}
          {isRecommended && !stop.isCompleted && <Sparkles className="w-3 h-3 text-[#C08703]" />}
        </div>
        {/* Line to next item */}
        <div className="w-0.5 flex-1 bg-[#DFEBF4] min-h-[20px]" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-4 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-semibold text-[#46494B]">{stop.type}</span>
              <span className="text-[#778188] ml-1">{stop.timeRange}</span>
            </p>
            {stop.lead && (
              <p className="text-sm text-[#46494B] mt-0.5">{stop.lead.name}</p>
            )}
            {stop.address.split('\n').map((line, idx) => (
              <p key={idx} className="text-xs text-[#778188] mt-0.5">{line}</p>
            ))}
            {stop.notes && !isCommute && (
              <p className="text-xs text-[#778188] italic mt-0.5">{stop.notes}</p>
            )}

            {/* Recommended stop label */}
            {isRecommended && (
              <p className="text-xs text-[#C08703] flex items-center gap-1 mt-1">
                <Sparkles className="w-3 h-3" />
                Recommended stop on the way
              </p>
            )}

            {/* Tags for non-commute stops */}
            {stop.lead && !isCommute && (
              <div className="flex items-center gap-2 mt-2">
                <ConversionScoreTag score={stop.lead.score} />
                <StatusTag status={stop.lead.status} />
              </div>
            )}

            {/* Accept/Deny buttons for recommended */}
            {isRecommended && (
              <div className="flex items-center gap-4 mt-3">
                <button
                  type="button"
                  onClick={onAccept}
                  className="flex items-center gap-1 text-sm text-[#166534] hover:opacity-80"
                >
                  <Check className="w-4 h-4" />
                  Accept
                </button>
                <button
                  type="button"
                  onClick={onDeny}
                  className="flex items-center gap-1 text-sm text-[#778188] hover:opacity-80"
                >
                  <X className="w-4 h-4" />
                  Deny
                </button>
                {stop.lead && (
                  <ContactActions
                    phone={stop.lead.phone}
                    email={stop.lead.email}
                    showPhone={false}
                    showText={false}
                    className="ml-auto"
                  />
                )}
              </div>
            )}

            {/* Contact actions for regular stops with leads */}
            {stop.lead && !isRecommended && !isCommute && (
              <div className="flex items-center mt-2">
                <ContactActions
                  phone={stop.lead.phone}
                  email={stop.lead.email}
                  showPhone={false}
                  showText={false}
                  showEmail={true}
                />
              </div>
            )}
          </div>

          {/* Mark Complete button */}
          {!isRecommended && (
            <button
              type="button"
              onClick={onComplete}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full transition-colors flex-shrink-0",
                stop.isCompleted
                  ? "bg-[#DCFCE7] text-[#166534] hover:bg-[#BBF7D0]"
                  : "bg-[#F0F5F7] text-[#46494B] hover:bg-[#E2E8F0]"
              )}
            >
              <Check className="w-3.5 h-3.5" />
              {stop.isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
