import { useState, useRef, useEffect } from 'react'
import { Check, X, Sparkles, GripVertical, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConversionScoreTag, StatusTag, ContactActions } from '@/components/shared'
import type { PlanStop } from '@/data/types'

interface PlanTimelineItemProps {
  stop: PlanStop
  onComplete?: () => void
  onAccept?: () => void
  onDeny?: () => void
  onUpdateTime?: (stopId: string, newTimeRange: string) => void
  isDragging?: boolean
}

// Convert 12-hour format to 24-hour for input[type="time"]
function to24Hour(time12: string): string {
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return '09:00'
  let hours = parseInt(match[1])
  const mins = match[2]
  const isPM = match[3].toUpperCase() === 'PM'
  if (isPM && hours !== 12) hours += 12
  if (!isPM && hours === 12) hours = 0
  return `${hours.toString().padStart(2, '0')}:${mins}`
}

// Convert 24-hour format to 12-hour display
function to12Hour(time24: string): string {
  const [hours, mins] = time24.split(':').map(Number)
  const isPM = hours >= 12
  const h = hours % 12 || 12
  return `${h}:${mins.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`
}

// Parse time range string into start and end times
function parseTimeRange(timeRange: string): { start: string; end: string } {
  const parts = timeRange.split('-')
  if (parts.length !== 2) return { start: '09:00', end: '10:00' }
  return {
    start: to24Hour(parts[0].trim()),
    end: to24Hour(parts[1].trim()),
  }
}

// Format start and end times into a time range string
function formatTimeRange(start: string, end: string): string {
  return `${to12Hour(start)}-${to12Hour(end)}`
}

export function PlanTimelineItem({
  stop,
  onComplete,
  onAccept,
  onDeny,
  onUpdateTime,
  isDragging = false,
}: PlanTimelineItemProps) {
  const [showTimeEditor, setShowTimeEditor] = useState(false)
  const { start: initialStart, end: initialEnd } = parseTimeRange(stop.timeRange)
  const [startTime, setStartTime] = useState(initialStart)
  const [endTime, setEndTime] = useState(initialEnd)
  const editorRef = useRef<HTMLDivElement>(null)

  const isCommute = stop.type === 'Commute'
  const isRecommended = stop.isRecommended

  // Close editor when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
        setShowTimeEditor(false)
        // Reset to original values
        const { start, end } = parseTimeRange(stop.timeRange)
        setStartTime(start)
        setEndTime(end)
      }
    }
    if (showTimeEditor) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showTimeEditor, stop.timeRange])

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isCommute && onUpdateTime) {
      setShowTimeEditor(true)
    }
  }

  const handleSave = () => {
    if (onUpdateTime) {
      const newTimeRange = formatTimeRange(startTime, endTime)
      onUpdateTime(stop.id, newTimeRange)
    }
    setShowTimeEditor(false)
  }

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
            <div className="text-sm relative">
              <span className="font-semibold text-[#46494B]">{stop.type}</span>
              <span className="text-[#778188] ml-1">{stop.timeRange}</span>
              {!isCommute && onUpdateTime && (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="ml-1 text-[#0061AA] hover:text-[#004d88] inline-flex items-center"
                  title="Edit time"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              )}

              {/* Time Editor Popup */}
              {showTimeEditor && (
                <div
                  ref={editorRef}
                  className="absolute top-6 left-0 z-50 bg-white border border-[#DFEBF4] rounded-lg shadow-lg p-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div>
                      <label className="block text-xs text-[#778188] mb-1">Start</label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="px-2 py-1 text-sm border border-[#DFEBF4] rounded focus:outline-none focus:ring-1 focus:ring-[#0061AA]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#778188] mb-1">End</label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="px-2 py-1 text-sm border border-[#DFEBF4] rounded focus:outline-none focus:ring-1 focus:ring-[#0061AA]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTimeEditor(false)}
                      className="px-3 py-1 text-xs text-[#778188] hover:text-[#46494B]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="px-3 py-1 text-xs font-medium bg-[#0061AA] text-white rounded hover:bg-[#005090]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
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
