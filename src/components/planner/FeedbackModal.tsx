import { useState, useEffect } from 'react'
import { X, Mic, DollarSign, Phone, UserX, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConversionScoreTag } from '@/components/shared'
import type { StopOutcome } from '@/data/types'

interface FeedbackModalProps {
  score: number
  isOpen: boolean
  onClose: () => void
  onComplete: (notes: string, accuracy: number, outcome: StopOutcome) => void
}

const outcomeOptions: { value: StopOutcome; label: string; icon: typeof DollarSign; color: string }[] = [
  { value: 'sale', label: 'Sale', icon: DollarSign, color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'callback', label: 'Callback', icon: Phone, color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'not_interested', label: 'Not Interested', icon: UserX, color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { value: 'not_home', label: 'Not Home', icon: Home, color: 'bg-gray-100 text-gray-700 border-gray-300' },
]

export function FeedbackModal({
  score,
  isOpen,
  onClose,
  onComplete,
}: FeedbackModalProps) {
  const [notes, setNotes] = useState('')
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [outcome, setOutcome] = useState<StopOutcome>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setNotes('')
      setAccuracy(null)
      setOutcome(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleComplete = () => {
    onComplete(notes, accuracy || 0, outcome)
    setNotes('')
    setAccuracy(null)
    setOutcome(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[14px] shadow-xl w-[440px] max-w-[90vw]">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-[#F0F5F7] rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-[#778188]" />
        </button>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[#46494B] text-center">
            How was your stop?
          </h2>

          {/* Outcome */}
          <div className="mt-6">
            <label className="text-sm font-medium text-[#46494B]">
              What was the outcome?
            </label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {outcomeOptions.map((option) => {
                const Icon = option.icon
                const isSelected = outcome === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setOutcome(option.value)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border transition-colors",
                      isSelected
                        ? option.color
                        : "bg-white text-[#46494B] border-[#DFEBF4] hover:border-[#0061AA]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="text-sm font-medium text-[#46494B]">
              Add notes
            </label>
            <div className="relative mt-2">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Enter notes about your visit..."
                className="w-full h-24 px-4 py-3 text-sm text-[#46494B] placeholder-[#778188] border border-[#DFEBF4] rounded-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 focus:border-[#0061AA]"
              />
              <button
                type="button"
                className="absolute bottom-3 right-3 p-1 hover:bg-[#F0F5F7] rounded-full transition-colors"
              >
                <Mic className="w-4 h-4 text-[#778188]" />
              </button>
            </div>
          </div>

          {/* Accuracy Rating */}
          <div className="mt-6">
            <label className="text-sm font-medium text-[#46494B]">
              How accurate was the conversion score?
            </label>
            <div className="flex items-center gap-2 mt-2">
              <ConversionScoreTag score={score} showLabel />
            </div>

            {/* Rating buttons */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setAccuracy(rating)}
                    className={cn(
                      'w-10 h-10 rounded-lg border-2 text-sm font-medium transition-colors',
                      accuracy === rating
                        ? 'bg-[#0061AA] border-[#0061AA] text-white'
                        : 'bg-white border-[#DFEBF4] text-[#46494B] hover:border-[#0061AA]'
                    )}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-[#778188]">
              <span>Inaccurate</span>
              <span>Accurate</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-[#0061AA] hover:bg-[#F0F5F7] rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleComplete}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0061AA] rounded-full hover:bg-[#005090] transition-colors"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
