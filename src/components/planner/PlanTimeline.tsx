import { useState, useRef } from 'react'
import { PlanTimelineItem } from './PlanTimelineItem'
import { StopFeedbackModal } from './StopFeedbackModal'
import type { PlanStop, StopOutcome } from '@/data/types'

interface PlanTimelineProps {
  stops: PlanStop[]
  onCompleteStop: (stopId: string) => void
  onCompleteStopWithFeedback?: (stopId: string, outcome: StopOutcome, feedback: { notes: string; accuracyRating: number }) => void
  onAcceptRecommended: (stopId: string) => void
  onDenyRecommended: (stopId: string) => void
  onReorderStops?: (fromIndex: number, toIndex: number) => void
  onUpdateStopTime?: (stopId: string, newTimeRange: string) => void
}

export function PlanTimeline({
  stops,
  onCompleteStop,
  onCompleteStopWithFeedback,
  onAcceptRecommended,
  onDenyRecommended,
  onReorderStops,
  onUpdateStopTime,
}: PlanTimelineProps) {
  const [feedbackStop, setFeedbackStop] = useState<PlanStop | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragNodeRef = useRef<HTMLDivElement | null>(null)

  const handleCompleteClick = (stop: PlanStop) => {
    // For commute stops, just mark complete directly
    if (stop.type === 'Commute') {
      onCompleteStop(stop.id)
    } else {
      // For other stops, show feedback modal
      setFeedbackStop(stop)
    }
  }

  const handleFeedbackComplete = (notes: string, accuracy: number, outcome: StopOutcome) => {
    if (feedbackStop) {
      console.log('Feedback submitted:', { stopId: feedbackStop.id, notes, accuracy, outcome })
      // Use new feedback-aware completion if available, otherwise fall back
      if (onCompleteStopWithFeedback) {
        onCompleteStopWithFeedback(feedbackStop.id, outcome, { notes, accuracyRating: accuracy })
      } else {
        onCompleteStop(feedbackStop.id)
      }
      setFeedbackStop(null)
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    dragNodeRef.current = e.target as HTMLDivElement
    // Make the drag image slightly transparent
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
    }
    // Add a small delay to set the dragging state for visual feedback
    setTimeout(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = '0.5'
      }
    }, 0)
  }

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragLeave = () => {
    // Don't clear immediately to prevent flickering
  }

  const handleDragEnd = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = '1'
    }
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      onReorderStops?.(draggedIndex, dragOverIndex)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
    dragNodeRef.current = null
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleDragEnd()
  }

  // Track the lead stop index for each stop
  let leadStopIndex = -1

  return (
    <>
      <div className="flex flex-col">
        {stops.map(stop => {
          const isCommute = stop.type === 'Commute'

          // Track the index for non-commute stops
          if (!isCommute) {
            leadStopIndex++
          }
          const currentLeadIndex = leadStopIndex

          // Only non-commute stops are draggable
          if (isCommute) {
            return (
              <PlanTimelineItem
                key={stop.id}
                stop={stop}
                onComplete={() => handleCompleteClick(stop)}
                onAccept={() => onAcceptRecommended(stop.id)}
                onDeny={() => onDenyRecommended(stop.id)}
              />
            )
          }

          return (
            <div
              key={stop.id}
              draggable
              onDragStart={(e) => handleDragStart(e, currentLeadIndex)}
              onDragEnter={(e) => handleDragEnter(e, currentLeadIndex)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              className={`cursor-grab active:cursor-grabbing transition-all ${
                dragOverIndex === currentLeadIndex && draggedIndex !== currentLeadIndex
                  ? 'border-t-2 border-[#0061AA] pt-1'
                  : ''
              }`}
            >
              <PlanTimelineItem
                stop={stop}
                onComplete={() => handleCompleteClick(stop)}
                onAccept={() => onAcceptRecommended(stop.id)}
                onDeny={() => onDenyRecommended(stop.id)}
                onUpdateTime={onUpdateStopTime}
                isDragging={draggedIndex === currentLeadIndex}
              />
            </div>
          )
        })}
      </div>

      {feedbackStop && (
        <StopFeedbackModal
          stop={feedbackStop}
          isOpen={!!feedbackStop}
          onClose={() => setFeedbackStop(null)}
          onComplete={handleFeedbackComplete}
        />
      )}
    </>
  )
}
