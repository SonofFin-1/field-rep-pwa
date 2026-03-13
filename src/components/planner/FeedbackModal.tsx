import { useState } from 'react'
import { X, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConversionScoreTag } from '@/components/shared'

interface FeedbackModalProps {
  score: number
  isOpen: boolean
  onClose: () => void
  onComplete: (notes: string, accuracy: number) => void
}

export function FeedbackModal({
  score,
  isOpen,
  onClose,
  onComplete,
}: FeedbackModalProps) {
  const [notes, setNotes] = useState('Cold call - expressed interest in smart home integration.')
  const [accuracy, setAccuracy] = useState<number | null>(null)

  if (!isOpen) return null

  const handleComplete = () => {
    if (accuracy !== null) {
      onComplete(notes, accuracy)
      setNotes('')
      setAccuracy(null)
    }
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
              disabled={accuracy === null}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0061AA] rounded-full hover:bg-[#005090] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
